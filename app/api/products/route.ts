import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../../data/products";

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
