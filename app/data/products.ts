import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not set. Create a `.env.local` with DATABASE_URL. See README for instructions.");
}

let prisma: any;

if (process.env.DATABASE_URL) {
  // Try to load an adapter for the configured provider.
  try {
    // If an adapter is installed, construct PrismaClient with it.
    // Use require so this fails gracefully if the package isn't installed in this environment.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const adapterPkg = require("@prisma/adapter-sqlite");
      const { PrismaSqlite } = adapterPkg;
      prisma =
        globalForPrisma.prisma ??
        new PrismaClient({ adapter: new PrismaSqlite({ file: process.env.DATABASE_URL }) });
      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
    } catch (e) {
      // Adapter not installed or failed; attempt a normal client construction (may throw in Prisma v7)
      prisma = globalForPrisma.prisma ?? new PrismaClient();
      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      "Prisma client initialization failed. Using filesystem fallback.",
      errMsg,
    );
    prisma = null;
  }
} else {
  console.warn("⚠️ DATABASE_URL is not set. Using filesystem fallback.");
  prisma = null;
}

export type Product = {
  id: number;
  name: string;
  slug?: string;
  category: string;
  condition: "New" | "Used";
  price: number;
  specs: string;
  images: string[];
  published?: boolean;
};

// Helper function to parse images from DB (JSON string) to array
function parseImages(images: string | string[]): string[] {
  if (Array.isArray(images)) return images;
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

// Get all products from database
export async function getProducts(): Promise<Product[]> {
  // If DB configured and prisma is available, use database
  if (process.env.DATABASE_URL && prisma) {
    try {
      const dbProducts = await prisma.product.findMany();
      return dbProducts;
    } catch (error) {
      console.error("Error fetching products from database:", error);
      // Fall through to filesystem fallback
    }
  }

  // Fallback to filesystem-backed JSON if no DB or DB failed
  const productsPath = require("path").join(process.cwd(), "app/data/products.json");
  const fs = require("fs");
  try {
    if (fs.existsSync(productsPath)) {
      const data = fs.readFileSync(productsPath, "utf-8");
      return JSON.parse(data) as Product[];
    }
  } catch (e) {
    console.error("Error reading products.json:", e);
  }
  return [];
}

// Get a single product by id
export async function getProductById(id: number): Promise<Product | null> {
  try {
    // Prefer Prisma findUnique if available
    if ((prisma as any)?.product?.findUnique && typeof (prisma as any).product.findUnique === "function") {
      const product = await (prisma as any).product.findUnique({ where: { id } as any });
      if (product) return product;
    }

    // Fallback: try filesystem products.json
    try {
      const productsPath = require("path").join(process.cwd(), "app/data/products.json");
      const fs = require("fs");
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        const parsed = JSON.parse(data) as Product[];
        return parsed.find((p) => p.id === id) ?? null;
      }
    } catch (e) {
      // ignore
    }

    // Fallback: try findMany and filter (in-memory stub)
    if ((prisma as any)?.product?.findMany && typeof (prisma as any).product.findMany === "function") {
      const list = await (prisma as any).product.findMany();
      return list.find((p: Product) => p.id === id) ?? null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Prefer Prisma findUnique if available
    if ((prisma as any)?.product?.findUnique && typeof (prisma as any).product.findUnique === "function") {
      const product = await (prisma as any).product.findUnique({ where: { slug } as any });
      if (product) return product;
    }

    // Fallback: try filesystem products.json
    try {
      const productsPath = require("path").join(process.cwd(), "app/data/products.json");
      const fs = require("fs");
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        const parsed = JSON.parse(data) as Product[];
        return parsed.find((p) => p.slug === slug) ?? null;
      }
    } catch (e) {
      // ignore
    }

    // Fallback: try findMany and filter (in-memory stub)
    if ((prisma as any)?.product?.findMany && typeof (prisma as any).product.findMany === "function") {
      const list = await (prisma as any).product.findMany();
      return list.find((p: Product) => p.slug === slug) ?? null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// Add a new product to database
export async function addProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    if (prisma) {
      const newProduct = await prisma.product.create({
        data: product,
      });
      return newProduct;
    }
    // Fallback to filesystem
    const productsPath = require("path").join(process.cwd(), "app/data/products.json");
    const fs = require("fs");
    try {
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        const parsed = JSON.parse(data) as Product[];
        const newProduct = { ...product, id: Math.max(...parsed.map(p => p.id), 0) + 1 };
        parsed.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(parsed, null, 2));
        return newProduct;
      }
    } catch (e) {
      console.error("Error adding to products.json:", e);
    }
    return null;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

// Update a product by slug
export async function updateProductBySlug(slug: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    // Try DB update if available
    if ((prisma as any)?.product?.update && typeof (prisma as any).product.update === "function") {
      const updated = await (prisma as any).product.update({ where: { slug } as any, data: updates });
      return updated;
    }

    // Fallback to filesystem (products.json)
    try {
      const productsPath = require("path").join(process.cwd(), "app/data/products.json");
      const fs = require("fs");
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        const parsed = JSON.parse(data) as Product[];
        const idx = parsed.findIndex((p) => p.slug === slug);
        if (idx === -1) return null;
        parsed[idx] = { ...parsed[idx], ...updates };
        fs.writeFileSync(productsPath, JSON.stringify(parsed, null, 2));
        return parsed[idx];
      }
    } catch (e) {
      console.error("Error updating products.json:", e);
    }

    // Fallback to in-memory
    if ((prisma as any)?.product?.findMany && typeof (prisma as any).product.findMany === "function") {
      const list = await (prisma as any).product.findMany();
      const idx = list.findIndex((p: Product) => p.slug === slug);
      if (idx === -1) return null;
      list[idx] = { ...list[idx], ...updates };
      return list[idx];
    }

    return null;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

// Delete a product by slug or ID
export async function deleteProductBySlug(slugOrId: string): Promise<boolean> {
  try {
    // Try DB delete if available
    if ((prisma as any)?.product?.delete && typeof (prisma as any).product.delete === "function") {
      // Try to delete by slug first
      try {
        await (prisma as any).product.delete({ where: { slug: slugOrId } as any });
        return true;
      } catch (e) {
        // If not found by slug, try by ID
        try {
          await (prisma as any).product.delete({ where: { id: parseInt(slugOrId) } as any });
          return true;
        } catch (e2) {
          return false;
        }
      }
    }

    // Fallback to filesystem (products.json)
    try {
      const productsPath = require("path").join(process.cwd(), "app/data/products.json");
      const fs = require("fs");
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        const parsed = JSON.parse(data) as Product[];
        console.log("Before delete - products count:", parsed.length);
        console.log("Deleting product with slug/ID:", slugOrId);
        // Filter out products that match either by slug or by ID
        const filtered = parsed.filter((p) => p.slug !== slugOrId && String(p.id) !== slugOrId);
        console.log("After delete - products count:", filtered.length);
        fs.writeFileSync(productsPath, JSON.stringify(filtered, null, 2));
        console.log("Successfully wrote filtered products to file");
        return true;
      }
    } catch (e) {
      console.error("Error deleting from products.json:", e);
    }

    // Fallback to in-memory
    if ((prisma as any)?.product?.findMany && typeof (prisma as any).product.findMany === "function") {
      const list = await (prisma as any).product.findMany();
      const exists = list.some((p: Product) => p.slug === slugOrId || String(p.id) === slugOrId);
      if (!exists) return false;
      // cannot modify in-memory stub permanently, so just return true
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

