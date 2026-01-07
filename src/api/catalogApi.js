const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchProducts(categoryId = null) {
  const url = categoryId
    ? `${API_URL}/products?category_id=${categoryId}`
    : `${API_URL}/products`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}
