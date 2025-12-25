import { useState } from "react";
import { addProduct } from "../api/productApi";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // string dulu, konversi nanti
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!title || !category) return setMessage("Title and Category required");

    try {
      const res = await addProduct({
        title,
        price: Number(price) || 0,
        category,
      });

      setMessage(`Product added: ${res.title}`);
      setTitle("");
      setPrice("");
      setCategory("");
    } catch (err) {
      setMessage("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        placeholder="Product title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
      <p>{message}</p>
    </div>
  );
}
