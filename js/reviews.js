
import { REVIEW_KEY } from "./global.js";

/**
 * Calculates and renders the visual summary of all reviews.
 * @param {Array<Object>} reviews - An array of all review objects.
 */
function renderSummary(reviews) {
  const container = document.getElementById("reviews-summary");
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `<div class="text-center p-3 border rounded"><p class="mb-0 text-muted">No reviews yet.</p></div>`;
    return;
  }

  const totalReviews = reviews.length;
  const sumOfRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (sumOfRatings / totalReviews).toFixed(1);

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (counts[r.rating] !== undefined) {
      counts[r.rating]++;
    }
  });

  let breakdownHtml = '';
  for (let i = 5; i >= 1; i--) {
    const count = counts[i];
    const percent = totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(0) : 0;
    breakdownHtml += `
      <div class="d-flex align-items-center mb-1">
        <div class="text-nowrap me-2 small">${i} star</div>
        <div class="progress flex-grow-1" style="height: 1rem;">
          <div class="progress-bar bg-warning" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="text-nowrap ms-2 small text-muted" style="width: 35px;">${percent}%</div>
      </div>
    `;
  }
  
  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starsHtml = `${'★'.repeat(fullStars)}${'½'.repeat(halfStar)}${'☆'.repeat(emptyStars)}`;


  container.innerHTML = `
    <div class="p-3 border rounded">
      <div class="row">
        <div class="col-md-4 text-center d-flex flex-column justify-content-center">
          <h2 class="display-4 fw-bold">${averageRating}</h2>
          <div class="text-warning h4 mb-2" aria-label="Average rating: ${averageRating} out of 5">
            ${starsHtml}
          </div>
          <p class="text-muted small">based on ${totalReviews} reviews</p>
        </div>
        <div class="col-md-8">
          ${breakdownHtml}
        </div>
      </div>
    </div>
  `;
}

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

    // Render summary first
    renderSummary(reviews);

    if (!reviews.length) {
      list.innerHTML = '<p class="text-muted small">No reviews yet. Be the first to share feedback!</p>';
      return;
    }

    reviews.slice().reverse().forEach((review) => {
      const card = document.createElement("article");
      card.className = "review-card border p-3";
      card.innerHTML = `
        <header class="d-flex justify-content-between align-items-center mb-1">
          <h3 class="h6 mb-0">${review.name}</h3>
          <span class="review-rating" aria-label="${review.rating} out of 5 stars">
            ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
          </span>
        </header>
        <p class="small mb-1 text-muted">${review.petLabel}</p>
        <p class="mb-1">${review.text}</p>
        <footer class="small text-muted mb-0">${new Date(review.createdAt).toLocaleString()}</footer>
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
    renderReviews(); // This will re-render both the summary and the list
  });
});
