"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, totalItems, totalPrice, clear, updateQuantity, lastAddedId } = useCart();
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (lastAddedId && itemRefs.current[lastAddedId]) {
      // scroll the added item into view inside the drawer
      itemRefs.current[lastAddedId]!.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [lastAddedId]);

  // Render overlay always for accessibility but hide when closed.
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-out">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={clear}
                className="text-sm text-red-500 hover:text-red-600"
                aria-label="Clear cart"
              >
                Clear
              </button>

              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-slate-100"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-600">Your cart is empty.</p>
                <p className="text-xs text-slate-400 mt-2">Add products to get started</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => { itemRefs.current[item.id] = el }}
                  className={`flex items-center gap-4 border rounded-lg p-3 ${item.id === lastAddedId ? 'ring-2 ring-yellow-400/60 bg-yellow-50 animate-pulse' : ''}`}
                >
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.category} • {item.condition}</p>
                      </div>

                      <p className="text-sm font-bold">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center border rounded-md overflow-hidden">
                        <button
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <div className="px-4 py-1 text-sm">{item.quantity}</div>
                        <button
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button className="text-sm text-red-500" onClick={() => remove(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm text-slate-500">Items</p>
                <p className="font-semibold">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold">₱{totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={async () => {
                if (items.length === 0) return;
                setChecking(true);
                try {
                  const res = await fetch('/api/check-session');
                  if (res.ok) {
                    router.push('/checkout');
                    onClose();
                  } else {
                    const next = encodeURIComponent('/checkout');
                    router.push(`/login?next=${next}`);
                    onClose();
                  }
                } catch (e) {
                  const next = encodeURIComponent('/checkout');
                  router.push(`/login?next=${next}`);
                } finally {
                  setChecking(false);
                }
              }}
              className={`w-full py-3 rounded-md text-white ${items.length === 0 ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"}`}
              disabled={items.length === 0 || checking}
            >
              {checking ? 'Checking...' : 'Checkout'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
