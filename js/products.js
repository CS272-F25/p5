
import { fetchProducts } from "./data.js";
import { formatPrice, addToCart, createFlyToCartAnimation } from "./global.js";

/**
 * Wraps all instances of a search term in a string with <mark> tags.
 * @param {string} text - The text to highlight.
 * @param {string} searchTerm - The term to search for.
 * @returns {string} The text with the search term highlighted.
 */
function highlightText(text, searchTerm) {
  if (!searchTerm) {
    return text;
  }
  const regex = new RegExp(searchTerm, "gi"); // g for global, i for case-insensitive
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}


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

  const productTemplate = document.getElementById("product-card-template");

  let products = [];
  let filtered = [];

  function applyFilters() {
    const pet = petEl.value;
    const category = categoryEl.value;
    const maxPrice = Number(priceEl.value);
    const searchTerm = searchEl.value.trim();

    filtered = products.filter((p) => {
      const matchesPet = pet === "all" || p.petType === pet;
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
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
    const searchTerm = searchEl.value.trim();

    filtered.forEach((product) => {
      const cardClone = productTemplate.content.cloneNode(true);
      
      const cardRoot = cardClone.querySelector(".product-card");
      cardRoot.dataset.productId = product.id;

      cardClone.querySelector(".product-image-container img").src = product.image;
      cardClone.querySelector(".product-image-container img").alt = product.name;
      cardClone.querySelector(".quick-view-btn").dataset.productId = product.id;
      
      cardClone.querySelector(".product-card-title").innerHTML = highlightText(product.name, searchTerm);
      cardClone.querySelector(".product-card-meta").textContent = `${product.petTypeLabel} • ${product.categoryLabel}`;
      cardClone.querySelector(".product-card-text").innerHTML = highlightText(product.shortDescription, searchTerm);
      cardClone.querySelector(".product-card-price").textContent = formatPrice(product.price);
      
      cardClone.querySelector(".product-details-link").href = `product.html?id=${encodeURIComponent(product.id)}`;
      cardClone.querySelector(".add-to-cart-btn").dataset.productId = product.id;
      
      listEl.appendChild(cardClone);
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
          priceValueEl.value = `$${priceEl.value}`; // For output tag, use .value
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
