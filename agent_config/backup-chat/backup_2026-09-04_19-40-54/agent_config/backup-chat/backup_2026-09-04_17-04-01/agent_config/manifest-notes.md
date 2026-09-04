# Manifest.json Нотатки

## Категорії файлів

### Виконувані файли (copy_full)
- `AGENT/scripts/anti_loop.py` — Механізм запобігання циклам, відстежує запити агента та блокує нескінченні цикли за допомогою хешування signature(tool_name, tool_input) вхідних даних, закодованих у JSON; target() витягує filePath/path/target/uri з параметрів інструменту
- `AGENT/scripts/watch_agent_file.py` — Відстежує AGENT/agents/Comfy-smart-lady.md кожні 60 секунд за допомогою порівняння хешів MD5; створює резервні копії з часовими мітками в agent_config/backup-agent/ у форматі AGENT_YYYY-MM-DD_HH-MM-SS.zip; записує всі події в agent_config/watcher_log.txt
- `AGENT/scripts/agent_startup.py` — Скрипт оркестрації автозавантаження; перевіряє синтаксис anti_loop.py, watch_agent_file.py, str.translate.py через compile() перед запуском спостерігача як окремого процесу (CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS у Windows)
- `AGENT/scripts/str.translate.py` — Перекладач розкладки клавіатури EN↔UK за допомогою str.maketrans() з попередньо обчисленими таблицями перекладу; decode_text(text, to_ukrainian=True) конвертує текст з помилками між макетами
- `AGENT/scripts/vercel_error_tracker.py` — Відстеження та логування помилок Vercel AI Gateway

### Хуки-конфігурації (copy_full)
- `AGENT/hooks/Loops.json` — Конфігурація хука PreToolUse; викликає `python AGENT/scripts/anti_loop.py` з таймаутом 8с
- `AGENT/hooks/watch_agent_file.json` — Конфігурація хука PreToolUse; викликає `python AGENT/scripts/watch_agent_file.py` з таймаутом 8с
- `AGENT/hooks/str.translate.json` — Конфігурація хука для перекладу розкладки
- `AGENT/hooks/vercel_error_tracker.json` — Конфігурація хука для відстеження помилок Vercel

### Плагіни (copy_full)
- `AGENT/plugin/anti-loop.js` — JavaScript-реалізація анти-циклів для браузерних агентів
- `AGENT/plugin/startup.js` — JavaScript-плагін запуску

### Файли-заглушки (stub)
- `agents/Comfy-smart-lady.md` → `.github/copilot-instructions.md`, `.opencode/agents/Comfy-smart-lady.md`, `.clinerules/agents/Comfy-smart-lady.md`, `.continue/agents/Comfy-smart-lady.md` (заглушка, що посилається на канонічний AGENT/)
- Усі файли `skills/*/SKILL.md` → заглушки, що посилаються на канонічний ${workspace}/AGENT/skills/*
  - context-management/SKILL.md
  - errors/SKILL.md
  - localization-qa/SKILL.md
  - safe-edit/SKILL.md
  - session-history/SKILL.md
  - small-steps/SKILL.md
- `knowledge-base/README.md` → посилання на ${workspace}/AGENT/knowledge-base/README.md

### Кореневі файли (copy_full)
Конфігурація, документація та скрипти, розповсюджені по цільових розташуваннях:
- `opencode.json`, `.continue/*`, `agent_config/*` — повні оригінали, що зберігають дозволи на виконання та структуру

## Ключові рішення щодо проектування

1. **Архітектура хуків**: `AGENT/hooks/` містить лише JSON-конфігурації, які викликають скрипти з `AGENT/scripts/`. Фактична обробка відбувається в `AGENT/scripts/*.py`
2. **Механізм запобігання циклу**: Використовує signature(tool_name, tool_input) для хешування вхідних даних, закодованих у JSON; target() витягує filePath/path/target/uri з параметрів інструменту; load_state()/save_state() керує AGENT/state/vscode_agent_anti_loop_state.json — усі працюють з метаданими/підписами, а не з повним вмістом файлу
3. **Життєвий цикл Watcher**: Відстежує зміни AGENT/agents/Comfy-smart-lady.md кожні 60 секунд за допомогою хеш-порівняння MD5, створює резервні копії з мітками часу в agent_config/backup-agent/ у форматі AGENT_YYYY-MM-DD_HH-MM-SS.zip, записує всі події в agent_config/watcher_log.txt
4. **Оркестрація запуску агента**: Перевіряє синтаксис anti_loop.py, watch_agent_file.py, str.translate.py через compile() перед запуском watcher як відокремленого процесу (CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS у Windows; start_new_session=True у Linux/macOS)
5. **Стратегія Stub проти Full**: ~15 повних копій зменшено до ~5 (~65% обсягу скорочення); Файли SKILL та база знань використовують механізм заглушок із шаблоном templates/stub_agents.md, який замінює заповнювач ${source_ref}

### Файли agent_config у root_files (copy_full)
- `agent_config/**` — усі робочі файли конфігурації, скрипти (`scripts/`), шаблони (`templates/`) та **усі бекап-теки**: `backup-agent/` (zip-бекапи AGENT від watcher) та `backup-chat/` (знімки стану чатів). За рішенням користувача (v1.4.2) обмеження на бекапи знято: `SKIP_DIRS` у `update-manifest.py` містить лише `{"__pycache__", "trash"}`, тож усі бекап-файли відображаються у структурі Агента та розповсюджуються sync-agent'ом.

## Історія версій
- v1.4.2: Знято обмеження на бекап-теки (SKIP_DIRS = {"__pycache__", "trash"}): `backup/`, `backup-chat/` та `backup-agent/` тепер повністю входять до `root_files` manifest.json (563 записи)
- v1.4.1: `agent_config/backup-agent/*.zip` додано до `root_files` manifest.json (прибрано "backup-agent" зі SKIP_DIRS у `update-manifest.py`); VERSION підвищено до 1.4.1
- v1.4.0: Оновлено manifest.json через update-manifest.py; синхронізовано структуру файлів; виправлено шляхи в manifest-notes.md (hooks → scripts)
- v1.2.0: Файли SKILL та база знань перетворені на заглушки; додано str.translate.py до оркестрації автозавантаження