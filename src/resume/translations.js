export const languages = [
  { code: "ru", label: "RU", enabled: true },
  { code: "en", label: "EN", enabled: true },
  // German is prepared for a future translation. Add `de` to translations
  // and switch enabled to true when the copy is ready.
  { code: "de", label: "DE", enabled: false },
];

export const resumeFiles = {
  ru: {
    path: "Elina_Razina_Resume.pdf",
    downloadName: "Elina_Razina_Resume_RU.pdf",
  },
  en: {
    path: "Elina_Razina_Resume_EN.pdf",
    downloadName: "Elina_Razina_Resume_EN.pdf",
  },
  // Add the German PDF to `public/` before enabling the German language.
  de: {
    path: "Elina_Razina_Resume_DE.pdf",
    downloadName: "Elina_Razina_Resume_DE.pdf",
  },
};

export const translations = {
  ru: {
    pageTitle: "Элина Разина — Lead Frontend Engineer",
    description:
      "Элина Разина — Lead Frontend Engineer. React, TypeScript, Next.js.",
    name: "Элина Разина",
    status: "Open to work",
    statusLabel: "Открыта к новым предложениям",
    role: "Lead Frontend Engineer",
    stackLabel: "Основной стек",
    experienceLabel: "Опыт работы",
    experience: "9 лет во frontend",
    companies: ["ex-DataArt", "МТС", "Самолёт"],
    linksLabel: "Ссылки",
    download: "Скачать PDF",
    scrollLabel: "Перейти ниже",
    aboutTitle: "Коротко обо мне",
    about:
      "Разрабатываю интерфейсы на React и TypeScript, проектирую frontend-архитектуру, провожу code review и помогаю командам выпускать стабильные продукты.",
    languageLabel: "Выбор языка",
    germanSoon: "Немецкая версия — скоро",
    settingsLabel: "Настройки отображения",
    enableDarkTheme: "Включить тёмную тему",
    enableLightTheme: "Включить светлую тему",
  },
  en: {
    pageTitle: "Elina Razina — Lead Frontend Engineer",
    description:
      "Elina Razina — Lead Frontend Engineer. React, TypeScript, Next.js.",
    name: "Elina Razina",
    status: "Open to work",
    statusLabel: "Open to new opportunities",
    role: "Lead Frontend Engineer",
    stackLabel: "Main stack",
    experienceLabel: "Work experience",
    experience: "9 years in frontend",
    companies: [
      "ex-DataArt (Global IT)",
      "ex-MTS (Top-3 telecommunications)",
      "ex-Samolet (Top-3 developer)",
    ],
    linksLabel: "Links",
    download: "Download PDF",
    scrollLabel: "Read more",
    aboutTitle: "About me",
    about:
      "I build interfaces with React and TypeScript, design frontend architecture, conduct code reviews, and help teams ship stable products.",
    languageLabel: "Choose language",
    germanSoon: "German version — coming soon",
    settingsLabel: "Display settings",
    enableDarkTheme: "Switch to dark theme",
    enableLightTheme: "Switch to light theme",
  },
};
