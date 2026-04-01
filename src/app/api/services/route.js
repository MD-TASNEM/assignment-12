import dbConnect from "@/lib/db";
import Service from "@/models/Service";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    if (id) {
      // Get single service
      const service = await Service.findById(id);
      if (!service) {
        return Response.json({ message: "Service not found" }, { status: 404 });
      }
      return Response.json(service);
    }

    // Get all services or filtered by category
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query);
    return Response.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const { name, description, image, category, serviceCharge, features } =
      await req.json();

    // Check authorization (admin only)
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const service = new Service({
      name,
      slug,
      description,
      image,
      category,
      serviceCharge,
      features,
    });

    await service.save();

    return Response.json(
      { message: "Service created successfully", service },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
