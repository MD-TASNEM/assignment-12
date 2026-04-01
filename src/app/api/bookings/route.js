import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import User from "@/models/User";
import { sendInvoiceEmail, sendBookingConfirmationEmail } from "@/lib/email";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");

    if (bookingId) {
      const booking = await Booking.findById(bookingId)
        .populate("serviceId", "name description image")
        .populate("userId", "name email phone");

      if (!booking) {
        return Response.json({ message: "Booking not found" }, { status: 404 });
      }

      if (
        booking.userId._id.toString() !== decoded.userId &&
        req.headers.get("role") !== "admin"
      ) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      }

      return Response.json(booking);
    }

    // Get all bookings for user
    const bookings = await Booking.find({ userId: decoded.userId })
      .populate("serviceId", "name description image")
      .sort({ createdAt: -1 });

    return Response.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { serviceId, duration, startDate, location } = await req.json();

    // Validate input
    if (!serviceId || !duration || !startDate || !location) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return Response.json({ message: "Service not found" }, { status: 404 });
    }

    // Get user details
    const user = await User.findById(decoded.userId);

    // Calculate total cost
    const totalCost = duration * service.serviceCharge;
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + duration);

    // Create booking
    const booking = new Booking({
      userId: decoded.userId,
      serviceId,
      serviceName: service.name,
      duration,
      startDate,
      endDate,
      location,
      serviceCharge: service.serviceCharge,
      totalCost,
    });

    await booking.save();

    // Send invoice email
    try {
      await sendInvoiceEmail(user.email, {
        bookingId: booking.bookingId,
        serviceName: service.name,
        duration,
        serviceCharge: service.serviceCharge,
        totalCost,
        location,
        status: booking.status,
        createdAt: booking.createdAt,
      });

      // Mark invoice as sent
      booking.invoiceSent = true;
      await booking.save();
    } catch (emailError) {
      console.error("Error sending invoice:", emailError);
      // Don't fail the booking if email fails
    }

    return Response.json(
      { message: "Booking created successfully", booking },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");
    const { status } = await req.json();

    if (!bookingId || !status) {
      return Response.json(
        { message: "Booking ID and status are required" },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    if (
      booking.userId.toString() !== decoded.userId &&
      req.headers.get("role") !== "admin"
    ) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update status
    booking.status = status;
    await booking.save();

    return Response.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return Response.json(
        { message: "Booking ID is required" },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    if (
      booking.userId.toString() !== decoded.userId &&
      req.headers.get("role") !== "admin"
    ) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Cancel booking instead of delete
    booking.status = "Cancelled";
    await booking.save();

    return Response.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
