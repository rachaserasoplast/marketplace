import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req: NextRequest) {
  try {
    // Ensure uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const condition = formData.get("condition") as string;
    const price = formData.get("price") as string;
    const specs = formData.get("specs") as string;
    const images = formData.getAll("images") as File[];

    if (!name || !category || !condition || !price || !specs || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save image files
    const imagePaths: string[] = [];
    for (const img of images) {
      const bytes = await img.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${img.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${fileName}`);
    }

    // Read products.json
    const productsPath = path.join(process.cwd(), "app/data/products.json");
    let products = [];

    try {
      const data = await readFile(productsPath, "utf-8");
      products = JSON.parse(data);
    } catch {
      // File doesn't exist yet
      products = [];
    }

    // Add new product
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .slice(0, 200);

    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const newProduct = {
      id: Date.now(),
      name,
      slug: uniqueSlug,
      category,
      condition,
      price: Number(price),
      specs,
      images: imagePaths,
      published: true,
    };

    products.push(newProduct);

    // Write updated products.json
    await writeFile(productsPath, JSON.stringify(products, null, 2));

    // If Prisma is available, try to persist to DB as well (best-effort)
    try {
      const { addProduct } = await import("../../../data/products");
      // pass product data without id (DB will create its own id)
      await addProduct({
        name: newProduct.name,
        slug: newProduct.slug,
        category: newProduct.category,
        condition: newProduct.condition,
        price: newProduct.price,
        specs: newProduct.specs,
        images: newProduct.images,
      } as any);
    } catch (e) {
      // ignore - DB may not be configured in this environment
      const errMsg = e instanceof Error ? e.message : String(e);
      console.warn("Could not persist new product to DB:", errMsg);
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
