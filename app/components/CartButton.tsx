"use client";

import React from "react";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const { totalItems, drawerOpen, openCart, closeCart } = useCart();

  return (
    <>
      <button
        onClick={() => openCart()}
        className="inline-flex items-center justify-center rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-black text-white shadow-lg hover:shadow-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Open cart"
        title="Open cart"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none">
          <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>

        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center shadow border border-slate-200">{totalItems}</span>
        )}
      </button>

      <CartDrawer open={drawerOpen} onClose={() => closeCart()} />
    </>
  );
}