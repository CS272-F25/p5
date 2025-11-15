
document.addEventListener("DOMContentLoaded", async () => {
  const cartEmpty = document.getElementById("cart-empty");
  const cartContents = document.getElementById("cart-contents");
  const tbody = document.getElementById("cart-items");
  const itemsEl = document.getElementById("summary-items");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");

  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    console.error(error);
  }

  function render() {
    const cart = getCart();
    if (!cart.length) {
      cartEmpty.classList.remove("d-none");
      cartContents.classList.add("d-none");
      return;
    }
    cartEmpty.classList.add("d-none");
    cartContents.classList.remove("d-none");

    tbody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${product.image}" alt="${product.name}">
            <div>
              <a href="product.html?id=${encodeURIComponent(product.id)}" class="link-dark fw-semibold">${product.name}</a>
              <div class="small text-muted">${product.petTypeLabel}</div>
            </div>
          </div>
        </td>
        <td>${formatPrice(product.price)}</td>
        <td>
          <div class="input-group input-group-sm" style="max-width: 120px;">
            <button class="btn btn-outline-secondary btn-sm btn-qty" data-action="decrease" data-product-id="${product.id}" aria-label="Decrease quantity">-</button>
            <input type="number" class="form-control text-center cart-qty-input" min="1" value="${item.quantity}" data-product-id="${product.id}" aria-label="Quantity for ${product.name}">
            <button class="btn btn-outline-secondary btn-sm btn-qty" data-action="increase" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td>${formatPrice(lineTotal)}</td>
        <td>
          <button class="btn btn-link text-danger btn-sm btn-remove" data-product-id="${product.id}">
            Remove
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    const shipping = subtotal > 0 && subtotal < 49 ? 4.99 : 0;
    const total = subtotal + shipping;

    itemsEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = shipping ? formatPrice(shipping) : "Free";
    totalEl.textContent = formatPrice(total);
  }

  tbody.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    const productId = btn.getAttribute("data-product-id");
    const action = btn.classList.contains("btn-remove")
      ? "remove"
      : btn.getAttribute("data-action");

    const cart = getCart();
    const item = cart.find((c) => c.productId === productId);
    if (!item) return;

    if (action === "remove") {
      const updated = cart.filter((c) => c.productId !== productId);
      saveCart(updated);
    } else if (action === "increase") {
      item.quantity += 1;
      saveCart(cart);
    } else if (action === "decrease") {
      item.quantity = Math.max(1, item.quantity - 1);
      saveCart(cart);
    }
    render();
  });

  tbody.addEventListener("change", (event) => {
    const input = event.target.closest(".cart-qty-input");
    if (!input) return;
    const productId = input.getAttribute("data-product-id");
    const value = Number(input.value) || 1;
    const cart = getCart();
    const item = cart.find((c) => c.productId === productId);
    if (!item) return;
    item.quantity = Math.max(1, value);
    saveCart(cart);
    render();
  });

  render();
});
