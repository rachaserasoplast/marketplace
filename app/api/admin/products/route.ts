import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../../../data/products";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "logged_in") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
