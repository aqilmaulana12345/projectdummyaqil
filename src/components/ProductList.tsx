import { useEffect, useState } from "react";
import {
  getProductsPaginated,
  searchProducts,
  getProductsByCategory,
  sortProducts,
  getCategories,
  addProduct,
  deleteProduct,
} from "../api/productApi";

import type { Product, Category } from "../types/product";
import ProductItem from "./ProductItem";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortControl from "./SortControl";

type Mode = "page" | "search" | "category" | "sort";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [newThumbnail, setNewThumbnail] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<Mode>("page");

  /* ======================
     LOAD CATEGORIES (ONCE)
     ====================== */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ======================
     LOAD PRODUCTS (PAGINATION ONLY)
     ====================== */
  useEffect(() => {
    if (mode !== "page") return;

    setLoading(true);
    getProductsPaginated({
      limit,
      skip: (page - 1) * limit,
      select: ["id", "title", "price", "thumbnail", "category"],
    })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, limit, mode]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalPages = Math.ceil(total / limit);

  /* ======================
     ADD PRODUCT
     ====================== */
  const handleAddProduct = async () => {
    if (!newTitle || !newCategory) {
      alert("Title and Category are required");
      return;
    }

    try {
      const added = await addProduct({
        title: newTitle,
        price: Number(newPrice) || 0,
        category: newCategory,
        thumbnail: newThumbnail || "https://via.placeholder.com/150",
      });

      // reset ke pagination
      setMode("page");
      setPage(1);
      setProducts((prev) => [added, ...prev]);

      setNewTitle("");
      setNewPrice("");
      setNewCategory("");
      setNewThumbnail("");
    } catch {
      alert("Failed to add product");
    }
  };

  return (
    <div>
      {/* === ADD PRODUCT === */}
      <div style={{ marginBottom: 24 }}>
        <h3>Add New Product</h3>
        <input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id ?? c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Thumbnail URL"
          value={newThumbnail}
          onChange={(e) => setNewThumbnail(e.target.value)}
          style={{ marginLeft: 8, width: 250 }}
        />
        <button onClick={handleAddProduct} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* === SEARCH / FILTER / SORT === */}
      <SearchBar
        onSearch={(q) => {
          if (!q) {
            setMode("page");
            return;
          }
          setMode("search");
          searchProducts(q).then((d) => setProducts(d.products));
        }}
      />

      <CategoryFilter
        categories={categories}
        onSelect={(c) => {
          if (!c) {
            setMode("page");
            return;
          }
          setMode("category");
          getProductsByCategory(c).then((d) => setProducts(d.products));
        }}
      />

      <SortControl
        onSort={(o) => {
          setMode("sort");
          sortProducts("title", o).then((d) => setProducts(d.products));
        }}
      />

      {/* === ITEMS PER PAGE === */}
      <div style={{ marginTop: 12 }}>
        <label>
          Items per page:{" "}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
              setMode("page");
            }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </label>
      </div>

      {/* === PRODUCT LIST === */}
      {products.length === 0 && <p>No products found</p>}
      {products.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onUpdate={(u) =>
            setProducts((prev) =>
              prev.map((p) => (p.id === u.id ? u : p))
            )
          }
          onDelete={async (id) => {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }}
        />
      ))}

      {/* === PAGINATION === */}
      {mode === "page" && (
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
