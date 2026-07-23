# Relocation Command · Gamuda Rawang

A single-file operations dashboard for the plant relocation from **Shah Alam → Kundang Jaya, Rawang**
(baseline 15 June 2026). Built from the `Relocation Timeline & BQ Summary` workbook.

**Live (installable) app:** https://rja9291.github.io/CSProject_Management/

## What's inside
- **Overview** — RM 674,500 budget split by block and phase, key regulatory dates, work by area.
- **Timeline** — the master schedule as an interactive Gantt (weeks 28–51), colour-coded by block, with
  per-activity status you can mark (saved on your device).
- **Budget** — every costed BQ line, filterable by block and phase.
- **Stakeholders** — the List of Parties: owners (PIC) and open items per function.
- **Hiring** — hired vs. required headcount for the 20 JPH ramp-up.
- **BQ & Equipment** — line equipment and jigs for the 14 → 24 JPH adjustment.

## How it's built
`app.html` is the single source of truth — a self-contained fragment (title + style + markup + script,
all data embedded, no external requests). It is:
1. published directly as a claude.ai Artifact, and
2. wrapped by `.claude/build-pages.sh` into a standalone `index.html` for GitHub Pages (offline PWA).

**Never hand-edit `index.html`** — it is generated. Edit `app.html`, and the Stop hook
(`.claude/auto-push.sh`) rebuilds `index.html` and pushes on every update.

Status edits live in `localStorage` (per-URL). Use **Backup / Restore** in the app to move them
between devices — including from the Artifact URL to this Pages URL.
