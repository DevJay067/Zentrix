#!/usr/bin/env bash
hits=$(grep -rInE '#[0-9a-fA-F]{6}\b' src --include=*.ts --include=*.tsx --include=*.css 2>/dev/null \
  | grep -v 'styles/tokens.css')
if [ -n "$hits" ]; then echo "$hits"; echo "✗ raw hex outside tokens.css"; exit 1; fi
