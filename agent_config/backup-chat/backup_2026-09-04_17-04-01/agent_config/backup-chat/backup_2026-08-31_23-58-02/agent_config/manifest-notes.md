# Manifest.json Notes

## File Categories

### Executable Files (copy_full)
- `hooks/anti_loop.py` — Anti-loop mechanism, monitors agent queries and blocks infinite loops using signature(tool_name, tool_input) hashing JSON-encoded input; target() extracts filePath/path/target/uri from tool parameters
- `hooks/watch_agent_file.py` — Monitors AGENT/agents/Comfy-smart-lady.md every 2 seconds via MD5 hash comparison; creates timestamped backups in templates/ with format Comfy-smart-lady_YYYY-MM-DD_HH-MM-SS.md; logs all events to templates/watcher_log.txt
- `scripts/agent_startup.py` — Auto-loader orchestration script; validates syntax of anti_loop.py, watch_agent_file.py, str.translate.py via compile() before launching watcher as detached process (CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS on Windows)
- `plugin/anti-loop.js` — JavaScript anti-loop implementation for browser-based agents
- `hooks/Loops.json` — Loop state configuration and thresholds
- `hooks/str.translate.py` — EN↔UK keyboard layout translator using str.maketrans() with precomputed translation tables; decode_text(text, to_ukrainian=True) converts mistyped text between layouts

### Stub Files (stub)
- `agents/Comfy-smart-lady.md` → `.github/copilot-instructions.md`, `.opencode/agents/Comfy-smart-lady.md`, `.clinerules/agents/Comfy-smart-lady.md`, `.continue/agents/Comfy-smart-lady.md` (5-line stub referencing canonical AGENT/)
- All `skills/*/SKILL.md` files → stub references to canonical ${workspace}/AGENT/skills/*
  - context-management/SKILL.md
  - errors/SKILL.md
  - localization-qa/SKILL.md
  - safe-edit/SKILL.md
  - session-history/SKILL.md
  - small-steps/SKILL.md
- `knowledge-base/README.md` → stub reference to ${workspace}/AGENT/knowledge-base/README.md

### Root Files (copy_full)
Configuration, documentation, and scripts distributed to target locations:
- `opencode.json`, `.continue/*`, `agent_config/*` — full copies preserving executable permissions and structure

## Key Design Decisions

1. **Anti-loop mechanism**: Uses signature(tool_name, tool_input) hashing JSON-encoded input; target() extracts filePath/path/target/uri from tool parameters; load_state()/save_state() manage AGENT/state/vscode_agent_anti_loop_state.json — all working on metadata/signatures not full file content
2. **Watcher lifecycle**: Monitors AGENT/agents/Comfy-smart-lady.md for changes every 2 seconds using MD5 hash comparison, creates timestamped backups in templates/ directory with format Comfy-smart-lady_YYYY-MM-DD_HH-MM-SS.md, logs all events to templates/watcher_log.txt
3. **Agent startup orchestration**: Validates syntax of anti_loop.py, watch_agent_file.py, str.translate.py via compile() before launching watcher as detached process (CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS on Windows; start_new_session=True on Linux/macOS)
4. **Stub vs Full strategy**: ~15 full copies reduced to ~5 (~65% volume reduction); SKILL files and knowledge-base use stub mechanism with templates/stub_agents.md template replacing ${source_ref} placeholder

## Version History
- v1.2.0: Converted SKILL files and knowledge-base to stubs; added str.translate.py to auto-loader orchestration