import { Fragment, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import avatarUrl from "../assets/me.jpeg";
import "../styles.css";
import {
  languages,
  resumeFiles,
  translations,
} from "./translations.js";

const STORAGE_KEY = "resume-language";
const THEME_STORAGE_KEY = "resume-theme";
const DEFAULT_LANGUAGE = "ru";

function getInitialLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (queryLanguage && translations[queryLanguage]) return queryLanguage;

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (savedLanguage && translations[savedLanguage]) return savedLanguage;

  return navigator.language.toLowerCase().startsWith("en")
    ? "en"
    : DEFAULT_LANGUAGE;
}

function getInitialTheme() {
  const documentTheme = document.documentElement.dataset.theme;
  if (documentTheme === "light" || documentTheme === "dark") {
    return documentTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v11m0 0 4-4m-4 4-4-4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 21v-3.55c.04-.92-.33-1.63-.93-1.96 3.08-.35 6.32-1.52 6.32-6.85 0-1.52-.54-2.76-1.44-3.73.14-.35.62-1.77-.14-3.68 0 0-1.18-.38-3.85 1.42A13.5 13.5 0 0 0 12 2.15c-1.25 0-2.52.17-3.7.5C5.63.85 4.45 1.23 4.45 1.23c-.76 1.91-.28 3.33-.14 3.68a5.36 5.36 0 0 0-1.44 3.73c0 5.32 3.23 6.5 6.31 6.86-.4.34-.75.96-.88 1.86-.8.35-2.8.97-4.04-1.16 0 0-.74-1.33-2.14-1.42 0 0-1.36-.02-.1.85 0 0 .92.43 1.55 2.03 0 0 .82 2.5 4.69 1.65V21"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m21 4-3.2 15.1c-.24 1.07-.88 1.33-1.78.83l-4.88-3.6-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.97 9.05-8.18c.4-.35-.08-.55-.6-.2L5.4 12.78.58 11.27c-1.05-.33-1.07-1.05.22-1.55L19.65 2.46C20.52 2.14 21.29 2.67 21 4Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5c-5 0-8.5 3.55-8.5 8.25 0 2.33.87 4.43 2.43 5.93L5.5 21l3.13-1.47c1.03.36 2.16.55 3.37.55 5 0 8.5-3.57 8.5-8.33S17 3.5 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.65c-2.5 0-4.25 1.69-4.25 4.1 0 2.4 1.75 4.1 4.25 4.1s4.25-1.7 4.25-4.1c0-2.41-1.75-4.1-4.25-4.1Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 7V5.8A2.8 2.8 0 0 1 11 3h2a2.8 2.8 0 0 1 2.8 2.8V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4.7 7h14.6A1.7 1.7 0 0 1 21 8.7v9.6a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 18.3V8.7A1.7 1.7 0 0 1 4.7 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 11.2h18M9.2 11.2v2h5.6v-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanguageSwitcher({ language, onChange, text }) {
  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={text.languageLabel}
    >
      {languages.map((item) => (
        <button
          className={`language-switcher__button${
            language === item.code ? " is-active" : ""
          }`}
          type="button"
          key={item.code}
          disabled={!item.enabled}
          aria-pressed={item.enabled ? language === item.code : undefined}
          title={!item.enabled ? text.germanSoon : undefined}
          onClick={() => item.enabled && onChange(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitcher({ theme, onChange, text }) {
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const actionLabel = isDark
    ? text.enableLightTheme
    : text.enableDarkTheme;

  return (
    <button
      className="theme-switcher"
      type="button"
      data-theme={theme}
      aria-label={actionLabel}
      aria-pressed={isDark}
      title={actionLabel}
      onClick={() => onChange(nextTheme)}
    >
      <span className="theme-switcher__sun" aria-hidden="true">
        ☀︎
      </span>
      <span className="theme-switcher__moon" aria-hidden="true">
        ☾
      </span>
    </button>
  );
}

function ResumeApp() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState(getInitialTheme);
  const text = translations[language];
  const resumeFile = resumeFiles[language] ?? resumeFiles[DEFAULT_LANGUAGE];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", text.description);

    window.localStorage.setItem(STORAGE_KEY, language);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState({}, "", url);
  }, [language, text]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#11100f" : "#f7f4ee");
  }, [theme]);

  return (
    <main className="profile">
      <div
        className="resume-controls"
        role="group"
        aria-label={text.settingsLabel}
      >
        <ThemeSwitcher theme={theme} onChange={setTheme} text={text} />
        <LanguageSwitcher
          language={language}
          onChange={setLanguage}
          text={text}
        />
      </div>

      <section className="hero" aria-labelledby="profile-title">
        <div className="hero__top">
          <div className="avatar-wrap">
            <img
              className="avatar"
              src={avatarUrl}
              alt={text.name}
              width="220"
              height="220"
            />
          </div>

          <div className="status" aria-label={text.statusLabel}>
            <span className="status__dot" aria-hidden="true" />
            <span>{text.status}</span>
          </div>
        </div>

        <div className="hero__content">
          <h1 id="profile-title">{text.name}</h1>
          <p className="role">{text.role}</p>

          <div className="divider" aria-hidden="true" />

          <ul className="stack" aria-label={text.stackLabel}>
            <li>React</li>
            <li>TypeScript</li>
            <li>Next.js</li>
          </ul>

          <div className="facts" aria-label={text.experienceLabel}>
            <div className="fact">
              <BriefcaseIcon />
              <span>{text.experience}</span>
            </div>

            <span className="facts__line" aria-hidden="true" />

            <div className="companies">
              {text.companies.map((company, index) => (
                <Fragment key={company}>
                  {index > 0 && <i aria-hidden="true" />}
                  <span>{company}</span>
                </Fragment>
              ))}
            </div>
          </div>

          <nav className="actions" aria-label={text.linksLabel}>
            <a
              className="button button--primary"
              href={`${import.meta.env.BASE_URL}${resumeFile.path}`}
              download={resumeFile.downloadName}
            >
              <DownloadIcon />
              {text.download}
            </a>

            <a
              className="button"
              href="https://github.com/erazina"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              GitHub
            </a>

            <a
              className="button"
              href="https://t.me/Elina_Razina"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TelegramIcon />
              Telegram
            </a>

            <a
              className="button"
              href="https://max.ru/u/f9LHodD0cOKFGLDCQ1alx_ttaB8rTE_2M3b-uardY3H0HpIAzQYinmfzHr8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MaxIcon />
              MAX
            </a>
          </nav>

          <a
            className="scroll-hint"
            href="#details"
            aria-label={text.scrollLabel}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m7 9 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>

      <section className="details" id="details">
        <h2>{text.aboutTitle}</h2>
        <p>{text.about}</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("resume-root")).render(
  <StrictMode>
    <ResumeApp />
  </StrictMode>,
);
