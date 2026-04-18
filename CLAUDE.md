# CLAUDE.md — Damir's Links Page

Это контекст-файл для Claude Code. Читай его первым перед любыми изменениями в проекте.

---

## 13. ПРАВИЛО ОБРАБОТКИ ВНЕШНИХ ССЫЛОК (финальная версия)

### Приоритет открытия ссылок

1. **ПРИОРИТЕТ 1** — нативное приложение
2. **ПРИОРИТЕТ 2** — системный браузер (Safari / Chrome)
3. **ПРИОРИТЕТ 3** — текущий WebView (только как последний fallback)

### Как достичь этого

Используй простой HTML + `target="_blank"` + `rel="noopener noreferrer"`.

**НЕ используй** JavaScript для deep links. **НЕ используй** `setTimeout`. **НЕ пытайся** программно форсить переход в системный браузер.

### Почему это работает

1. **iOS Universal Links** — обычный HTTPS URL LinkedIn автоматически открывает приложение LinkedIn, если оно установлено. Если нет — iOS открывает Safari (системный браузер). Instagram WebView в процессе НЕ участвует.
2. **Android App Links** — аналогично: HTTPS URL открывает Chrome или приложение, в зависимости от того что установлено и настроено как default для домена.
3. **Для web-only сайтов** (без приложения, типа Grow Up) — `target="_blank"` открывает новую вкладку в текущей среде. Это приемлемо: обычные сайты отлично рендерятся в WebView.

### Это правило применяется ко ВСЕМ внешним ссылкам — включая футер

Не только кнопки в `links-block`, но и любые ссылки в `footer-block`, в био и где бы то ни было. Например, `Made with Claude Code` ведёт на `anthropic.com/claude-code` — там тоже `target="_blank"` + `rel="noopener noreferrer"`, чтобы открывалось в системном браузере, а не в WebView Instagram.

### Примеры

```html
<!-- LinkedIn (есть приложение) -->
<a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer">LinkedIn</a>

<!-- YouTube (есть приложение) -->
<a href="https://youtube.com/@channel" target="_blank" rel="noopener noreferrer">YouTube</a>

<!-- Twitter / X (есть приложение) -->
<a href="https://x.com/username" target="_blank" rel="noopener noreferrer">Twitter</a>

<!-- Telegram (есть приложение) -->
<a href="https://t.me/username" target="_blank" rel="noopener noreferrer">Telegram</a>

<!-- Grow Up (web-only) -->
<a href="https://growup-system.pages.dev" target="_blank" rel="noopener noreferrer">Grow Up</a>
```

### Чего НЕ делать (критично)

- НЕ добавлять `onclick` с JavaScript для deep links
- НЕ использовать `setTimeout` для fallback
- НЕ использовать схемы вида `linkedin://`, `twitter://` и т.д.
- НЕ пытаться детектировать приложение через `visibilitychange`

Это всё только ломает поведение, которое ОС уже реализует правильно через Universal Links / App Links. В Instagram WebView JS-подход открывает приложение И оставляет открытой веб-версию параллельно — двойной переход вместо одного.

### Исключение — только WhatsApp

WhatsApp — единственный случай, где схема `https://wa.me/` работает лучше чем обычный HTTPS URL:

```html
<a href="https://wa.me/77066347600?text=..." target="_blank" rel="noopener noreferrer">WhatsApp</a>
```

Это работает и как Universal Link (открывает приложение), и в браузере (показывает веб-версию с кнопкой «Открыть»).

---

## 14. АРХИТЕКТУРА ПРОЕКТА (v2)

Проект использует **Critical CSS Inlining + External Modules** подход.

### Структура файлов

```
project-root/
├── index.html                    # единственная HTML-страница
├── favicon.ico, .svg, -96x96.png # в корне (обязательно для SEO/соцсетей)
├── apple-touch-icon.png
├── web-app-manifest-192x192.png
├── web-app-manifest-512x512.png
├── site.webmanifest
├── CLAUDE.md                     # документация проекта
├── README.md
├── styles/
│   ├── tokens.css                # CSS-переменные (цвета, размеры, transitions)
│   ├── base.css                  # reset + базовая типографика + reduced-motion
│   ├── components.css            # переиспользуемые компоненты (avatar, button)
│   └── layout.css                # layout главной страницы + атмосферный фон
├── scripts/
│   └── main.js                   # reduced-motion detection (см. §13: deep-link JS не используется)
└── assets/
    └── image/                    # изображения для будущих страниц (аватар и т.д.)
```

### Принципы

1. **Critical CSS inline** в `<head>` — только переменные, базовая типографика и body background. Ровно столько, чтобы первый paint был без FOUC.
2. **Остальные стили** — внешние модули, кэшируются браузером.
3. **JavaScript** с атрибутом `defer` — не блокирует парсинг HTML.
4. **Шрифты** — асинхронная загрузка через `media="print" onload="this.media='all'"` + `<noscript>` fallback.
5. **SVG иконки** — inline в HTML, не отдельными файлами.

### Порядок каскада для стилей

`tokens` → `base` → `components` → `layout`. Не переставлять: layout переопределяет позиционирование `body` поверх base, а components полагаются на переменные из tokens.

### Правила для новых страниц

1. Копируешь `index.html` как шаблон.
2. Переиспользуешь `tokens.css`, `base.css`, `components.css` без изменений.
3. Создаёшь новый `layout.css` (или секционный файл) под специфику страницы.
4. Переиспользуешь `scripts/main.js`.

### Production-оптимизации

- Preconnect к `fonts.googleapis.com`, `fonts.gstatic.com`, `api.fontshare.com`.
- `prefers-reduced-motion` уважается на двух уровнях: CSS (`@media`) + JS (`.reduced-motion` класс на `<html>`).
- Favicon в корне — иначе WhatsApp/Telegram/Slack не подхватывают превью.
- `site.webmanifest` использует палитру проекта (`#0F0E0C`), не белый по умолчанию.
