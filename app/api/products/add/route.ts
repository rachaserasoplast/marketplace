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

    // Check if product with same name already exists (Lazada-style: one product per name)
    // Use slug comparison for better matching (handles spaces, special chars, case)
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const baseSlug = slugify(name);
    const existingProductIndex = products.findIndex((p: any) => p.slug.startsWith(baseSlug));

    let product;
    if (existingProductIndex !== -1) {
      // Update existing product: append new images to existing ones, update other fields
      product = products[existingProductIndex];
      product.images = Array.isArray(product.images) ? [...product.images, ...imagePaths] : imagePaths;
      product.category = category;
      product.condition = condition;
      product.price = Number(price);
      product.specs = specs;
      // Keep existing slug and id
    } else {
      // Create new product
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
          .slice(0, 200);

      const baseSlug = slugify(name);
      const uniqueSlug = `${baseSlug}-${Date.now()}`;

      product = {
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

      products.push(product);
    }

    // Write updated products.json
    await writeFile(productsPath, JSON.stringify(products, null, 2));

    // If Prisma is available, try to persist to DB as well (best-effort)
    try {
      const { addProduct } = await import("../../../data/products");
      // pass product data without id (DB will create its own id)
      await addProduct({
        name: product.name,
        slug: product.slug,
        category: product.category,
        condition: product.condition,
        price: product.price,
        specs: product.specs,
        images: product.images,
      } as any);
    } catch (e) {
      // ignore - DB may not be configured in this environment
      const errMsg = e instanceof Error ? e.message : String(e);
      console.warn("Could not persist new product to DB:", errMsg);
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
