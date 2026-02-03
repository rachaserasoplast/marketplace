import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // In production you'd validate credentials here. For demo, accept any POST.
    const res = NextResponse.json({ success: true });
    // set a cookie `user_session=logged_in` for demo purposes
    res.cookies.set("user_session", "logged_in", { httpOnly: true, path: "/", sameSite: "lax" });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
