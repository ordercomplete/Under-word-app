from pathlib import Path
import time, os

BACKUP_DIR = Path("agent_config/backup-agent")
MAX_BACKUPS = 10

files = sorted(BACKUP_DIR.glob("AGENT_*.zip"), key=lambda p: p.stat().st_mtime)
to_delete = files[:-MAX_BACKUPS]

for f in to_delete:
    for attempt in range(5):
        try:
            time.sleep(2)
            f.unlink()
            print(f"Видалено: {f.name}")
            break
        except OSError as e:
            print(f"Спроба {attempt+1}/5 помилка для {f.name}: {e}")

remaining = len(list(BACKUP_DIR.glob("AGENT_*.zip")))
print(f"\nЗалишилось архівів: {remaining} (ліміт: {MAX_BACKUPS})")
