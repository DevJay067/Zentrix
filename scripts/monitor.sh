#!/usr/bin/env bash
ROOT="$(git rev-parse --show-toplevel)"; S="$ROOT/.agents/status"
done=$(grep -cE '^- \[x\]' "$S/TASKS.md" 2>/dev/null || echo 0)
total=$(grep -cE '^- \[[ x]\]' "$S/TASKS.md" 2>/dev/null || echo 0)
pass=$(grep -c ' PASS$' "$S/gates.log" 2>/dev/null || echo 0)
fail=$(grep -c ' FAIL$' "$S/gates.log" 2>/dev/null || echo 0)
echo "TASKS ${done:-0}/${total:-0} | GATES pass ${pass:-0} fail ${fail:-0}"
echo "--- agent branches (last commit)"
git for-each-ref --format='%(refname:short)  %(committerdate:relative)' refs/heads/agent 2>/dev/null || true
echo "--- running agy"
pgrep -fl 'agy .*-p' 2>/dev/null || echo none
echo "--- blockers"
cat "$S/BLOCKERS.md" 2>/dev/null || echo none
echo "--- last 8 gate results"
tail -n 8 "$S/gates.log" 2>/dev/null || true
