
/**
 * @file Provides global utility functions and configurations for the Pet Pantry Online application.
 * This includes managing the shopping cart, updating UI elements, and handling authentication link display.
 */

import { isLoggedIn, logoutUser } from "./auth.js";

/**
 * Key for storing cart data in localStorage.
 * @type {string}
 */
export const CART_KEY = "petpantry-cart";
/**
 * Key for storing review data in localStorage.
 * @type {string}
 */
export const REVIEW_KEY = "petpantry-reviews";
/**
 * Key for storing contact messages in localStorage.
 * @type {string}
 */
export const CONTACT_KEY = "petpantry-contact-messages";

/**
 * Global configuration object for site-wide settings.
 * @type {object}
 * @property {number} SHIPPING_THRESHOLD - The minimum order total for free shipping.
 * @property {number} SHIPPING_COST - The cost of shipping if below the threshold.
 */
export const CONFIG = {
  SHIPPING_THRESHOLD: 49,
  SHIPPING_COST: 4.99,
};

/**
 * Retrieves the current shopping cart from localStorage.
 * @returns {Array<Object>} An array of cart items, or an empty array if no cart data is found or an error occurs.
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

/**
 * Saves the provided cart array to localStorage and updates the cart badge.
 * @param {Array<Object>} cart The array of cart items to save.
 */
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(cart);
}

/**
 * Updates the shopping cart badge in the navigation bar with the total number of items.
 * @param {Array<Object>|null} cart - The current cart array. If null, the cart is retrieved from localStorage.
 */
export function updateCartBadge(cart = null) {
  if (!cart) cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    badge.textContent = count;
  }
}

/**
 * Adds a product to the cart or updates its quantity if already present.
 * @param {string} productId - The ID of the product to add.
 * @param {number} [quantity=1] - The quantity to add. Defaults to 1.
 */
export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

/**
 * Formats a numeric amount into a currency string (e.g., "$12.34").
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Dynamically updates the authentication links in the navigation bar based on the user's login status.
 * Shows "My Account / Log Out" if logged in, otherwise "Log In / Register".
 */
function updateAuthLinks() {
  const authLinksContainer = document.getElementById("auth-links");
  if (!authLinksContainer) return;

  if (isLoggedIn()) {
    authLinksContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="account.html">My Account</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="logout-link">Log Out</a>
      </li>
    `;
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
      });
    }
  } else {
    authLinksContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="login.html">Log In</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="register.html">Register</a>
      </li>
    `;
  }
}

// --- Initial setup when the DOM is ready ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  updateAuthLinks();
});
