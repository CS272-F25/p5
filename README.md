# Pet Pantry Online (Demo E-commerce Site)

## Project Overview

Pet Pantry Online is a fictional, front-end only e-commerce website created as a demonstration project for a university web development course. It showcases modern web development practices using HTML, CSS, and JavaScript, focusing on responsive design, accessibility, dynamic content loading, and client-side data persistence. The site simulates a pet supply store where users can browse products, add items to a shopping cart, submit reviews, contact the store, and even create a *mock* user account.

## Features

*   **Product Catalog:** Browse a variety of pet products (dogs, cats, small pets) with detailed product pages.
*   **Dynamic Filtering & Search:** Filter products by pet type, category, price, and search keywords.
*   **Shopping Cart:** Add, update, and remove items from a persistent shopping cart (using `localStorage`).
*   **Checkout Process:** Simulate a checkout flow with form validation.
*   **Customer Reviews:** Submit and view product reviews (using `localStorage`).
*   **Contact Form:** Send feedback or inquiries (using `localStorage`).
*   **Mock User Account System (Front-end Only):**
    *   **Registration:** Create a user account (username/password stored locally in `localStorage`).
    *   **Login/Logout:** "Log in" and "log out" of the mock account.
    *   **Personalized Experience:** Displays the logged-in username.
    *   ***Disclaimer: This is a front-end only simulation and is NOT secure or suitable for any real-world application. All data is stored in your browser's `localStorage` and will be lost if browser data is cleared.***
*   **Responsive Design:** Adapts to various screen sizes (phone, tablet, desktop) using Bootstrap.
*   **Accessibility (WCAG AA-level considerations):**
    *   Semantic HTML5 structure.
    *   Appropriate `alt` text for images.
    *   Labeled form inputs.
    *   Consistent heading hierarchy.
    *   Skip-to-main-content link.
*   **Consistent UI/UX:** A custom color palette, typography, and component styling (cards, buttons, badges) for a cohesive and engaging user experience.

## Technologies Used

*   **HTML5:** Semantic structure for web content.
*   **CSS3:** Styling and layout, including custom properties (CSS Variables).
*   **JavaScript (ES Modules):** Dynamic content, user interaction, data handling.
*   **Bootstrap 5.3.3:** CSS framework for responsive design and UI components.
*   **Google Fonts ('Inter'):** Custom typography.
*   **`localStorage`:** Client-side data persistence for cart, reviews, contact messages, and mock user accounts.
*   **`fetch` API:** Asynchronous data loading (e.g., `products.json`).

## Project Structure

```
.
├───about.html
├───account.html
├───cart.html
├───checkout.html
├───index.html
├───login.html
├───product.html
├───products.html
├───register.html
├───reviews.html
├───README.md
├───css/
│   ├───about.css
│   ├───cart.css
│   ├───checkout.css
│   ├───global.css
│   ├───index.css
│   ├───product.css
│   ├───products.css
│   └───reviews.css
├───data/
│   └───products.json
└───js/
    ├───about.js
    ├───auth.js
    ├───cart.js
    ├───checkout.js
    ├───data.js
    ├───global.js
    ├───index.js
    ├───product.js
    ├───products.js
    └───reviews.js
```

## Setup and Local Development

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd p5
    ```
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser. No local server is required as all data is fetched from static JSON files or managed via `localStorage`.

## Usage

*   **Browse Products:** Navigate to the "Shop" page to view all products. Use the filters and search bar to narrow down selections.
*   **View Details:** Click on any product to see its detailed description.
*   **Shopping:** Add products to your cart. Update quantities or remove items from the "Cart" page.
*   **Checkout:** Proceed to the "Checkout" page to simulate an order.
*   **Reviews:** Share your thoughts on the "Reviews" page.
*   **Contact:** Use the form on the "About & Contact" page for inquiries.
*   **Mock Account:**
    *   **Register:** Create a new account via the "Register" link in the navigation bar.
    *   **Login:** Access your mock account via the "Log In" link.
    *   **Account:** View your logged-in status on the "My Account" page.
    *   **Logout:** End your session from the "My Account" page or the navigation bar.

## Deployment

This project is designed for deployment using **GitHub Pages**. Ensure your `index.html` is at the root of your repository or in a designated `docs/` folder, and configure GitHub Pages accordingly.

## Accessibility Notes

The website strives to meet WCAG AA standards. Key considerations include:
*   Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`).
*   `alt` attributes for all meaningful images.
*   `<label>` elements explicitly associated with form inputs.
*   Logical heading structure (`<h1>` to `<h6>`).
*   Keyboard navigation support (e.g., skip link, tab order).

## Credits

*   Product images sourced from Pexels.com.
*   Icons from Font Awesome (if used, check `global.css` or HTML for Font Awesome CDN).
*   Built with Bootstrap 5.3.3.

---

_This project is for educational purposes. All product and pricing information is fictional._
