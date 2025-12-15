

import { fetchProducts } from "./data.js";
import { formatPrice, addToCart, createFlyToCartAnimation } from "./global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("featured-products");
  if (!container) return;

  const quickViewModalEl = document.getElementById("quick-view-modal");
  const quickViewModal = new bootstrap.Modal(quickViewModalEl);

  try {
    const products = await fetchProducts();
    const featured = products.slice(0, 3);
    
    if (featured.length === 0) {
      container.innerHTML = `<p class="text-muted">No featured products available.</p>`;
      return;
    }

    container.innerHTML = ""; // Clear container before adding new elements
    featured.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image-container">
            <img src="${product.image}" class="card-img-top" alt="${product.name}" width="300" height="200" style="object-fit: cover;">
            <button class="btn btn-light btn-sm quick-view-btn" data-product-id="${product.id}">Quick View</button>
          </div>
          <div class="product-card-body">
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-meta">${product.petTypeLabel} • ${product.categoryLabel}</p>
            <p class="product-card-price">${formatPrice(product.price)}</p>
            <footer class="product-card-actions">
              <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-outline-secondary btn-sm">View details</a>
              <button type="button" class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
      container.appendChild(col);
    });

    container.addEventListener("click", async (event) => {
      const addToCartBtn = event.target.closest(".add-to-cart-btn");
      const quickViewBtn = event.target.closest(".quick-view-btn");

      if (addToCartBtn) {
        const productId = addToCartBtn.getAttribute("data-product-id");
        addToCart(productId, 1);
        createFlyToCartAnimation(addToCartBtn);
      }

      if (quickViewBtn) {
        const productId = quickViewBtn.getAttribute("data-product-id");
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const modalBody = quickViewModalEl.querySelector(".modal-body");
        modalBody.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-6">
              <h3>${product.name}</h3>
              <p class="text-muted">${product.shortDescription}</p>
              <h4 class="fw-bold">${formatPrice(product.price)}</h4>
              <p class="small"><strong>Size:</strong> ${product.size}</p>
              <div class="d-grid gap-2">
                <button type="button" class="btn btn-primary add-to-cart-modal-btn" data-product-id="${product.id}">Add to Cart</button>
                <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-outline-secondary btn-sm">View Full Details</a>
              </div>
            </div>
          </div>
        `;
        quickViewModal.show();
      }
    });

    quickViewModalEl.addEventListener('click', (event) => {
        const addToCartModalBtn = event.target.closest('.add-to-cart-modal-btn');
        if (addToCartModalBtn) {
            const productId = addToCartModalBtn.getAttribute('data-product-id');
            addToCart(productId, 1);
            // Fly animation from modal is complex, so we'll just close it as a confirmation
            quickViewModal.hide();
        }
    });

  } catch (error) {
    console.error("Failed to fetch products for index page:", error);
    if (container) {
      container.innerHTML = `<p class="text-danger">Error loading featured products. Please try again later.</p>`;
    }
  }
});
