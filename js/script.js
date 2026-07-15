// Nova — interacciones del sitio

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavToggle();
  initHeaderShadowOnScroll();
  initContactForm();
});

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeaderShadowOnScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(22,22,31,0.06)" : "none";
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const validators = {
    name: (value) => value.trim().length >= 2 || "Ingresá tu nombre completo.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Ingresá un email válido.",
    message: (value) => value.trim().length >= 10 || "Contanos un poco más sobre tu proyecto.",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    let isValid = true;

    Object.entries(validators).forEach(([field, validate]) => {
      const input = form.elements.namedItem(field);
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      const row = input?.closest(".form-row");
      if (!input || !errorEl || !row) return;

      const result = validate(input.value);
      if (result === true) {
        row.classList.remove("has-error");
        errorEl.textContent = "";
      } else {
        row.classList.add("has-error");
        errorEl.textContent = result;
        isValid = false;
      }
    });

    if (!isValid) {
      status.textContent = "Revisá los campos marcados antes de enviar.";
      status.classList.add("error");
      return;
    }

    // No hay backend conectado todavía: se simula el envío en el cliente.
    status.textContent = "¡Gracias! Recibimos tu mensaje y te contactaremos a la brevedad.";
    status.classList.add("success");
    form.reset();
  });
}
