import dbConnect from "@/lib/db";
import Service from "@/models/Service";

const initialServices = [
  {
    name: "Baby Care & Babysitting",
    slug: "baby-care-and-babysitting",
    description:
      "Professional babysitting services for your little ones. Our experienced caregivers provide safe, nurturing care while you are away.",
    category: "baby-care",
    serviceCharge: 500,
    features: [
      "Experienced caregivers",
      "Safe and nurturing environment",
      "Play and activities",
      "Meal preparation",
      "Emergency response trained",
    ],
    rating: 4.8,
    reviews: 250,
    isActive: true,
  },
  {
    name: "Elderly Care Services",
    slug: "elderly-care-services",
    description:
      "Compassionate elderly care services including companionship, medication reminders, and daily activity assistance.",
    category: "elderly-service",
    serviceCharge: 600,
    features: [
      "Companion care",
      "Medication reminders",
      "Meal assistance",
      "Light housekeeping",
      "Mobility assistance",
      "Doctor appointment support",
    ],
    rating: 4.9,
    reviews: 320,
    isActive: true,
  },
  {
    name: "Sick Care & Medical Support",
    slug: "sick-care-and-medical-support",
    description:
      "Dedicated care for individuals recovering from illness or injury. Our trained caregivers provide medical support and comfort care.",
    category: "sick-care",
    serviceCharge: 700,
    features: [
      "Nursing assistance",
      "Medication management",
      "Recovery monitoring",
      "Hygiene assistance",
      "Wound care support",
      "Physical therapy assistance",
    ],
    rating: 4.7,
    reviews: 180,
    isActive: true,
  },
];

export async function GET(req) {
  try {
    await dbConnect();

    // Check if services already exist
    const existingServices = await Service.countDocuments();

    if (existingServices > 0) {
      return Response.json(
        { message: "Services already initialized", count: existingServices },
        { status: 200 },
      );
    }

    // Insert initial services
    const createdServices = await Service.insertMany(initialServices);

    return Response.json(
      {
        message: "Database initialized successfully",
        count: createdServices.length,
        services: createdServices,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
