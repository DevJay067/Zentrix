#!/usr/bin/env bash
set -euo pipefail
br="$1"; gate="${2:-all}"
git merge --no-ff --no-commit "$br" || { git merge --abort; echo "CONFLICT: resolve manually"; exit 1; }
if bash scripts/gate.sh "$gate"; then
  git commit -m "merge $br (gate $gate pass)"
else
  git merge --abort
  echo "gate failed: merge aborted"
  exit 1
fi
