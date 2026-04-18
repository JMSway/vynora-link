# CLAUDE.md — Damir's Links Page

Это контекст-файл для Claude Code. Читай его первым перед любыми изменениями в проекте.

---

## 13. ПРАВИЛО ОБРАБОТКИ ВНЕШНИХ ССЫЛОК

Для всех ссылок, которые добавляются на страницу в будущем, должен соблюдаться следующий порядок приоритета открытия:

1. **ПРИОРИТЕТ 1 — нативное приложение сервиса**
   Если у сервиса есть мобильное приложение (LinkedIn, WhatsApp, Instagram, Telegram, YouTube и т.д.) — пытаемся открыть ссылку через deep link этого приложения.

2. **ПРИОРИТЕТ 2 — системный браузер (Safari / Chrome)**
   Если приложение не установлено или deep link не поддерживается — открываем ссылку в системном браузере (Safari на iOS, Chrome на Android). Для этого используем `target="_blank"` и `rel="noopener noreferrer"`.

3. **FALLBACK — текущий контекст**
   Если предыдущие варианты не сработали (например, внутри WebView Instagram) — ссылка откроется в текущем браузере. Это неизбежное техническое ограничение платформ соц-сетей, которое нельзя обойти программно.

Для каждой новой внешней ссылки использовать JS-хелпер `openExternalLink(webUrl, deepLinkUrl)`, реализующий вышеуказанный приоритет. Хелпер уже объявлен в `index.html`.

**Пример использования:**

```html
<a href="https://www.linkedin.com/in/abdimanapovda"
   target="_blank"
   rel="noopener noreferrer"
   onclick="openExternalLink('https://www.linkedin.com/in/abdimanapovda', 'linkedin://in/abdimanapovda'); return false;">
  LinkedIn
</a>
```

Для web-only сервисов (как Grow Up) deep link не нужен — просто `target="_blank"` + `rel="noopener noreferrer"`.

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
│   └── main.js                   # deep links helper + reduced-motion class
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
