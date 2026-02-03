"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import type { Product } from "../data/products";

export default function AddToCartButton({ product, size = "default" }: { product: Product; size?: "small" | "default" }) {
  const { add, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handle = () => {
    if (disabled) return;
    add(product, 1);
    openCart();
    setAdded(true);
    setDisabled(true);
    setTimeout(() => {
      setAdded(false);
      setDisabled(false);
    }, 1200);
  };

  const baseClass =
    size === "small"
      ? `w-full py-1.5 rounded-md flex items-center justify-center gap-1 text-white text-sm`
      : `w-full py-3 rounded-md flex items-center justify-center gap-2 text-white`;

  const stateClass = added ? "bg-green-500 shadow" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700";

  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      onClick={handle}
      className={`${baseClass} ${stateClass} ${disabledClass}`}
      aria-pressed={added}
      aria-label={added ? (size === "small" ? "Added" : "Added to cart") : (size === "small" ? "Add" : "Add to cart")}
      disabled={disabled}
      title={added ? "Added to cart" : "Add to cart"}
    >
      {added ? (
        <>
          <svg className={`${size === "small" ? "w-3 h-3" : "w-4 h-4"}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {size === "small" ? "Added" : "Added to cart"}
        </>
      ) : (
        <>
          <svg className={`${size === "small" ? "w-3 h-3" : "w-4 h-4"}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3h2l2 11h11l2-8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="20" r="1" fill="currentColor"/>
            <circle cx="18" cy="20" r="1" fill="currentColor"/>
          </svg>
          {size === "small" ? "Add" : "Add to cart"}
        </>
      )}
    </button>
  );
}
