import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductsLoading,
  setProductsError,
} from "../features/Product/productSlice";

import {
  getProducts,
  createProduct,
  editProduct,
  removeProduct,
} from "../supabase/productService";

const emptyForm = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
  rating: "4.5",
};

const fallbackImage =
  "https://placehold.co/400x400/e0f2fe/334155?text=NikaCart";

const AdminProducts = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imageError, setImageError] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      dispatch(setProductsLoading(true));

      try {
        const data = await getProducts();

        if (!active) return;

        dispatch(setProducts(data));
      } catch (loadError) {
        if (!active) return;

        const message = loadError.message || "Unable to load products.";

        dispatch(setProductsError(message));

        toast.error(message);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const title = String(product.title || "").toLowerCase();

      const id = String(product.id || "").toLowerCase();

      const matchesSearch = title.includes(query) || id.includes(query);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    if (saving) return;

    setEditingProduct(null);
    setForm(emptyForm);
    setImageError(false);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    if (saving) return;

    setEditingProduct(product);

    setForm({
      title: product.title || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
      rating: String(product.rating ?? "4.5"),
    });

    setImageError(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImageError(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const title = form.title.trim();

    const category = form.category.trim();

    const description = form.description.trim();

    const image = form.image.trim();

    const price = Number(form.price);

    const rating = Number(form.rating);

    if (!title || !category || !description || !image) {
      toast.error("Please complete all product fields.");

      return null;
    }

    if (form.price.trim() === "" || !Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid price greater than zero.");

      return null;
    }

    if (
      form.rating.trim() === "" ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      toast.error("Rating must be between 0 and 5.");

      return null;
    }

    return {
      title,
      price,
      category,
      image,
      description,
      rating,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    const productData = validateForm();

    if (!productData) return;

    setSaving(true);

    try {
      if (editingProduct) {
        const updatedProduct = await editProduct(
          editingProduct.id,
          productData,
        );

        dispatch(updateProduct(updatedProduct));

        toast.success("Product updated successfully!");
      } else {
        const newProduct = await createProduct(productData);

        dispatch(addProduct(newProduct));

        toast.success("Product added successfully!");
      }

      setModalOpen(false);
      setEditingProduct(null);
      setForm(emptyForm);
      setImageError(false);
    } catch (saveError) {
      console.error("Product save error:", saveError);

      toast.error(saveError.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await removeProduct(product.id);

      dispatch(deleteProduct(product.id));

      toast.success("Product deleted successfully!");
    } catch (deleteError) {
      console.error("Product delete error:", deleteError);

      toast.error(deleteError.message || "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    dispatch(setProductsLoading(true));

    try {
      const data = await getProducts();

      dispatch(setProducts(data));

      toast.success("Products refreshed.");
    } catch (refreshError) {
      const message = refreshError.message || "Unable to refresh products.";

      dispatch(setProductsError(message));

      toast.error(message);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
            Store Management
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            Products 📦
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add, edit, and organize your NikaCart products.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>

          <button
            type="button"
            onClick={openAddModal}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ＋ Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Products</p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Categories</p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {categories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Showing Results
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {filteredProducts.length}
          </p>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name or ID..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <h3 className="font-black text-slate-900">Product Inventory</h3>

          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            {filteredProducts.length} products
          </span>
        </div>

        {loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div className="px-4 py-16 text-center">
            <p className="text-5xl">⚠️</p>

            <p className="mt-4 font-bold text-red-600">{error}</p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-5 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-5xl">📭</p>

            <p className="mt-3 font-semibold text-slate-600">
              {products.length === 0
                ? "No products have been added yet."
                : "No matching products found."}
            </p>

            {products.length === 0 && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-500 hover:text-slate-950"
              >
                ＋ Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>

                  <th className="px-5 py-4">Category</th>

                  <th className="px-5 py-4">Price</th>

                  <th className="px-5 py-4">Rating</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 transition hover:bg-sky-50/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || fallbackImage}
                          alt={product.title}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;

                            event.currentTarget.src = fallbackImage;
                          }}
                          className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
                        />

                        <div className="min-w-0">
                          <p className="max-w-52 truncate font-bold text-slate-900">
                            {product.title}
                          </p>

                          <p className="mt-1 max-w-52 truncate text-xs text-slate-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-black text-slate-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-amber-600">
                      ⭐ {product.rating ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          disabled={Boolean(deletingId)}
                          className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={Boolean(deletingId)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product.id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                  Product Management
                </p>

                <h3
                  id="product-modal-title"
                  className="mt-1 text-xl font-black text-slate-900"
                >
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close product form"
                className="rounded-lg p-2 text-xl text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="min-h-0 overflow-y-auto p-5 sm:p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Product Title
                  </span>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    disabled={saving}
                    required
                    placeholder="e.g. Nika Oversized Hoodie"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Price ($)
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    disabled={saving}
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="45.00"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Rating
                  </span>

                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    disabled={saving}
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Category
                  </span>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={saving}
                    list="product-categories"
                    required
                    placeholder="Choose or enter a category"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />

                  <datalist id="product-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Image URL
                  </span>

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    disabled={saving}
                    required
                    placeholder="https://example.com/product.jpg"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Description
                  </span>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={saving}
                    required
                    rows={3}
                    placeholder="Describe your product..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-sky-200 bg-sky-50 p-4">
                <p className="mb-3 text-sm font-bold text-slate-700">
                  Image Preview
                </p>

                <div className="flex h-40 items-center justify-center rounded-lg bg-white p-3">
                  {form.image && !imageError ? (
                    <img
                      key={form.image}
                      src={form.image}
                      alt="Product preview"
                      onError={() => setImageError(true)}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <p className="text-3xl">🖼️</p>

                      <p className="mt-2 text-xs">
                        {imageError
                          ? "Image could not be loaded"
                          : "Enter an image URL to preview"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
