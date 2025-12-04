
import { REVIEW_KEY } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("review-form");
  const list = document.getElementById("review-list");

  function getReviews() {
    try {
      const raw = localStorage.getItem(REVIEW_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading reviews:", e);
      return [];
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
  }

  function renderReviews() {
    const reviews = getReviews();
    list.innerHTML = "";

    if (!reviews.length) {
      list.innerHTML = '<p class="text-muted small">No reviews yet. Be the first to share feedback!</p>';
      return;
    }

    reviews.slice(-5).reverse().forEach((review) => {
      const card = document.createElement("article");
      card.className = "review-card border p-3";
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
          <h2 class="h6 mb-0">${review.name}</h2>
          <span class="review-rating" aria-label="${review.rating} out of 5 stars">
            ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
          </span>
        </div>
        <p class="small mb-1 text-muted">${review.petLabel}</p>
        <p class="mb-1">${review.text}</p>
        <p class="small text-muted mb-0">${new Date(review.createdAt).toLocaleString()}</p>
      `;
      list.appendChild(card);
    });
  }

  renderReviews();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    const name = document.getElementById("review-name").value.trim();
    const pet = document.getElementById("review-pet").value;
    const rating = Number(document.getElementById("review-rating").value);
    const text = document.getElementById("review-text").value.trim();

    const petLabelMap = {
      "dog": "Dog parent",
      "cat": "Cat parent",
      "small-pet": "Small pet parent"
    };

    const newReview = {
      name,
      pet,
      petLabel: petLabelMap[pet] || "Pet parent",
      rating,
      text,
      createdAt: new Date().toISOString()
    };

    const reviews = getReviews();
    reviews.push(newReview);
    saveReviews(reviews);

    form.reset();
    form.classList.remove("was-validated");
    renderReviews();
  });
});
