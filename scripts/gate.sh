#!/usr/bin/env bash
set -uo pipefail
export PATH="/mnt/d/Softwares/bun/bin:$PATH"
BUN="bun"
if command -v bun.exe >/dev/null 2>&1 && ! command -v bun >/dev/null 2>&1; then
  BUN="bun.exe"
fi

ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"; LOG=".agents/status/gates.log"; mkdir -p .agents/status
run() { # name, command...
  local n="$1"; shift
  if "$@"; then echo "$(date +%H:%M:%S) $n PASS" | tee -a "$LOG"; else echo "$(date +%H:%M:%S) $n FAIL" | tee -a "$LOG"; return 1; fi
}
env_g()       { run env       $BUN scripts/preflight.ts; }
contracts_g() { run contracts bash -c "cd contracts && $BUN x hardhat compile && $BUN x hardhat test"; }
web_g()       { run web       $BUN run build; }
secrets_g()   { run secrets   bash scripts/check-secrets.sh; }
theme_g()     { run theme     bash scripts/check-theme.sh; }
proof_g()     { run proof     $BUN scripts/check-chain-proof.ts; }
case "${1:-all}" in
  env) env_g;; contracts) contracts_g;; web) web_g;; secrets) secrets_g;; theme) theme_g;; proof) proof_g;;
  all) rc=0; for f in env_g contracts_g web_g secrets_g theme_g proof_g; do $f || rc=1; done; exit $rc;;
  *) echo "unknown gate"; exit 2;;
esac
