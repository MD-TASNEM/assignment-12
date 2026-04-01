import axios from "axios";

export async function getLocationData() {
  try {
    // This would fetch from a location API (e.g., Bangladesh locations)
    // For now, we'll return mock data - replace with actual API
    return {
      divisions: [
        "Dhaka",
        "Chattogram",
        "Khulna",
        "Rajshahi",
        "Barisal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
      ],
      districts: {
        Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj"],
        Chattogram: ["Chattogram", "Cox Bazaar", "Rangamati", "Khagrachari"],
        Khulna: ["Khulna", "Jashore", "Satkhira", "Bagerhat"],
        Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Natore"],
        Barisal: ["Barisal", "Bhola", "Pirojpur", "Jhalokati"],
        Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
        Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Nilphamari"],
        Mymensingh: ["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"],
      },
    };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
}
