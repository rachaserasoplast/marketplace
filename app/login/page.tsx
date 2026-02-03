"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") ?? "/";
  const message = search?.get("message");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // redirect to requested page
        router.push(next);
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <p className="text-sm text-slate-500 mb-4">This demo login will sign you in immediately.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Optional fields for future real auth */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input className="mt-1 w-full border rounded px-3 py-2" type="email" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input className="mt-1 w-full border rounded px-3 py-2" type="password" placeholder="password" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-800">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
