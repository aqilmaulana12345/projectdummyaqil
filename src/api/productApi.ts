const BASE_URL = "https://dummyjson.com/products";

const handleResponse = async (res: Response) => {
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

// Ambil semua produk
export const getAllProducts = () =>
  fetch(BASE_URL).then(handleResponse);

// 🔹 SINGLE PRODUCT (BARU)
export const getSingleProduct = (id: number) =>
  fetch(`${BASE_URL}/${id}`).then(handleResponse);

// Search produk berdasarkan query
export const searchProducts = (q: string) =>
  fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`).then(handleResponse);

// Ambil produk berdasarkan category
export const getProductsByCategory = (category: string) =>
  fetch(`${BASE_URL}/category/${category}`).then(handleResponse);

// Ambil semua category
export const getCategories = () =>
  fetch(`${BASE_URL}/categories`).then(handleResponse);

// Sort produk
export const sortProducts = (sortBy: string, order: "asc" | "desc") =>
  fetch(`${BASE_URL}?sortBy=${sortBy}&order=${order}`).then(handleResponse);

/* ✅ ADD PRODUCT */
export const addProduct = (data: {
  title: string;
  price?: number;
  category: string;
  thumbnail?: string;
}) =>
  fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

/* ✅ UPDATE PRODUCT */
export const updateProduct = (
  id: number,
  data: { title: string; price: number; thumbnail?: string }
) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

/* ✅ DELETE PRODUCT */
export const deleteProduct = (id: number) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  }).then(handleResponse);

/* ✅ PAGINATION (API SIDE) */
export const getProductsPaginated = (options?: {
  limit?: number;
  skip?: number;
  select?: string[];
}) => {
  const params = new URLSearchParams();

  if (options?.limit !== undefined)
    params.append("limit", String(options.limit));
  if (options?.skip !== undefined)
    params.append("skip", String(options.skip));
  if (options?.select?.length)
    params.append("select", options.select.join(","));

  return fetch(`${BASE_URL}?${params.toString()}`).then(handleResponse);
};
