import { useState } from "react";
import type { Product } from "../types/product";
import { updateProduct } from "../api/productApi";

type Props = {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (id: number) => void;
};

export default function ProductItem({ product, onUpdate, onDelete }: Props) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [thumbnail, setThumbnail] = useState(product.thumbnail);

  const handleUpdate = async () => {
    try {
      // update title & price dulu
      const updated = await updateProduct(product.id, { title, price });
      onUpdate({ ...updated, thumbnail }); // merge thumbnail dari state
      setEdit(false);
    } catch {
      alert("Failed to update product");
    }
  };
  

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 16,
        alignItems: "center",
        padding: 16,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* KIRI: GAMBAR */}
      <img
        src={thumbnail}
        alt={title}
        width={120}
        height={120}
        style={{ objectFit: "cover", borderRadius: 12 }}
      />

      {/* KANAN */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* INFO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {edit && (
  <input
    type="text"
    placeholder="Thumbnail URL"
    value={thumbnail}
    onChange={(e) => setThumbnail(e.target.value)}
    style={{ padding: 8 }}
  />
)}


          {edit ? (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ padding: 8 }}
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Price"
                style={{ padding: 8 }}
              />
            </>
          ) : (
            <>
              <strong>{title}</strong>
              <p style={{ margin: "4px 0", color: "#4f46e5" }}>${price}</p>
            </>
          )}
        </div>

        {/* ACTION */}
        <div style={{ display: "flex", gap: 8 }}>
          {edit ? (
            <>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEdit(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={() => onDelete(product.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
