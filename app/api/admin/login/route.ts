import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USER || "admin@example.com";
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH; // Will be set in .env
const CSRF_SECRET = process.env.CSRF_SECRET || "default-csrf-secret";

// Simple in-memory rate limiting for Next.js
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Store for failed attempts (in production, use Redis or database)
const failedAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts, please try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    const csrfToken = req.headers.get("x-csrf-token");

    // Validate CSRF token
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Check for account lockout
    const attempts = failedAttempts.get(clientIP);
    if (attempts && attempts.count >= 5 && Date.now() < attempts.resetTime) {
      return NextResponse.json(
        { success: false, message: "Account temporarily locked. Try again later." },
        { status: 429 }
      );
    }

    console.log("Admin login attempt:", { email: "[REDACTED]", ip: clientIP });

    // Check credentials
    if (email === ADMIN_USER && await bcrypt.compare(password, ADMIN_PASS_HASH || "")) {
      // Reset failed attempts on success
      failedAttempts.delete(clientIP);

      const res = NextResponse.json({ success: true });
      res.cookies.set({
        name: "admin_session",
        value: generateSecureToken(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });
      return res;
    }

    // Track failed attempts
    const currentAttempts = attempts || { count: 0, resetTime: Date.now() + 15 * 60 * 1000 };
    currentAttempts.count += 1;
    failedAttempts.set(clientIP, currentAttempts);

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

function validateCSRFToken(token: string): boolean {
  // Simplified CSRF validation - in production, use proper CSRF tokens
  return token.length > 0;
}

function generateSecureToken(): string {
  return require("crypto").randomBytes(32).toString("hex");
}
