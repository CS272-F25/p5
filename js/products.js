
import { fetchProducts } from "./data.js";
import { formatPrice, addToCart, createFlyToCartAnimation } from "./global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("product-list");
  const countEl = document.getElementById("product-count");
  const petEl = document.getElementById("filter-pet");
  const categoryEl = document.getElementById("filter-category");
  const priceEl = document.getElementById("filter-price");
  const priceValueEl = document.getElementById("filter-price-value");
  const searchEl = document.getElementById("filter-search");
  
  const quickViewModalEl = document.getElementById("quick-view-modal");
  const quickViewModal = new bootstrap.Modal(quickViewModalEl);

  let products = [];
  let filtered = [];

  function applyFilters() {
    const pet = petEl.value;
    const category = categoryEl.value;
    const maxPrice = Number(priceEl.value);
    const searchTerm = searchEl.value.toLowerCase();

    filtered = products.filter((p) => {
      const matchesPet = pet === "all" || p.petType === pet;
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm));
      return matchesPet && matchesCategory && matchesPrice && matchesSearch;
    });

    renderProducts();
  }

  function renderProducts() {
    listEl.innerHTML = "";
    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="text-muted">No products match your filters.</p>';
      countEl.textContent = "0 products found.";
      return;
    }

    filtered.forEach((product) => {
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
            <p class="product-card-text">${product.shortDescription}</p>
            <p class="product-card-price">${formatPrice(product.price)}</p>
            <footer class="product-card-actions">
              <a href="product.html?id=${encodeURIComponent(
                product.id
              )}" class="btn btn-outline-secondary btn-sm">View details</a>
              <button type="button" class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${
                product.id
              }">Add to cart</button>
            </div>
          </div>
        </article>
      `;
      listEl.appendChild(col);
    });

    countEl.textContent = `${filtered.length} product${
      filtered.length === 1 ? "" : "s"
    } found.`;
  }

  try {
    products = await fetchProducts();

    // Pre-filter from query string
    const params = new URLSearchParams(window.location.search);
    const petParam = params.get("category");
    if (petParam && ["dog", "cat", "small-pet"].includes(petParam)) {
      petEl.value = petParam;
    }

    applyFilters();

    [petEl, categoryEl, priceEl, searchEl].forEach((el) => {
      el.addEventListener("input", () => {
        if (el === priceEl && priceValueEl) {
          priceValueEl.textContent = `$${priceEl.value}`;
        }
        applyFilters();
      });
    });

    listEl.addEventListener("click", (event) => {
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
            quickViewModal.hide();
        }
    });

  } catch (error) {
    console.error("Failed to load products for product list page:", error);
    listEl.innerHTML =
      '<p class="text-danger">Failed to load products. Please try again later.</p>';
    countEl.textContent = "0 products found.";
  }
});
