---
name: theme-audit
description: Check frontend styling for theme token compliance, contrast, and states.
---

# Theme Audit Skill

Run for visual QA:
1. Execute `bash scripts/gate.sh theme`.
2. Inspect components for missing focus styles, empty/loading/error states.
3. Verify that text/background color contrast satisfies WCAG AA (≥ 4.5:1 for normal text).
