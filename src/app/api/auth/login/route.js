import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  if (req.method !== "POST") {
    return Response.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return Response.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
