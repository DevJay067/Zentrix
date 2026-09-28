#!/usr/bin/env bash
bad=0
git ls-files | grep -E '(^|/)\.env(\.local)?$' && { echo "✗ env file is tracked"; bad=1; }
pat='(PRIVATE_KEY=0x[0-9a-fA-F]{64}|PRIVATE_KEY=[0-9a-fA-F]{64}|sk_[A-Za-z0-9]{24,}|mst-mcp-secret|OAUTH_CLIENT_SECRET=\S+)'
if git ls-files -z | grep -zvE '(scripts/check-secrets\.sh|Harness\.md)' | xargs -0 grep -InE "$pat" 2>/dev/null; then
  echo "✗ secret-like string in tracked files"
  bad=1
fi
exit $bad
