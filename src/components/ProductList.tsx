import { useEffect, useState } from "react";
import {
  getProductsPaginated,
  searchProducts,
  getProductsByCategory,
  sortProducts,
  getCategories,
  addProduct,
} from "../api/productApi";

import type { Product, Category } from "../types/product";
import ProductItem from "./ProductItem";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortControl from "./SortControl";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0); // total produk
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState(""); // string dulu
  const [newCategory, setNewCategory] = useState("");

  const [limit, setLimit] = useState(5); // default 5 per page
  const [page, setPage] = useState(1);

  // Load products & categories
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProductsPaginated({
        limit,
        skip: (page - 1) * limit,
        select: ["id", "title", "price", "thumbnail", "category"],
      }),
      getCategories(),
    ])
      .then(([data, cats]) => {
        setProducts(data.products);
        setTotal(data.total);
        setCategories(cats);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [page, limit]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalPages = Math.ceil(total / limit);

  const handleAddProduct = async () => {
    if (!newTitle || !newCategory)
      return alert("Title and Category are required");

    try {
      const added = await addProduct({
        title: newTitle,
        price: Number(newPrice) || 0,
        category: newCategory,
        thumbnail: newThumbnail, // kirim URL thumbnail
      });

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
      {/* === ADD NEW PRODUCT FORM === */}
      <div style={{ marginBottom: 24 }}>
        <h3>Add New Product</h3>
        <input
          type="text"
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
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // convert file ke base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewThumbnail(reader.result as string); // simpan base64 string
      };
      reader.readAsDataURL(file);
    }
  }}
  style={{ marginLeft: 8 }}
/>

{newThumbnail && (
  <img
    src={newThumbnail}
    alt="Thumbnail preview"
    style={{ width: 80, height: 80, marginLeft: 8, objectFit: "cover" }}
  />
)}

        <button onClick={handleAddProduct} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* === FILTER, SEARCH, SORT === */}
      <SearchBar
        onSearch={(q) =>
          q
            ? searchProducts(q).then((d) => setProducts(d.products))
            : getProductsPaginated({ limit, skip: (page - 1) * limit }).then(
                (d) => setProducts(d.products)
              )
        }
      />
      <CategoryFilter
        categories={categories}
        onSelect={(c) =>
          c
            ? getProductsByCategory(c).then((d) => setProducts(d.products))
            : getProductsPaginated({ limit, skip: (page - 1) * limit }).then(
                (d) => setProducts(d.products)
              )
        }
      />
      <SortControl
        onSort={(o) =>
          sortProducts("title", o).then((d) => setProducts(d.products))
        }
      />

      {/* === ITEMS PER PAGE DROPDOWN === */}
      <div style={{ marginTop: 12 }}>
        <label>
          Items per page:{" "}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // reset page saat limit berubah
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
          onDelete={(id) =>
            setProducts((prev) => prev.filter((p) => p.id !== id))
          }
        />
      ))}

      {/* === PAGINATION === */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
