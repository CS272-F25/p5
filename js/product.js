
import { fetchProducts } from "./data.js";
import { formatPrice, addToCart } from "./global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p class='text-danger'>No product selected.</p>";
    return;
  }

  try {
    const products = await fetchProducts();
    const product = products.find((p) => String(p.id) === String(id));

    if (!product) {
      container.innerHTML = "<p class='text-danger'>Product not found.</p>";
      return;
    }

    container.innerHTML = `
      <div class="col-md-6">
        <figure>
          <img src="${product.image}" class="img-fluid rounded-4 product-image" alt="${product.name}" width="500" height="500" style="object-fit: cover;">
          <figcaption class="mt-2 small text-muted">${product.petTypeLabel} • ${product.categoryLabel}</figcaption>
        </figure>
      </div>
      <div class="col-md-6">
        <h1 class="h3">${product.name}</h1>
        <p class="text-muted">${product.longDescription}</p>
        <p class="h4 fw-bold mb-3">${formatPrice(product.price)}</p>
        <p class="small mb-2"><strong>Size:</strong> ${product.size}</p>
        <p class="small mb-2"><strong>Flavor:</strong> ${product.flavor}</p>
        <p class="small mb-2"><strong>Best for:</strong> ${product.bestFor}</p>
        <button type="button" class="btn btn-primary mb-3" id="add-to-cart-detail" data-product-id="${product.id}">
          Add to cart
        </button>
        <div class="alert alert-info small mb-0">
          <strong>Note:</strong> This is a demo store. Items are not actually shipped.
        </div>
      </div>
    `;

    const addButton = document.getElementById("add-to-cart-detail");
    addButton.addEventListener("click", () => {
      const productId = addButton.getAttribute("data-product-id");
      addToCart(productId, 1);
    });
  } catch (error) {
    console.error("Failed to load product details:", error);
    container.innerHTML = "<p class='text-danger'>Failed to load product details. Please try again later.</p>";
  }
});
