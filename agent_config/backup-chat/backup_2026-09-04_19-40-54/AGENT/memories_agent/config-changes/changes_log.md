# 📝 Зміни конфігурації

## Усунення дублікатів core scripts — 2026-08-31 20:10

### Проблема:
Я створила новий файл AGENT/scripts/startup_all.py замість використовувати вже існуючий .github/scripts/agent_startup.py.

### Рішення:
**AGENT/scripts/agent_startup.py вже робить все те саме:**
- ✅ Запускає watcher daemon через start_watcher() → запускає watch_agent_file.py як detached процес
- ✅ Валідізує core скрипти (anti_loop.py, watch_agent_file.py, str.translate.py)
- ✅ Перевіряє чи watcher уже запущений перед стартуванням
- ✅ Запускає синхронізацію через check_for_updates()

### Збережено:
**AGENT/scripts/startup_all.py залишається як єдина центральна точка завантаження для всіх чатів (.github/, .opencode/, .clinerules/).**  
**.github/scripts/agent_startup.py замінено посиланням на startup_all.py.

### Результат:
✅ Усунуто дублікати — один файл запускає watcher daemon, anti_loop.py, str.translate.py для всіх чатів.

---

## Структурне узгодження hook/скрипти — 2026-09-02 12:45

### Рішення користувача:
Папка хуків (`AGENT/hooks/`) має містити тільки **виконавчі файли**, а всі чати
мають посилатись і виконувати скрипти канонічно в **`AGENT/scripts/`**.

### Виконано:
- ✅ `AGENT/hooks/` — лишились тільки JSON-конфіги (`Loops.json`, `str.translate.json`,
  `vercel_error_tracker.json`, `watch_agent_file.json`); Python-скрипти перенесені в `AGENT/scripts/`.
- ✅ Всі виконавчі хуки чатів (`Loops.json` ×3, JS-завантажувачі opencode/clinerules/github/loader)
  викликають `AGENT/scripts/*.py`.
- ✅ `.py`-дублікати з `.github/hooks/`, `.clinerules/hooks/`, `.continue/hooks/`, `.opencode/hooks/`,
  `.github/scripts/agent_startup.py` — перенесені в Корзину (`AGENT/trash/`, delete_to_trash.py).
- ✅ `update-manifest.py` / `manifest.json`: розповсюдження `hooks/*.py` прибрано;
  `agent-lock.json` узгоджено (`sync-agent.py --update --apply`).
- ✅ Оновлено інсталятори та документацію (шляхи на `AGENT/scripts/`).

### Стан:
🟢 Узгоджено. Наступний крок — фінальна верифікація (py_compile, JSON, grep) та, за бажанням, commit.

---

## Міграція `.opencode/plugin/` → `.opencode/plugins/` (Варіант Б) — 2026-09-02 13:15

### Рішення:
Зробити `.opencode` за стандартом opencode: локальні плагіни автозавантажуються
з каталогу `.opencode/plugins/` (множина), без `plugin`-масиву в `opencode.json`.

### Виконано:
- ✅ `anti-loop.js`, `startup.js`, `STARTUP.md` перенесено в `.opencode/plugins/`;
  `.opencode/plugin/` (порожня) → Корзина.
- ✅ Канонічний `AGENT/plugin/startup.js` створено; `AGENT/plugin/anti-loop.js` уже актуальний.
- ✅ `opencode.json`: ключ `plugin` прибрано (плагіни тепер авто-вантажаться).
- ✅ `update-manifest.py` + `manifest.json`: `plugin/anti-loop.js` і `plugin/startup.js`
  → `.opencode/plugins/*.js`; `agent-lock.json` узгоджено.
- ✅ Документація та інсталятори оновлені на `.opencode/plugins/`.

### Стан:
🟢 Готово. Старт opencode тепер автоматично піднімає і watcher (startup.js), і anti-loop.

---

## Оновлення з upstream `ae2e4db` — 2026-09-02 18:50

### Проблема:
Агент відстає на 1 коміт від `origin/main`. Необхідно оновити з центрального репо.

### Дії:
- ✅ `git stash --include-untracked` — збереження локальних змін
- ✅ `git pull origin main` — fast-forward `e7bee21` → `ae2e4db`
- ✅ `git stash pop` — відновлення локальних змін
- ✅ `py_compile` усіх скриптів з нових шляхів → OK
- ✅ Видалено дублікат `AGENT/memories_аgent/` (кирилилиця) через `delete_to_trash.py`

### Що змінилося в upstream `ae2e4db`:
- **Restructuring**: перенесено Python-скрипти з `AGENT/hooks/` → `AGENT/scripts/`; `AGENT/hooks/` тепер містить лише JSON-конфіги
- **OpenCoder**: міграція `.opencode/plugin/` → `.opencode/plugins/`
- **Очищення**: видалено дублікати `.py`-файлів з оболонок чатів
- **Документація**: оновлено інсталятори, STARTUP.md, SCRIPTS_CATALOG.md
- **Бекапи**: додано файли бекапів у git

### Стан:
🟢 Оновлення завершене. Усі скрипти компілюються з нових шляхів. Конфігурація синхронізована.
## 2026-09-02 19:36 — Корекція ротації бекапів (ліміт 10)
- `AGENT/scripts/watch_agent_file.py`: prune тепер викликається у КОЖНОМУ циклі (не тільки після власного знімка) + на старті; сортування за ім'ям (таймстамп), а не mtime — sync скидає mtime при копіюванні між workspace.
- `agent_config/scripts/cleanup_backup_agent.py`: шлях від розташування скрипта (не від CWD), сортування за ім'ям.
- Причина багу: watcher (PID 35860) був запущений з D:/GEN/Comfy-smart-lady-agent і чистив чужу папку; sync-agent копіював знімки між workspace → 18/10.
- Перезапуск: старий daemon зупинено, watcher запущено з Music_Doc (PID 36532), бекапи 18→10 (8 шт у trash).

## 2026-09-02 20:30 — Механізм ротації 10 поширено на backup-chat
- `AGENT/scripts/watch_agent_file.py`: нова `prune_old_chat_backups()` (ліміт MAX_CHAT_BACKUPS=10), виклик на старті + щоциклу; сортування за ім'ям папки (mtime скидається sync-ом).
- `agent_config/scripts/sync-agent.py`: `_prune_old_backups` — сортування за ім'ям замість mtime.
- `agent_config/scripts/cleanup_backup_agent.py`: тепер ротує і папки backup-chat.
- 2 найстаріші папки (2026-08-29) → trash, 12→10. Скрипти синхронізовано в D:/GEN/Comfy-smart-lady-agent, watcher перезапущено (PID 3196).
