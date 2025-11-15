// 全站共用：購物車 localStorage key
const CART_KEY = "petpantry-cart";

/**
 * 讀取購物車
 * 結構預計是 [{ productId: "xxx", quantity: 1 }, ...]
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

/**
 * 儲存購物車
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(cart);
}

/**
 * 更新右上角 Cart badge
 */
function updateCartBadge(cart = null) {
  if (!cart) {
    cart = getCart();
  }
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    badge.textContent = count;
  }
}

/**
 * 新增商品到購物車
 */
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

// 頁面載入時先更新一次 badge
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
