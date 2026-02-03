"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import type { Product } from "../data/products";

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  // Drawer control
  drawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Last added item id (for highlight)
  lastAddedId: number | null;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);
  const lastAddedTimeout = useRef<number | null>(null);

  // Clear pending timeout on unmount
  useEffect(() => {
    return () => {
      if (lastAddedTimeout.current) clearTimeout(lastAddedTimeout.current);
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tm_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tm_cart", JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const add = (product: Product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === product.id);
      if (found) {
        return cur.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...cur, { ...product, quantity: qty }];
    });

    // Highlight the added item briefly
    setLastAddedId(product.id);
    if (lastAddedTimeout.current) clearTimeout(lastAddedTimeout.current);
    lastAddedTimeout.current = window.setTimeout(() => setLastAddedId(null), 2500);
  };

  const remove = (id: number) => setItems((cur) => cur.filter((i) => i.id !== id));

  const updateQuantity = (id: number, qty: number) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  };

  const clear = () => setItems([]);

  const openCart = () => setDrawerOpen(true);
  const closeCart = () => setDrawerOpen(false);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQuantity, clear, totalItems, totalPrice, drawerOpen, openCart, closeCart, lastAddedId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
