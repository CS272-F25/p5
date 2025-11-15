
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-message-status");

  function getMessages() {
    try {
      const raw = localStorage.getItem(CONTACT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function saveMessages(msgs) {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(msgs));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const msgs = getMessages();
    msgs.push({
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    });
    saveMessages(msgs);

    status.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
  });
});
