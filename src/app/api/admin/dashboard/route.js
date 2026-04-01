import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Service from "@/models/Service";
import { verifyToken } from "@/lib/auth";

// Middleware to check admin role
async function checkAdmin(req, userId) {
  const user = await User.findById(userId);
  return user && user.role === "admin";
}

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const isAdmin = await checkAdmin(req, decoded.userId);

    if (!isAdmin) {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "dashboard";

    if (type === "dashboard") {
      // Dashboard stats
      const totalBookings = await Booking.countDocuments();
      const totalPayments = await Payment.countDocuments({
        status: "completed",
      });
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalRevenue = await Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const recentBookings = await Booking.find()
        .populate("userId", "name email")
        .populate("serviceId", "name")
        .sort({ createdAt: -1 })
        .limit(10);

      return Response.json({
        stats: {
          totalBookings,
          totalPayments,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentBookings,
      });
    }

    if (type === "payments") {
      // Payment history
      const payments = await Payment.find()
        .populate("bookingId", "bookingId serviceName totalCost")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      return Response.json(payments);
    }

    if (type === "bookings") {
      // All bookings with details
      const bookings = await Booking.find()
        .populate("userId", "name email phone")
        .populate("serviceId", "name category")
        .sort({ createdAt: -1 });

      return Response.json(bookings);
    }

    return Response.json({ message: "Invalid query type" }, { status: 400 });
  } catch (error) {
    console.error("Error in admin endpoint:", error);
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
    const isAdmin = await checkAdmin(req, decoded.userId);

    if (!isAdmin) {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 },
      );
    }

    const { action, bookingId, status } = await req.json();

    if (action === "update-booking-status") {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true },
      );

      if (!booking) {
        return Response.json({ message: "Booking not found" }, { status: 404 });
      }

      return Response.json({ message: "Booking updated", booking });
    }

    return Response.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in admin endpoint:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
