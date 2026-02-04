import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "./components/CartContext";
import CartButton from "./components/CartButton";

export const metadata: Metadata = {
  title: "Tech Marketplace",
  description: "Buy brand new and second-hand computers and laptops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        {/* HEADER */}
        <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 sticky top-0 z-50 shadow-2xl backdrop-blur-md bg-opacity-90">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/images/logo.png"
                alt="TechMarket Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse"
              />
              <span className="text-xl sm:text-2xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TechMarket
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search laptops, computers, brands..."
                  className="w-full rounded-l-full border-0 px-5 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/10 backdrop-blur-lg text-white placeholder-gray-300 shadow-lg transition-all duration-300"
                />
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-300 text-lg">🔍</span>
              </div>
              <button className="rounded-r-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-white font-semibold hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Search
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/signup"
                className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="text-sm sm:text-lg">👤</span> Signup
              </a>
              {/* Cart (client) */}
              <CartProvider>
                <CartButton />
              </CartProvider>
            </div>
          </div>

          {/* CATEGORY BAR */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-purple-500/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto">
              <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-semibold whitespace-nowrap">
                <a href="/category/all" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300">All</a>
                <a href="/category/brand-new" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300">Brand New</a>
                <a href="/category/second-hand" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300">Second Hand</a>
                <a href="/category/gaming" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300">Gaming Laptops</a>
                <a href="/category/business" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300">Business Laptops</a>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT (wrapped by CartProvider so AddToCart can use cart) */}
        <CartProvider>
          <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </CartProvider>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-300">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-white font-semibold mb-3">TechMarket</h3>
              <p className="text-sm">
                Your trusted marketplace for brand new and second-hand laptops
                and computers.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:text-white" href="#">Brand New</a></li>
                <li><a className="hover:text-white" href="#">Second Hand</a></li>
                <li><a className="hover:text-white" href="#">Gaming</a></li>
                <li><a className="hover:text-white" href="#">Business</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:text-white" href="#">Contact</a></li>
                <li><a className="hover:text-white" href="#">Warranty</a></li>
                <li><a className="hover:text-white" href="#">Returns</a></li>
                <li><a className="hover:text-white" href="#">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:text-white" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-white" href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 py-4 text-center text-sm">
            © {new Date().getFullYear()} TechMarket. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
