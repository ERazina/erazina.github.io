import "./style.css";

const quizData = [
  {
    question: "Какая главная цель сайта для вашего бизнеса?",
    options: [
      "Быть источником заявок и лидов",
      "Показать профессионализм и кейсы",
      "Продать услугу или услугу онлайн",
    ],
  },
  {
    question: "Что важно для ваших клиентов?",
    options: [
      "Быстро найти цену и условия",
      "Увидеть доверие и отзывы",
      "Просто связаться и оставить заявку",
    ],
  },
  {
    question: "Какой результат вы хотите получить первым?",
    options: [
      "Больше заявок за неделю",
      "Понятное представление услуг",
      "Рост доверия и заявок от бизнеса",
    ],
  },
];

const quizState = {
  step: 0,
  answers: [],
};

const quizStepEl = document.getElementById("quiz-step");
const quizQuestionEl = document.getElementById("quiz-question");
const quizOptionsEl = document.getElementById("quiz-options");
const quizPrevBtn = document.getElementById("quiz-prev");
const quizResetBtn = document.getElementById("quiz-reset");
const quizResultEl = document.getElementById("quiz-result");
const quizResultTextEl = document.getElementById("quiz-result-text");
const quizEmailEl = document.getElementById("quiz-email");
const quizSubmitBtn = document.getElementById("quiz-submit");
const quizMessageEl = document.getElementById("quiz-message");

const contactFormEl = document.getElementById("contact-form");
const contactNameEl = document.getElementById("contact-name");
const contactEmailInputEl = document.getElementById("contact-email");
const contactMessageInputEl = document.getElementById("contact-message");
const contactSubmitBtn = document.getElementById("contact-submit");
const contactFeedbackEl = document.getElementById("contact-feedback");

function renderQuiz() {
  const step = quizState.step;
  const isComplete = step >= quizData.length;

  if (isComplete) {
    quizResultEl.classList.remove("hidden");
    quizResultTextEl.textContent = getResultText();
    quizOptionsEl.innerHTML = "";
    quizQuestionEl.textContent = "Результат готов";
    quizStepEl.textContent = "Готово";
    quizPrevBtn.classList.add("hidden");
    quizResetBtn.classList.remove("hidden");
    return;
  }

  quizResultEl.classList.add("hidden");
  quizPrevBtn.classList.toggle("hidden", step === 0);
  quizResetBtn.classList.add("hidden");
  quizStepEl.textContent = `Вопрос ${step + 1} из ${quizData.length}`;
  quizQuestionEl.textContent = quizData[step].question;
  quizOptionsEl.innerHTML = quizData[step].options
    .map(
      (option, index) =>
        `<button type="button" class="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white transition hover:bg-white/10" data-index="${index}">${option}</button>`,
    )
    .join("");

  quizOptionsEl.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.index);
      quizState.answers[step] = quizData[step].options[optionIndex];
      quizState.step += 1;
      renderQuiz();
    });
  });
}

function getResultText() {
  const answers = quizState.answers;
  const first = answers[0] || "быстрые заявки";
  const second = answers[1] || "удобный контакт";
  const third = answers[2] || "рост доверия";

  return `Ваш бизнес получит сайт с фокусом на ${first.toLowerCase()}, ${second.toLowerCase()} и ${third.toLowerCase()}. Это отличный инструмент для лидогенерации и коммерческих заявок.`;
}

function resetQuiz() {
  quizState.step = 0;
  quizState.answers = [];
  quizEmailEl.value = "";
  quizMessageEl.classList.add("hidden");
  quizMessageEl.textContent = "";
  renderQuiz();
}

function sendQuizContact() {
  const value = quizEmailEl.value.trim();
  if (!value) {
    quizMessageEl.textContent = "Пожалуйста, введите email или телефон.";
    quizMessageEl.classList.remove("hidden");
    quizMessageEl.classList.remove("text-green-300");
    quizMessageEl.classList.add("text-red-400");
    return;
  }

  quizMessageEl.textContent = "Спасибо! Я свяжусь с вами в ближайшее время.";
  quizMessageEl.classList.remove("hidden");
  quizMessageEl.classList.remove("text-red-400");
  quizMessageEl.classList.add("text-green-300");
}

function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const arrow = item.querySelector(".faq-arrow");

    button?.addEventListener("click", () => {
      const isOpen = !answer.classList.contains("hidden");
      if (isOpen) {
        answer.classList.add("hidden");
        arrow.style.transform = "rotate(0deg)";
      } else {
        answer.classList.remove("hidden");
        arrow.style.transform = "rotate(180deg)";
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (!quizStepEl || !quizQuestionEl || !quizOptionsEl) return;

  renderQuiz();
  initFAQ();

  quizPrevBtn.addEventListener("click", () => {
    if (quizState.step > 0) {
      quizState.step -= 1;
      renderQuiz();
    }
  });

  quizResetBtn.addEventListener("click", resetQuiz);
  quizSubmitBtn.addEventListener("click", sendQuizContact);
});
