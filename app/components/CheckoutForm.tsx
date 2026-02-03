"use client";

import React from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();
  const placing = false;

  async function placeOrder() {
    // This is a demo: in a real app you'd call your orders API here
    clear();
    router.push("/?ordered=1");
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          <div className="divide-y">
            {items.map((it) => (
              <div key={it.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-slate-500">{it.quantity} × ₱{it.price.toLocaleString()}</p>
                </div>

                <p className="font-semibold">₱{(it.price * it.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="font-semibold">Total</p>
            <p className="text-xl font-bold">₱{totalPrice.toLocaleString()}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={placeOrder}
              className="w-full py-3 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
