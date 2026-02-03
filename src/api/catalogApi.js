const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchCategoryTree() {
  const res = await fetch(`${API_URL}/categories/tree`);
  if (!res.ok) throw new Error('Failed to load category tree');
  return res.json();
}

export async function fetchShopCategoryTree(shopId) {
  const res = await fetch(`${API_URL}/categories/tree/by-shop/${shopId}`);
  if (!res.ok) throw new Error('Failed to load shop category tree');
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
