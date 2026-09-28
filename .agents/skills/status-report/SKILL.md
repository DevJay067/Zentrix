---
name: status-report
description: Monitor sprint progress, run status scripts, and update STATUS.md.
---

# Status Report Skill

Run periodically:
1. Execute `bash scripts/monitor.sh`.
2. Compare progress against the plan in Harness.md §8 and §9.
3. Rewrite `.agents/status/STATUS.md` using the standard status template.
