"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../components/ProductForm";
import ProductCard from "../../components/ProductCard";
import ProductTable from "../components/ProductTable";
import AdminLogo from "../components/AdminLogo";
import { Product } from "../../data/products";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-session", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          // Fetch products for dashboard overview
          await fetchProducts();
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Removed router from dependency array

  // Refresh products when switching to dashboard tab
  useEffect(() => {
    if (activeMenu === "dashboard" && isAuthenticated && !loading) {
      fetchProducts();
    }
  }, [activeMenu, isAuthenticated, loading]);

  // Also refresh when the component mounts or when activeMenu changes to dashboard
  useEffect(() => {
    if (activeMenu === "dashboard" && isAuthenticated) {
      const timer = setTimeout(() => fetchProducts(), 100); // Small delay to ensure state is settled
      return () => clearTimeout(timer);
    }
  }, [activeMenu, isAuthenticated]);

  // ProductTable handles fetching & admin operations for products now.

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
    },
    {
      id: "add-product",
      label: "Add Product",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      id: "view-products",
      label: "View Products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const statsCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Brand New",
      value: products.filter(p => p.condition === "New").length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Second Hand",
      value: products.filter(p => p.condition === "Used").length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
    {
      title: "Gaming Laptops",
      value: products.filter(p => p.category === "gaming").length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Business Laptops",
      value: products.filter(p => p.category === "business").length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
    },
    {
      title: "Accessories",
      value: products.filter(p => p.category === "accessories").length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:block`}>
        <div className="p-6">
          <AdminLogo />
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                activeMenu === item.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 md:p-8 overflow-x-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {activeMenu === "dashboard" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {statsCards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.bgColor} p-3 md:p-6 rounded-lg shadow-md`}>
                  <div className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r ${card.color} rounded-full flex items-center justify-center mb-2 md:mb-4 mx-auto md:mx-0`}>
                    <div className="w-4 h-4 md:w-6 md:h-6">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-1 text-center md:text-left">{card.title}</h3>
                  <p className="text-lg md:text-3xl font-bold text-gray-900 text-center md:text-left">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeMenu === "add-product" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Product</h1>
            <ProductForm />
          </div>
        )}
        {activeMenu === "view-products" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Products</h1>
            <ProductTable />
          </div>
        )}
      </div>
    </div>
  );
}
