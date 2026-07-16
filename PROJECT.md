# Portfolio Website (Vite + Tailwind + Vanilla HTML/JS)

## 🧠 Общая идея проекта

Это мультистраничный статический сайт портфолио/услуг frontend-разработчика.

Проект построен без фреймворков (React/Vue), используется:

- Vite (сборка)
- TypeScript (минимально, для JS модулей)
- Tailwind CSS (стилизация)
- Обычный HTML + JS (MPA архитектура)

Цель:

- SEO-оптимизированный сайт
- высокая скорость загрузки
- простота поддержки
- лёгкое добавление новых страниц

---

## 🏗 Архитектура

Проект — это **Multi Page Application (MPA)**.

Каждая страница — отдельный HTML файл.

### Структура:

src/
├─ pages/
│ ├─ index.html
│ ├─ repair-case.html
│ ├─ beauty-case.html
│ ├─ website-development.html
│
├─ partials/
│ ├─ menu.html
│ ├─ footer.html
│
├─ assets/
│ ├─ js/
│ │ ├─ main.js
│ │ ├─ include.js
│ │
│ ├─ styles/
│ ├─ tailwind.css
│ ├─ global.css

---

## ⚙️ Сборка (Vite)

Конфигурация использует multi-entry:

- каждая HTML страница указывается в `rollupOptions.input`
- сборка генерирует отдельные HTML файлы в `/dist`

Пример:

```js
rollupOptions: {
  input: {
    main: "src/pages/index.html",
    repair: "src/pages/repair-case.html",
    beauty: "src/pages/beauty-case.html",
    website: "src/pages/website-development.html"
  }
}
```
