// js/auth.js

const USERS_KEY = "petpantry-users";
const CURRENT_USER_KEY = "petpantry-current-user";

/**
 * Gets all "registered" users from localStorage.
 * In a real app, this would be a database call.
 * @returns {Array} An array of user objects.
 */
function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    console.error("Error reading users from localStorage", e);
    return [];
  }
}

/**
 * Saves the users array to localStorage.
 * @param {Array<Object>} users The array of user objects, each with a `username` and `password`.
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * "Logs in" a user by setting their username in localStorage.
 * This acts as a session for the front-end only account system.
 * @param {string} username The username of the user to log in.
 */
function loginUser(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

/**
 * "Logs out" the current user by removing their username from localStorage.
 * Redirects to the login page after logout.
 */
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "login.html"; // Redirect to login page
}

/**
 * Gets the currently logged-in user's username from localStorage.
 * @returns {string|null} The username if a user is logged in, otherwise null.
 */
export function getLoggedInUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

/**
 * Checks if a user is currently logged in based on the presence of a username in localStorage.
 * @returns {boolean} True if a user is logged in, false otherwise.
 */
export function isLoggedIn() {
  return getLoggedInUser() !== null;
}


// --- DOMContentLoaded Event Listener for Page-Specific Logic ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Registration Page Logic ---
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      registerForm.classList.add("was-validated");

      const username = document.getElementById("register-username").value;
      const pass = document.getElementById("register-password").value;
      const confirmPass = document.getElementById("register-confirm-password").value;
      const errorDiv = document.getElementById("register-error");
      const mismatchError = document.getElementById("password-mismatch-error");

      mismatchError.classList.add("d-none");
      errorDiv.classList.add("d-none");

      if (!registerForm.checkValidity()) return;

      if (pass !== confirmPass) {
        mismatchError.classList.remove("d-none");
        return;
      }

      const users = getUsers();
      if (users.find(u => u.username === username)) {
        errorDiv.textContent = "Username already exists. Please choose another.";
        errorDiv.classList.remove("d-none");
        return;
      }

      // WARNING: Storing plain text passwords is not secure.
      // This is for demonstration purposes only in a front-end only project.
      users.push({ username, password: pass });
      saveUsers(users);

      loginUser(username);
      window.location.href = "account.html";
    });
  }

  // --- Login Page Logic ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      loginForm.classList.add("was-validated");

      const username = document.getElementById("login-username").value;
      const pass = document.getElementById("login-password").value;
      const errorDiv = document.getElementById("login-error");
      errorDiv.classList.add("d-none");

      if (!loginForm.checkValidity()) return;

      const users = getUsers();
      const user = users.find(u => u.username === username);

      if (user && user.password === pass) {
        loginUser(username);
        window.location.href = "account.html";
      } else {
        errorDiv.textContent = "Invalid username or password.";
        errorDiv.classList.remove("d-none");
      }
    });
  }

  // --- Account Page Logic ---
  const accountUsername = document.getElementById("account-username");
  if (accountUsername) {
    const user = getLoggedInUser();
    if (user) {
      accountUsername.textContent = user;
    } else {
      // If not logged in, redirect to login page
      window.location.href = "login.html";
    }
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});
