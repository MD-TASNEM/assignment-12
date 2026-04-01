import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () =>
        `CARE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: String,
    duration: {
      type: Number,
      required: true, // in hours
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    location: {
      division: String,
      district: String,
      city: String,
      area: String,
      address: String,
    },
    serviceCharge: Number,
    totalCost: Number,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Failed"],
      default: "Unpaid",
    },
    stripePaymentId: String,
    notes: String,
    invoiceSent: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
