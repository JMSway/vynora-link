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
