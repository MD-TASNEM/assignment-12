import dbConnect from "@/lib/db";
import Service from "@/models/Service";

const services = [
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
  {
    name: "Premium Baby Care Package",
    slug: "premium-baby-care-package",
    description:
      "Premium babysitting service with educational activities, advanced first aid, and extended hours availability.",
    category: "baby-care",
    serviceCharge: 800,
    features: [
      "Educational playtime",
      "Advanced CPR certified",
      "Available 24/7",
      "Multiple language support",
      "Progress reports",
      "Flexible scheduling",
    ],
    rating: 5.0,
    reviews: 150,
    isActive: true,
  },
  {
    name: "Full-Time Elderly Care",
    slug: "full-time-elderly-care",
    description:
      "Comprehensive full-time elderly care with round-the-clock support for seniors with special medical needs.",
    category: "elderly-service",
    serviceCharge: 1000,
    features: [
      "Round-the-clock availability",
      "Medical background",
      "Specialized care",
      "Family communication",
      "Personalized care plans",
      "Emergency protocols",
    ],
    rating: 4.85,
    reviews: 200,
    isActive: true,
  },
];

export async function seedServices() {
  try {
    await dbConnect();

    // Clear existing services
    await Service.deleteMany({});

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log(`${createdServices.length} services seeded successfully`);

    return createdServices;
  } catch (error) {
    console.error("Error seeding services:", error);
    throw error;
  }
}

export default seedServices;
