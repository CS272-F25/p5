/**
 * @file Manages product data fetching and caching for the Pet Pantry Online application.
 * This module ensures product data is fetched efficiently and made available across the site.
 */

let productsCache = null;

/**
 * Fetches product data from `data/products.json`.
 * Implements a caching mechanism to prevent redundant network requests once data is loaded.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of product objects.
 *   Each product object is expected to have properties like `id`, `name`, `price`, etc.
 * @throws {Error} Throws an error if the network request fails or the response is not OK.
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
    // Re-throw the error to allow calling functions to handle it.
    throw error;
  }
}
