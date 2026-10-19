# Operation Full Stack — Kerala Edition

Three files, one plan: intern → full-stack developer in ~32 weeks, tuned for the Kerala / South India market (and the big Indian IT hubs).

## What's in here

| **index.html** | **Multi-Page Home**: Overview hero, live progress tracker, anime training arc ribbon, curriculum directory hub, and motivational meme wall. |
| **market.html** | **Market Intel**: 2026 Indian tech hiring reports, salary benchmarks, and the 18-tool relevance matrix. |
| **roadmap.html** | **32-Week Roadmap**: 9 seasons, 148 interactive checkpoints, verified YouTube courses, and boss objectives. |
| **schedule.html** | **Daily Schedule**: 6-hour daily operating system, weekly breakdown, 5 laws, and milestone save-points. |
| **projects.html** | **Project Ladder**: 5 progressive portfolio projects from vanilla JS to SkillBridge Capstone (Docker + CI/CD). |
| **jobs.html** | **Job Hunt Playbook**: Infopark/Technopark breakdown, 14 target companies, 300 application math, and copyable referral scripts. |
| **interviews.html** | **Interview Bank**: 40 fresher interview questions across JS, React, Node/API, and HR rounds. |
| **cheats.html** | **Cheat Sheets**: 15 VS Code shortcuts, Git daily commands, JS array methods, and official PDF links. |
| **review.html** | **Peer Review & Sources**: 7 red-team risks & mitigations, and research citations. |
| **Full-Stack-Roadmap-Kerala.html** | **All-in-One Single Page**: The complete roadmap in a single scrollable document. |
| **Full-Stack-Study-Tracker.xlsx** | The working tracker: Dashboard, 148-row Study Tracker, 32-week Weekly Log (pre-dated from Mon 19 Oct 2026), Projects, DSA Log (150 slots), Job Applications (200 rows), Interview Prep (40 questions), Resources, Cheat Sheet, Skills. | Open in Excel / LibreOffice / Google Sheets. Only fill the white cells — the dashboard is formula-driven. |
| **assets/** | The motivational artwork (hero, boss, victory) plus the anime meme images (DBZ, Naruto/Rock Lee, Solo Leveling, My Hero Academia, Attack on Titan). | Optional — every image is already embedded in the HTML, so the page works offline. |
| **image-search/** | Original downloaded meme files before cropping. | Safe to delete. |
| **generate_multipage.js** | Node.js build script to regenerate all 9 multi-page HTML files whenever content is updated. | Run `node generate_multipage.js`. |

## The plan in one paragraph

**Season 1 (W1–2)** Git + HTML/CSS pro → **Season 2 (W3–7)** JavaScript deep dive → **Season 3 (W8–11)** React + TypeScript + Tailwind → **Season 4 (W12–16)** Node + Express + MongoDB (JWT auth, deployed API) → **Season 5 (W17–18)** SQL + Python/Django → **Season 6 (W19–22)** capstone + Docker + CI/CD → **Season 7 (ongoing)** 45 min DSA daily → **Season 8 (W23–24)** Power BI → **Season 9 (W25–32)** portfolio, resume, 300 targeted applications, referrals, mock interviews.

Weekly load: **6 h × 4 weekdays + 1 project day = ~30 h/week.**

## Three rules that decide whether this works

1. **70/30 rule** — 70% of study time is building, 30% watching. Every video ends with the tab closed.
2. **One boss per season** — no new phase until the current deliverable is deployed with a live URL.
3. **Apply wider than Kerala** — 70% Kerala (Infopark/Technopark/Cyberpark) + 30% Bengaluru/Chennai/Hyderabad/remote.

## Anime motivation checkpoints

The page now opens with a **Training Arc** ribbon (DBZ / Naruto / Solo Leveling), then keeps the energy going:

- **Naruto "nindō" divider** before the roadmap — *never skip two days in a row*
- **My Hero Academia "PLUS ULTRA"** mid-boss card after Season 4, at the point where most people quit
- **Solo Leveling "ARISE"** banner over the project ladder
- **Attack on Titan (Levi)** banner in the job-hunt section
- **Anime meme wall** in the motivation section (Goku, Rock Lee, All Might, Levi, Solo Leveling)

## User Experience & Interactive Features

- **🌙 Dark Mode**: 1-click toggle in the navbar with auto-saving to `localStorage` and zero flash on load. Custom anime cyberpunk dark palette.
- **🔍 Instant Search & Command Palette (`Ctrl + K`)**: Pre-indexed with 276 items across all 9 seasons, 148 checkpoints, verified courses, projects, interview questions, and tools. Navigate with arrow keys, `Enter` to open, `Esc` to close.
- **⏱️ Pomodoro / Deep Work Study Timer**: Floating timer preset to 25m Pomodoro, 50m Deep Work, 5m Rest, and 15m Break with offline audio synthesis chime.
- **💾 JSON Backup & Restore**: Download progress backups anytime (`📥 Backup (JSON)`) and restore them on any computer or browser (`📤 Restore`).
- **📱 Universal Responsive Fit**: Guaranteed fit from 320px XS mobile to 4K Ultrawide with touch-friendly pills, scroll snap, and zero horizontal page overflow.

## Fixed in this version

- **Checklist clicks no longer jump the page.** Root cause: the back-to-top button shared `id="top"` with `<main id="top">`, and the browser's fragment-scrolling re-fired on every click. Renamed, plus a scroll guard on every checkbox.
- Mobile nav now wraps into a touch-scrollable horizontal pill bar with scroll snap instead of clipping.


## Note on accuracy

All YouTube videos, playlists and PDF cheat sheets were verified to exist when this was built (Oct 2026). Salary and demand figures come from 2026 hiring reports, live Infopark listings and salary aggregators — treat them as directional, not guarantees.
