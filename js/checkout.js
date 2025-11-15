
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("checkout-form");
  const message = document.getElementById("checkout-message");
  const itemsList = document.getElementById("checkout-summary-items");
  const totalEl = document.getElementById("checkout-summary-total");

  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    console.error(error);
  }

  function renderSummary() {
    const cart = getCart();
    itemsList.innerHTML = "";
    if (!cart.length) {
      itemsList.innerHTML = "<li class='small text-muted'>Your cart is empty.</li>";
      totalEl.textContent = "$0.00";
      return;
    }

    let subtotal = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center small";
      li.innerHTML = `
        <span>${product.name} &times; ${item.quantity}</span>
        <span>${formatPrice(lineTotal)}</span>
      `;
      itemsList.appendChild(li);
    });
    const shipping = subtotal > 0 && subtotal < 49 ? 4.99 : 0;
    const total = subtotal + shipping;
    totalEl.textContent = formatPrice(total);
  }

  renderSummary();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    message.classList.remove("d-none");
    // Clear cart after "placing" order
    saveCart([]);
  });
});
