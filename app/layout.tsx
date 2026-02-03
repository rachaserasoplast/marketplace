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
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">💻</span>
              <span className="text-xl font-bold text-blue-600">
                TechMarket
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search laptops, computers, brands..."
                className="w-full rounded-l-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="rounded-r-md bg-blue-600 px-4 text-white hover:bg-blue-700">
                Search
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="#"
                className="text-sm font-medium hover:text-blue-600"
              >
                Sell
              </a>

              <a
                href="/signup"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium text-white hover:bg-blue-700 text-center"
              >
                Signup
</a>
              {/* Cart (client) */}
              <CartProvider>
                <CartButton />
              </CartProvider>
            </div>
          </div>

          {/* CATEGORY BAR */}
          <div className="bg-slate-50 border-t">
            <div className="max-w-7xl mx-auto px-6 py-3 flex gap-6 text-sm font-medium">
            <a href="/category/all" className="hover:text-blue-600">All</a>
            <a href="/category/brand-new" className="hover:text-blue-600">Brand New</a>
            <a href="/category/second-hand" className="hover:text-blue-600">Second Hand</a>
            <a href="/category/gaming" className="hover:text-blue-600">Gaming Laptops</a>
            <a href="/category/business" className="hover:text-blue-600">Business Laptops</a>
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
