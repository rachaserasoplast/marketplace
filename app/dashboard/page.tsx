"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import UserProfile from "../components/UserProfile";
import CartButton from "../components/CartButton";
import { Product } from "../data/products";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(product => product.category.toLowerCase().includes(activeCategory.toLowerCase()));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/check-session", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          await fetchProducts();
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchProducts = async () => {
    try {
      const productRes = await fetch("/api/products");
      const productData = await productRes.json();
      if (productData.success) {
        setProducts(productData.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-orange-600 font-semibold text-lg text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Dashboard Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Welcome to Your Dashboard</h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8">Discover amazing tech deals and manage your account</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="bg-white/20 rounded-full px-3 py-2 sm:px-6 sm:py-3 flex items-center">
                <span className="text-lg sm:text-2xl mr-1 sm:mr-2">💻</span>
                <span className="font-semibold text-sm sm:text-base">Browse Laptops</span>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-2 sm:px-6 sm:py-3 flex items-center">
                <span className="text-lg sm:text-2xl mr-1 sm:mr-2">🛒</span>
                <span className="font-semibold text-sm sm:text-base">Shop Now</span>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-2 sm:px-6 sm:py-3 flex items-center">
                <span className="text-lg sm:text-2xl mr-1 sm:mr-2">⭐</span>
                <span className="font-semibold text-sm sm:text-base">Best Deals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation for Dashboard */}
      <section className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 sm:space-x-4 py-3 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", name: "All Products", icon: "🛒" },
              { id: "brand-new", name: "Brand New", icon: "✨" },
              { id: "second-hand", name: "Second Hand", icon: "🔄" },
              { id: "gaming", name: "Gaming", icon: "🎮" },
              { id: "business", name: "Business", icon: "💼" },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-base sm:text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <UserProfile />
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Products Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {[
                  { id: "all", name: "All Products" },
                  { id: "brand-new", name: "Brand New" },
                  { id: "second-hand", name: "Second Hand" },
                  { id: "gaming", name: "Gaming" },
                  { id: "business", name: "Business" },
                ].find(cat => cat.id === activeCategory)?.name || "All Products"}
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 text-sm sm:text-base">Try selecting a different category or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-transform duration-200">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
