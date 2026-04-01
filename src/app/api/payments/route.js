import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { createPaymentIntent, createCheckoutSession } from "@/lib/stripe";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { bookingId, amount } = await req.json();

    if (!bookingId || !amount) {
      return Response.json(
        { message: "Booking ID and amount are required" },
        { status: 400 },
      );
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.userId.toString() !== decoded.userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, {
      bookingId: bookingId,
      userId: decoded.userId,
    });

    // Create payment record
    const payment = new Payment({
      bookingId,
      userId: decoded.userId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
    });

    await payment.save();

    // Update booking with payment intent
    booking.stripePaymentId = paymentIntent.id;
    await booking.save();

    return Response.json(
      {
        message: "Payment intent created",
        clientSecret: paymentIntent.client_secret,
        payment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      // Get all payments for user
      const payments = await Payment.find({ userId: decoded.userId })
        .populate("bookingId", "bookingId serviceName totalCost")
        .sort({ createdAt: -1 });

      return Response.json(payments);
    }

    // Get payment for specific booking
    const payment = await Payment.findOne({ bookingId }).populate("bookingId");

    if (!payment) {
      return Response.json({ message: "Payment not found" }, { status: 404 });
    }

    return Response.json(payment);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");
    const { status } = await req.json();

    if (!paymentId || !status) {
      return Response.json(
        { message: "Payment ID and status are required" },
        { status: 400 },
      );
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true },
    );

    if (!payment) {
      return Response.json({ message: "Payment not found" }, { status: 404 });
    }

    // Update booking status if payment is successful
    if (status === "completed") {
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        booking.status = "Confirmed";
        booking.paymentStatus = "Paid";
        await booking.save();
      }
    }

    return Response.json({ message: "Payment updated", payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
