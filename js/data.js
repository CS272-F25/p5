// js/data.js

let productsCache = null;

/**
 * Fetches product data from products.json.
 * Caches the result to avoid multiple fetches.
 * @returns {Promise<Array>} A promise that resolves with an array of product objects.
 */
export async function fetchProducts() {
  if (productsCache) {
    return productsCache;
  }

  try {
    const response = await fetch("data/products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    productsCache = data; // Cache the fetched data
    return productsCache;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Depending on the desired behavior, you might want to rethrow the error
    // or return an empty array/null to indicate failure.
    throw error;
  }
}
