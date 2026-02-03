import { NextRequest, NextResponse } from "next/server";
import { updateProductBySlug, deleteProductBySlug, getProducts } from "../../../../data/products";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "logged_in") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const updates = await req.json();
    const updated = await updateProductBySlug(slug, updates);
    if (!updated) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log("DELETE request received for:", slug);

    const session = req.cookies.get("admin_session");
    if (session?.value !== "logged_in") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Try to delete by slug/ID directly
    const deleted = await deleteProductBySlug(slug);
    console.log("Delete result:", deleted);

    if (!deleted) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
