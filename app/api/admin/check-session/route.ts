import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");

    if (session?.value && session.value.length > 0) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { authenticated: false, message: "Server error" },
      { status: 500 }
    );
  }
}
