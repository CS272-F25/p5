
export const CART_KEY = "petpantry-cart";
export const REVIEW_KEY = "petpantry-reviews";
export const CONTACT_KEY = "petpantry-contact-messages";

export const CONFIG = {
  SHIPPING_THRESHOLD: 49,
  SHIPPING_COST: 4.99,
};

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart", e);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(cart);
}

export function updateCartBadge(cart = null) {
  if (!cart) cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    badge.textContent = count;
  }
}

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

export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

// Initial cart badge update when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
