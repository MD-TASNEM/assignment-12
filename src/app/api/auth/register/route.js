import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateToken, verifyPassword } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req) {
  if (req.method !== "POST") {
    return Response.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    await dbConnect();

    const { name, email, password, confirmPassword, phone, nid } =
      await req.json();

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || !nid) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (!verifyPassword(password)) {
      return Response.json(
        {
          message:
            "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter",
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { nid }] });
    if (existingUser) {
      return Response.json(
        { message: "User already exists with this email or NID" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      nid,
    });

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the registration if email fails
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return Response.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
