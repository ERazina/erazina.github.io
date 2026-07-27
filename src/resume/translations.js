export const languages = [
  { code: "ru", label: "RU", enabled: true },
  { code: "en", label: "EN", enabled: true },
  // German is prepared for a future translation. Add `de` to translations
  // and switch enabled to true when the copy is ready.
  { code: "de", label: "DE", enabled: false },
];

export const resumeFiles = {
  ru: {
    path: "Elina_Razina_Resume_RU.pdf",
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
    projectsEyebrow: "Enterprise-проекты",
    projectsTitle: "Проекты под NDA",
    projectsText:
      "Большинство моих коммерческих проектов — enterprise-приложения с закрытым доступом, защищённые NDA. Поэтому я не могу публиковать их исходный код или рабочие интерфейсы, но могу показать интерактивные demo-проекты, которые демонстрируют мои навыки в архитектуре, React, TypeScript, управлении состоянием, сложных интерфейсах и производительности.",
    projectsLink: "Открыть интерактивный demo-проект",
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
    projectsEyebrow: "Enterprise work",
    projectsTitle: "NDA-protected projects",
    projectsText:
      "Most of my commercial work consists of enterprise applications with restricted access and is protected by NDAs. I cannot publish their source code or production interfaces, so I provide interactive demo projects that demonstrate my skills in frontend architecture, React, TypeScript, state management, complex UI, and performance optimization.",
    projectsLink: "Explore the interactive demo",
    languageLabel: "Choose language",
    germanSoon: "German version — coming soon",
    settingsLabel: "Display settings",
    enableDarkTheme: "Switch to dark theme",
    enableLightTheme: "Switch to light theme",
  },
};
