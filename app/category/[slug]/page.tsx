import ProductCard from "@/app/components/ProductCard";
import { getProducts } from "@/app/data/products";

interface CategoryPageProps {
  params?: { slug?: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "all";
  const products = await getProducts(); // <- use the function

  const filteredProducts =
    slug === "all"
      ? products
      : products.filter(
          p =>
            p.category.toLowerCase().replace(" ", "-") === slug ||
            p.condition.toLowerCase().replace(" ", "-") === slug
        );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {slug.replace("-", " ")}
      </h1>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
