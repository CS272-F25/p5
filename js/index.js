
import { fetchProducts } from "./data.js";
import { formatPrice, addToCart } from "./global.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const products = await fetchProducts();
    const featured = products.slice(0, 3);
    const container = document.getElementById("featured-products");
    if (!container) return;

    if (featured.length === 0) {
      container.innerHTML = `<p class="text-muted">No featured products available.</p>`;
      return;
    }

    featured.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <article class="product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" width="300" height="200" style="object-fit: cover;">
          <div class="product-card-body">
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-meta">${product.petTypeLabel} • ${product.categoryLabel}</p>
            <p class="product-card-price">${formatPrice(product.price)}</p>
            <div class="product-card-actions">
              <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-outline-secondary btn-sm">View details</a>
              <button type="button" class="btn btn-primary btn-sm" data-product-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
      container.appendChild(col);
    });

    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-product-id]");
      if (!button) return;
      const productId = button.getAttribute("data-product-id");
      addToCart(productId, 1);
    });
  } catch (error) {
    console.error("Failed to fetch products for index page:", error);
    const container = document.getElementById("featured-products");
    if (container) {
      container.innerHTML = `<p class="text-danger">Error loading featured products. Please try again later.</p>`;
    }
  }
});
