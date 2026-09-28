---
name: gate
description: Run verification gates before declaring any task complete.
---

# Gate Skill

Run when a task claims to be done:
1. Execute `bash scripts/gate.sh <name>` (or `all`).
2. Quote the last 15 lines of the command output.
3. Refuse to mark the task complete on any non-zero exit code.
