#!/usr/bin/env bash
set -euo pipefail
role="$1"; task="$2"; ROOT="$(git rev-parse --show-toplevel)"
id="$(echo "$task" | cut -d: -f1 | tr -c 'A-Za-z0-9\n-' '-')"; slug="${role}-${id}"
mkdir -p "$ROOT/.agents/status/runs" "$ROOT/../zentrix-wt"
git -C "$ROOT" worktree add -b "agent/${slug}" "$ROOT/../zentrix-wt/${slug}" HEAD
cp "$ROOT/.env.local" "$ROOT/../zentrix-wt/${slug}/.env.local" 2>/dev/null || true
cd "$ROOT/../zentrix-wt/${slug}"
nohup agy -p "You are the ${role} subagent for Zentrix. Read AGENTS.md, .agents/agents/${role}.md and Harness.md sections relevant to your task. Task: ${task}. Work only inside your owned paths. Finish by running your role's gates, commit on this branch, and end with: TASK=<id> STATUS=<done|blocked> GATES=<pass|fail> NOTES=<one line>." \
  --print-timeout 25m > "$ROOT/.agents/status/runs/${slug}.txt" 2>&1 &
echo "spawned ${slug} pid $!"
