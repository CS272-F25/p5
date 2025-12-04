
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
        <article class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" width="300" height="200" style="object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title h5">${product.name}</h3>
            <p class="card-text small text-muted mb-1">${product.petTypeLabel} • ${product.categoryLabel}</p>
            <p class="fw-bold mb-3">${formatPrice(product.price)}</p>
            <div class="mt-auto d-flex gap-2">
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
