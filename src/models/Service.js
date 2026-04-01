import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide service name"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    image: String,
    category: {
      type: String,
      enum: ["baby-care", "elderly-service", "sick-care"],
      required: true,
    },
    serviceCharge: {
      type: Number,
      required: [true, "Please provide service charge per hour"],
      default: 500,
    },
    features: [String],
    caregivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    reviews: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
