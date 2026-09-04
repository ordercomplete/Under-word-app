"""Watch the Agent Instruction File — integrated into anti_loop hook."""

import os
import shutil
import time
import sys
from pathlib import Path
from datetime import datetime

# Workspace root: AGENT/hooks/watch_agent_file.py -> parents[2] = workspace root
WORKSPACE = Path(__file__).resolve().parents[2]

SOURCE_FILE = WORKSPACE / "AGENT" / "agents" / "Comfy-smart-lady.md"
BACKUP_DIR = WORKSPACE / "agent_config" / "templates"
LOG_FILE = BACKUP_DIR / "watcher_log.txt"

MAX_BACKUPS = 10  # Максимальна кількість бекапів Comfy-smart-lady_*.md у agent_config/templates/


def prune_old_backups() -> None:
    """Залишити щонайбільше MAX_BACKUPS бекапів, видаливши найстаріші."""
    files = sorted(BACKUP_DIR.glob("Comfy-smart-lady_*.md"), key=lambda p: p.name)
    for stale in files[:-MAX_BACKUPS]:
        try:
            stale.unlink()
            log_message(f"🧹 Видалено найстаріший backup: {stale.name}")
        except OSError:
            pass


def log_message(message: str) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {message}\n"

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    # Append to log file with UTF-8 encoding (create if missing)
    with LOG_FILE.open("a", encoding="utf-8") as stream:
        stream.write(line)

    try:
        print(line.strip(), flush=True)
    except UnicodeEncodeError:
        pass


def get_file_hash(file_path: Path) -> str | None:
    """Compute MD5 hash for change detection."""
    if not file_path.exists():
        return None

    content = file_path.read_bytes()
    import hashlib
    return hashlib.md5(content).hexdigest()


def create_backup(source_path: Path) -> Path | None:
    """Create timestamped backup of the instruction file."""
    if not source_path.exists():
        log_message(f"WARNING: File not found: {source_path}")
        return None

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    backup_filename = f"Comfy-smart-lady_{timestamp}.md"
    backup_path = BACKUP_DIR / backup_filename

    shutil.copy2(str(source_path), str(backup_path))

    log_message(f"COPY -> {backup_path}")
    prune_old_backups()
    return backup_path


def watcher_loop() -> None:
    """Main watch loop — runs continuously in background."""
    log_message("=" * 60)
    log_message("AGENT INSTRUCTION WATCHER STARTED")
    log_message(f"Source file: {SOURCE_FILE}")
    log_message(f"Backup dir:  {BACKUP_DIR}")
    log_message("=" * 60)

    # Initial backup
    initial_backup = create_backup(SOURCE_FILE)
    if initial_backup:
        log_message(f"INITIAL BACKUP CREATED: {initial_backup}")

    last_hash = get_file_hash(SOURCE_FILE)
    log_message(f"Initial file hash: {last_hash}")

    print("\nMonitoring changes... (runs silently in background)\n", flush=True)

    while True:
        try:
            current_hash = get_file_hash(SOURCE_FILE)

            if current_hash != last_hash and current_hash is not None:
                # File changed!
                log_message(">>> INSTRUCTION FILE CHANGED!")
                backup_path = create_backup(SOURCE_FILE)

                if current_hash:
                    last_hash = current_hash

                print(f"   + Saved to {backup_path}", flush=True)

            time.sleep(2)  # Check every 2 seconds

        except KeyboardInterrupt:
            log_message("\nWATCHER STOPPED (User)")
            break

        except Exception as e:
            error_msg = f"ERROR: {str(e)}"
            log_message(error_msg)
            print(f"\n   + Checking file...", flush=True)
            time.sleep(5)


def watcher_is_running() -> bool:
    """Check if watcher process is already running."""
    import platform

    if platform.system() == "Windows":
        command = (
            "Get-CimInstance Win32_Process -Filter \"Name = 'python.exe'\" | "
            "Where-Object { $_.CommandLine -like '*AGENT*hooks*watch_agent_file.py*' } | "
            "Select-Object -First 1 -ExpandProperty ProcessId"
        )
        result = os.system(f'powershell -NoProfile -Command "{command}" > nul 2>&1')
        return result == 0

    # Linux/macOS fallback using pgrep
    result = os.system(f'pgrep -f "AGENT/hooks/watch_agent_file.py" > /dev/null 2>&1')
    return result == 0


def main() -> int:
    """Entry point — called from anti_loop hook or directly."""
    # Validate source file exists
    if not SOURCE_FILE.exists():
        print(f"[watch_agent_file] missing source: {SOURCE_FILE}", file=sys.stderr)
        return 1

    try:
        # Validate script syntax before running
        source = SOURCE_FILE.read_text(encoding="utf-8")
        compile(source, str(SOURCE_FILE), "exec")

    except SyntaxError as e:
        print(f"[watch_agent_file] syntax error in {SOURCE_FILE}: {e}", file=sys.stderr)
        return 1

    # Start watcher loop in a separate process to avoid blocking anti_loop
    import subprocess
    import platform

    if watcher_is_running():
        print("[watch_agent_file] watcher already running")
        return 0

    creation_flags = 0
    if platform.system() == "Windows":
        creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS

    proc = subprocess.Popen(
        [sys.executable, str(__file__)],
        cwd=str(WORKSPACE),
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=creation_flags,
        start_new_session=platform.system() != "Windows",
    )

    print(f"[watch_agent_file] watcher started (PID: {proc.pid})")
    return 0


if __name__ == "__main__":
    # Direct invocation for testing
    watcher_loop()