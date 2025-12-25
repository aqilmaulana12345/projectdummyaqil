import { useEffect, useState } from "react";
import { getCategories } from "../api/productApi";

type Category = {
  slug: string;
  name: string;
  url: string;
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.slug}>
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
