import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

// Rate limiting for signup (3 attempts per hour)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: "Too many signup attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await limiter(req as any);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { email, password, username } = await req.json();

    // Basic validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, message: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Username validation
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: "Username must be between 3 and 20 characters" },
        { status: 400 }
      );
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // For demo purposes, we'll just simulate successful signup
    // In a real app, you'd save to database
    console.log("User signup:", { email: "[REDACTED]", username, password: "[HASHED]" });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email for verification."
    });

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
