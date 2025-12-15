
import { fetchProducts } from "./data.js";
import { formatPrice, addToCart } from "./global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("product-list");
  const countEl = document.getElementById("product-count");
  const petEl = document.getElementById("filter-pet");
  const categoryEl = document.getElementById("filter-category");
  const priceEl = document.getElementById("filter-price");
  const priceValueEl = document.getElementById("filter-price-value");
  const searchEl = document.getElementById("filter-search");

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
        <article class="product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" width="300" height="200" style="object-fit: cover;">
          <div class="product-card-body">
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-meta">${product.petTypeLabel} • ${product.categoryLabel}</p>
            <p class="product-card-text">${product.shortDescription}</p>
            <p class="product-card-price">${formatPrice(product.price)}</p>
            <footer class="product-card-actions">
              <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-outline-secondary btn-sm">View details</a>
              <button type="button" class="btn btn-primary btn-sm" data-product-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
      listEl.appendChild(col);
    });

    countEl.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found.`;
  }

  try {
    products = await fetchProducts();

    // Pre-filter from query string (e.g. ?category=dog)
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
      const button = event.target.closest("[data-product-id]");
      if (!button) return;
      const productId = button.getAttribute("data-product-id");
      addToCart(productId, 1);
    });
  } catch (error) {
    console.error("Failed to load products for product list page:", error);
    listEl.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
    countEl.textContent = "0 products found.";
  }
});
