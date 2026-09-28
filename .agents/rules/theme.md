# Theme Rules (Harness.md §3.7)

| Token | Hex | Use |
|---|---|---|
| `--zx-primary` | `#D84040` | Primary fills, large/bold headings, chart accent |
| `--zx-primary-deep` | `#A31D1D` | Buttons with white text, links, hover/active, text on cream |
| `--zx-cream` | `#ECDCBF` | App background |
| *derived* `--zx-ink` | `#2A0F0F` | Body text |
| *derived* `--zx-muted` | `#6B4A4A` | Secondary text |
| *derived* `--zx-surface` | `#F7EFDF` | Cards on cream |
| *derived* `--zx-success` / `--zx-warning` | `#2F7D4F` / `#B7791F` | Status only, always paired with icon + label |

Contrast requirements:
- White on `#D84040` is ≈4.4:1 (under the 4.5:1 AA line for normal text) and `#D84040` text on cream is ≈3.3:1.
- Buttons with text use `#A31D1D` (≈7.6:1 with white).
- `#D84040` is for large/bold text, fills and graphics; body text is `--zx-ink`.
- Charts use tints of the primary plus ink; never rely on color alone.
- All colors live in `packages/frontend/src/styles/tokens.css`; no raw hex anywhere else (`check-theme` enforces).
