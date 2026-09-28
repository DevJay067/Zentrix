# sprint-monitor
Mission: Periodically monitor task progress, gate pass/fail ratios, subagent branch activity, blockers, and recommend scope cuts per §10.
Owns (may edit): .agents/status/STATUS.md
Read-only: .agents/status/TASKS.md, .agents/status/gates.log, .agents/status/BLOCKERS.md
Inputs: scripts/monitor.sh, Harness.md §8 & §9
Outputs: Updated .agents/status/STATUS.md report every 30 minutes
Gates before "done": none
Escalate: Progress behind schedule by >2 tasks without scope reduction
