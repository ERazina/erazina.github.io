import "./services.css";

const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycby-REbAkG8c0J642kYIiJbcx3b3zKzd9-Cl1HAevJ3Cn5iHfsmb5KhwAm9zMe3iah0d/exec";

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" },
  );

  elements.forEach((element) => observer.observe(element));
}

function initForm() {
  const form = document.getElementById("diagnostic-form");
  const feedback = document.getElementById("form-feedback");

  if (!form || !feedback) return;

  const submitButton = form.querySelector("button[type='submit']");
  const submitLabel = submitButton?.querySelector("span");
  const requiredFields = form.querySelectorAll("[required]");

  const showFeedback = (message, type) => {
    feedback.textContent = message;
    feedback.className = `form-feedback is-visible is-${type}`;
  };

  const setLoading = (isLoading) => {
    if (!submitButton || !submitLabel) return;
    submitButton.disabled = isLoading;
    submitLabel.textContent = isLoading ? "Отправляю…" : "Отправить заявку";
  };

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      if (feedback.classList.contains("is-error")) {
        feedback.className = "form-feedback";
        feedback.textContent = "";
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.elements.website.value) return;

    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();

    requiredFields.forEach((field) => {
      field.toggleAttribute("aria-invalid", !field.value.trim());
    });

    if (!name || !contact) {
      showFeedback("Заполни имя и контакт для связи.", "error");
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const level = form.elements.level.value;
    const goal = form.elements.goal.value;
    const details = form.elements.message.value.trim();
    const message = [
      "Заявка на диагностику уровня frontend-разработчика",
      `Текущий уровень: ${level}`,
      `Цель: ${goal}`,
      details ? `О себе: ${details}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    feedback.className = "form-feedback";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ name, email: contact, message }),
      });

      if (!response.ok) throw new Error("Request failed");

      showFeedback(
        "Заявка отправлена. Я свяжусь с тобой и предложу ближайшее время.",
        "success",
      );
      form.reset();
    } catch {
      showFeedback(
        "Не получилось отправить заявку. Напиши мне в Telegram: @Elina_Razina",
        "error",
      );
    } finally {
      setLoading(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initForm();

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
});
