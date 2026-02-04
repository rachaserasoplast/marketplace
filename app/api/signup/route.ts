import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Simple in-memory rate limiting for Next.js
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 3, windowMs: number = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Apply rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many signup attempts, please try again later." },
        { status: 429 }
      );
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
