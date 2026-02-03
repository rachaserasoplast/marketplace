"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../../data/products";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Edit modal
  const [editing, setEditing] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [opLoading, setOpLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      if (!res.ok) throw new Error("Unauthorized or failed to fetch");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
      setToast("Failed to load products. Make sure you're signed in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.slug || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setEditImageFile(null);
  };

  const closeEdit = () => {
    setEditing(null);
    setEditImageFile(null);
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.image as string;
  };

  const saveEdit = async () => {
    if (!editing) return;
    setEditLoading(true);
    try {
      let imagePath = editing.images?.[0] || (editing as any).image;
      if (editImageFile) {
        imagePath = await uploadImage(editImageFile);
      }

      const body: any = {
        name: editing.name,
        category: editing.category,
        condition: editing.condition,
        price: Number(editing.price),
        specs: editing.specs,
        image: imagePath,
        published: editing.published ?? false,
      };

      const res = await fetch(`/api/admin/products/${encodeURIComponent(editing.slug ?? String(editing.id))}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((cur) => cur.map((p) => (p.slug === data.product.slug ? data.product : p)));
        setToast("Product updated");
        closeEdit();
      } else {
        setToast(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      setToast("Error saving product");
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = (p: Product) => setDeleteTarget(p);

  const doDeleteImmediate = async (p: Product) => {
    setOpLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(p.slug ?? String(p.id))}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((cur) => cur.filter((x) => x.slug !== p.slug && String(x.id) !== String(p.id)));
        setToast("Product deleted");
      } else {
        setToast(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      setToast("Error deleting product");
    } finally {
      setOpLoading(false);
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setOpLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(deleteTarget.slug ?? String(deleteTarget.id))}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((cur) => cur.filter((x) => x.slug !== deleteTarget.slug && String(x.id) !== String(deleteTarget.id)));
        setToast("Product deleted");
        setDeleteTarget(null);
      } else {
        setToast(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      setToast("Error deleting product");
    } finally {
      setOpLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, slug, or category"
            className="px-3 py-2 border rounded w-64 text-sm"
          />
          <button onClick={() => { setSearch(""); setPage(1); fetchProducts(); }} className="px-3 py-2 bg-gray-100 rounded text-sm">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No products found.</div>
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left border-b text-xs text-slate-600">
                  <th className="py-3">Product</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Condition</th>
                  <th className="py-3">Published</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.slug ?? p.id} className="border-b hover:bg-slate-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || (p as any).image} alt={p.name} className="h-12 w-12 object-cover rounded" />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">₱{Number(p.price).toLocaleString()}</td>
                    <td className="py-3">{p.category}</td>
                    <td className="py-3">{p.condition}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-600'}`}>{p.published ? 'Yes' : 'No'}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="px-2 py-1 bg-blue-100 rounded text-xs">Edit</button>
                        <button onClick={() => doDeleteImmediate(p)} className="px-2 py-1 bg-red-100 rounded text-xs">Delete</button>
                        <button onClick={() => setViewing(p)} className="px-2 py-1 bg-white border rounded text-xs">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {paged.map((p) => (
              <div key={p.slug ?? p.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <img src={p.images?.[0] || (p as any).image} alt={p.name} className="h-16 w-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{p.slug}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">₱{Number(p.price).toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-600'}`}>
                        {p.published ? 'Published' : 'Unpublished'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <span>{p.category}</span>
                      <span>•</span>
                      <span>{p.condition}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">Edit</button>
                      <button onClick={() => doDeleteImmediate(p)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">Delete</button>
                      <button onClick={() => setViewing(p)} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium">View</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-100 rounded text-sm">Prev</button>
              <div className="text-sm">{page} / {totalPages}</div>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-gray-100 rounded text-sm">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit product</h3>
              <button onClick={closeEdit} className="text-slate-500">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Name</label>
                <input className="w-full border p-2 rounded" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />

                <label className="block text-sm text-slate-700 mb-1 mt-3">Category</label>
                <input className="w-full border p-2 rounded" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />

                <label className="block text-sm text-slate-700 mb-1 mt-3">Condition</label>
                <select className="w-full border p-2 rounded" value={editing.condition ?? "New"} onChange={(e) => setEditing({ ...editing, condition: e.target.value as any })}>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>

                <label className="block text-sm text-slate-700 mb-1 mt-3">Price</label>
                <input className="w-full border p-2 rounded" value={String(editing.price ?? "")} onChange={(e) => setEditing({ ...editing, price: e.target.value as any })} inputMode="decimal" />

                <label className="block text-sm text-slate-700 mb-1 mt-3">Published</label>
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                    <span className="text-sm">Published (visible in store)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Image</label>
                <div className="mb-3">
                <img src={editing.images?.[0] || (editing as any).image} alt={editing.name ?? ""} className="h-40 w-full object-cover rounded" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setEditImageFile(e.target.files[0])} />

                <label className="block text-sm text-slate-700 mb-1 mt-3">Specs</label>
                <textarea className="w-full border p-2 rounded h-24" value={editing.specs ?? ""} onChange={(e) => setEditing({ ...editing, specs: e.target.value })} />

                <div className="mt-4 flex items-center gap-2">
                  <button onClick={saveEdit} disabled={editLoading} className="px-4 py-2 bg-blue-600 text-white rounded">{editLoading ? 'Saving…' : 'Save changes'}</button>
                  <button onClick={closeEdit} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex items-start gap-4">
                <img src={viewing.images?.[0] || (viewing as any).image} alt={viewing.name} className="h-32 w-32 object-cover rounded" />
                <div>
                  <h3 className="text-xl font-semibold">{viewing.name}</h3>
                  <div className="text-sm text-slate-600">₱{Number(viewing.price).toLocaleString()}</div>
                  <div className="text-sm text-slate-500 mt-1">{viewing.category} • {viewing.condition}</div>
                </div>
              </div>
              <div>
                <button onClick={() => setViewing(null)} className="text-slate-500">✕</button>
              </div>
            </div>
            <div className="text-sm text-slate-700">{viewing.specs}</div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded text-xs ${viewing.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-600'}`}>{viewing.published ? 'Published' : 'Unpublished'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete product</h3>
            <p className="text-sm text-slate-700 mb-4">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={doDelete} disabled={opLoading} className="px-4 py-2 bg-red-600 text-white rounded">{opLoading ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 bg-slate-900 text-white px-4 py-2 rounded shadow">{toast}</div>
      )}
    </div>
  );
}
