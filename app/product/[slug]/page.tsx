import { getProductBySlug, getProductById } from "../../data/products";
import { Product } from "../../data/products";
import AddToCartButton from "../../components/AddToCartButton";
import { redirect } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug: slugOrId } = await params as { slug: string };

  // Try to resolve by slug first
  let product: Product | null = await getProductBySlug(slugOrId);

  // If not found and slug is numeric, try id lookup
  if (!product && /^[0-9]+$/.test(slugOrId)) {
    const id = Number(slugOrId);
    product = await getProductById(id);

    // If found by id and has a slug, redirect to the canonical slug URL
    if (product && (product as any).slug) {
      redirect(`/product/${(product as any).slug}`);
    }
  }

  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Handle both single image (string) and multiple images (array) for backward compatibility
  const images = Array.isArray(product.images) ? product.images : [product.images];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {images.length === 1 ? (
            <img src={images[0]} alt={product.name} className="w-full rounded-lg object-cover" />
          ) : (
            <div className="space-y-4">
              {/* Main image */}
              <img src={images[0]} alt={product.name} className="w-full rounded-lg object-cover" />

              {/* Thumbnail gallery */}
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.category} • {product.condition}</p>
          <p className="text-3xl font-bold text-blue-600 mt-4">₱{product.price.toLocaleString()}</p>

          <div className="mt-4 text-sm text-slate-700">
            <h3 className="font-semibold mb-2">Specifications</h3>
            <p>{product.specs}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
