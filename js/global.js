
/**
 * @file Provides global utility functions and configurations for the Pet Pantry Online application.
 * This includes managing the shopping cart, updating UI elements, and handling authentication link display.
 */

import { isLoggedIn, logoutUser } from "./auth.js";
import { fetchProducts } from "./data.js";

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
 * Saves the provided cart array to localStorage and updates the cart badge and mini cart.
 * @param {Array<Object>} cart The array of cart items to save.
 */
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(cart);
  renderMiniCart(); // Update dropdown on every change
}

/**
 * Renders the items in the mini-cart dropdown.
 */
export async function renderMiniCart() {
  const itemsContainer = document.getElementById("mini-cart-items");
  const subtotalEl = document.getElementById("mini-cart-subtotal");
  if (!itemsContainer || !subtotalEl) return;

  const cart = getCart();

  const summaryContainer = document.querySelector('.cart-dropdown-menu .p-2.border-top');
  const oldProgress = summaryContainer?.querySelector('.shipping-progress-container');
  if (oldProgress) {
    oldProgress.remove();
  }

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-center text-muted small p-2">Your cart is empty.</p>`;
    subtotalEl.textContent = formatPrice(0);
    return;
  }

  try {
    const products = await fetchProducts();
    itemsContainer.innerHTML = ""; // Clear existing items
    let subtotal = 0;

    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;

      subtotal += product.price * item.quantity;

      const itemEl = document.createElement("div");
      itemEl.className = "mini-cart-item";
      itemEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="mini-cart-item-details">
          <span class="mini-cart-item-title">${product.name}</span>
          <span class="text-muted">${item.quantity} x ${formatPrice(product.price)}</span>
        </div>
        <button type="button" class="btn-close btn-sm ms-auto mini-cart-remove-btn" data-product-id="${product.id}" aria-label="Remove item"></button>
      `;
      itemsContainer.appendChild(itemEl);
    });

    subtotalEl.textContent = formatPrice(subtotal);

    // --- Free Shipping Progress Bar ---
    if (!summaryContainer) return;

    const freeShippingThreshold = CONFIG.SHIPPING_THRESHOLD;
    let shippingProgressHtml = '';

    if (subtotal > 0 && subtotal < freeShippingThreshold) {
      const remainingToFreeShipping = freeShippingThreshold - subtotal;
      const progressPercentage = (subtotal / freeShippingThreshold) * 100;
      shippingProgressHtml = `
        <p class="small text-center mb-1">
          You're only <strong>${formatPrice(remainingToFreeShipping)}</strong> away from FREE shipping!
        </p>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar bg-success" role="progressbar" style="width: ${progressPercentage}%;" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      `;
    } else if (subtotal >= freeShippingThreshold) {
      shippingProgressHtml = `
        <div class="text-center text-success small">
          <strong class="text-success">🥳 You've earned FREE shipping!</strong>
        </div>
      `;
    }

    if(shippingProgressHtml) {
      const progressWrapper = document.createElement('div');
      progressWrapper.className = 'shipping-progress-container mb-2';
      progressWrapper.innerHTML = shippingProgressHtml;
      summaryContainer.prepend(progressWrapper);
    }
  } catch (error) {
    console.error("Failed to render mini cart:", error);
    itemsContainer.innerHTML = `<p class="text-center text-danger small p-2">Could not load cart.</p>`;
  }
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
 * Removes an item completely from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);
}

/**
 * Creates and manages a "fly-to-cart" animation.
 * This function is designed to work from both product cards and the product detail page.
 * @param {HTMLElement} startElement - The element that triggered the animation (e.g., the 'Add to cart' button).
 */
export function createFlyToCartAnimation(startElement) {
  let productImg;
  const productCard = startElement.closest(".product-card");
  const detailContainer = startElement.closest("#product-detail");

  if (productCard) {
    // Strategy 1: We are on a card
    productImg = productCard.querySelector("img");
  } else if (detailContainer) {
    // Strategy 2: We are on the product detail page
    productImg = detailContainer.querySelector(".product-image");
  }

  if (!productImg) return; // Could not find an image to animate

  const cartIcon = document.querySelector('a[href="cart.html"]');
  if (!cartIcon) return; // Could not find the cart icon

  const startRect = productImg.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const clone = productImg.cloneNode(true);
  clone.classList.add("flying-product-clone");

  // Set initial position
  clone.style.top = `${startRect.top}px`;
  clone.style.left = `${startRect.left}px`;
  clone.style.width = `${startRect.width}px`;
  clone.style.height = `${startRect.height}px`;

  document.body.appendChild(clone);

  // Use a short timeout to allow the browser to paint the initial state before transitioning
  setTimeout(() => {
    clone.style.top = `${endRect.top + endRect.height / 2}px`;
    clone.style.left = `${endRect.left + endRect.width / 2}px`;
    clone.style.transform = "scale(0)"; // Shrink the image as it flies
    clone.style.opacity = "0.5";
  }, 10);

  // Remove the clone after the animation is complete
  setTimeout(() => {
    clone.remove();
  }, 510); // Matches the transition duration
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
  renderMiniCart();

  // Add hover listeners for the cart dropdown
  const cartDropdownContainer = document.getElementById("cart-dropdown-container");
  if (cartDropdownContainer) {
    const dropdownMenu = cartDropdownContainer.querySelector(".dropdown-menu");
    const dropdown = new bootstrap.Dropdown(cartDropdownContainer.querySelector(".dropdown-toggle"));
    
    cartDropdownContainer.addEventListener("mouseenter", () => {
      // Small delay to prevent accidental opening
      setTimeout(() => {
        if (cartDropdownContainer.matches(":hover")) {
          dropdown.show();
        }
      }, 100);
    });

    cartDropdownContainer.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!dropdownMenu.matches(":hover")) {
          dropdown.hide();
        }
      }, 100);
    });
    
    dropdownMenu.addEventListener("mouseleave", () => {
        dropdown.hide();
    });
  }

  // Add click listener for removing items from mini cart
  const miniCartItemsContainer = document.getElementById("mini-cart-items");
  if (miniCartItemsContainer) {
    miniCartItemsContainer.addEventListener("click", (event) => {
      const removeButton = event.target.closest(".mini-cart-remove-btn");
      if (removeButton) {
        const productId = removeButton.getAttribute("data-product-id");
        removeFromCart(productId);
      }
    });
  }
});
