// app/components/ProductCard.tsx
import Link from "next/link";
import { Product } from "../data/products";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  // Handle both single image (string) and multiple images (array) for backward compatibility
  const images = Array.isArray(product.images) ? product.images : [product.images];
  const mainImage = images[0];

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <div className="relative">
        <img
          src={mainImage}
          alt={product.name}
          className="h-40 w-full object-cover rounded-t-lg"
        />
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {images.length} photos
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              product.condition === "New"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {product.condition}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-2">{product.specs}</p>
        <div className="mt-3 flex items-center gap-3">
          <p className="text-lg font-bold text-blue-600">₱{product.price.toLocaleString()}</p>
          <div className="flex-1"></div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <AddToCartButton product={product} size="small" />
          <Link
            href={`/product/${product.slug ?? product.id}`}
            className="text-center w-full bg-white border border-slate-200 text-slate-700 py-1.5 rounded text-sm hover:bg-slate-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
