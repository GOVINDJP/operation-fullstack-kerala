const fs = require('fs');
const path = require('path');
const { INTERVIEW_BANK } = require('./interview_data.js');

const baseDir = __dirname;
const srcHtmlPath = path.join(baseDir, 'Full-Stack-Roadmap-Kerala.html');
const rawHtml = fs.readFileSync(srcHtmlPath, 'utf8');

// 1. Extract base CSS
const cssMatch = rawHtml.match(/<style>([\s\S]*?)<\/style>/);
if (!cssMatch) {
  console.error('Could not find <style> block');
  process.exit(1);
}
let baseCss = cssMatch[1];

// 2. Extract sections from original HTML
const sections = {};
const sectionRegex = /<section[\s\S]*?<\/section>/g;
let m;
while ((m = sectionRegex.exec(rawHtml)) !== null) {
  const fullSec = m[0];
  const tagMatch = fullSec.match(/<section([^>]*)>/);
  if (tagMatch) {
    const attrs = tagMatch[1];
    let key = '';
    const idMatch = attrs.match(/id="([^"]+)"/);
    const classMatch = attrs.match(/class="([^"]+)"/);
    if (idMatch) {
      key = idMatch[1];
    } else if (classMatch) {
      key = classMatch[1].split(' ')[0];
    }
    if (key) {
      sections[key] = fullSec;
    }
  }
}

// Extract all checkpoint IDs from the roadmap section
const checkpointIds = [];
const chkMatch = sections['roadmap'].matchAll(/id="(p\d+-\d+)"/g);
for (const cm of chkMatch) {
  checkpointIds.push(cm[1]);
}
console.log(`Found ${checkpointIds.length} checkpoint IDs.`);

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 3. Build Comprehensive Offline Search Index
const searchIndex = [];

// Seasons
const phaseMatches = rawHtml.matchAll(/<article class="phase [^"]*" id="(phase-\d+)">[\s\S]*?<div class="arc">([^<]+)<\/div>[\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?<div class="boss"><b>[^<]*<\/b>([^<]+)<\/div>/g);
for (const pm of phaseMatches) {
  searchIndex.push({
    cat: 'Season',
    badge: '🗺️ Roadmap',
    title: `${pm[2].trim()} — ${pm[3].trim()}`,
    sub: `Boss: ${pm[4].trim()}`,
    url: `roadmap.html#${pm[1]}`
  });
}

// Checkpoints
const chkBlockMatches = rawHtml.matchAll(/<article class="phase [^"]*" id="(phase-\d+)">([\s\S]*?)<\/article>/g);
for (const pm of chkBlockMatches) {
  const phaseId = pm[1];
  const phaseBlock = pm[2];
  const arcMatch = phaseBlock.match(/<div class="arc">([^<]+)<\/div>/);
  const seasonName = arcMatch ? arcMatch[1].trim() : 'Roadmap';

  const items = phaseBlock.matchAll(/<label class="chk"><input type="checkbox" id="([^"]+)"><span>([^<]+)<\/span><\/label>/g);
  for (const im of items) {
    searchIndex.push({
      cat: 'Checkpoint',
      badge: '✅ Checkpoint',
      title: im[2].trim(),
      sub: `${seasonName}`,
      url: `roadmap.html#${im[1]}`
    });
  }
}

// Courses
const watchMatches = rawHtml.matchAll(/<div class="watch">[\s\S]*?<ul>([\s\S]*?)<\/ul>/g);
for (const wm of watchMatches) {
  const lis = wm[1].matchAll(/<li><a href="([^"]+)"[^>]*>([^<]+)<\/a><span>([^<]+)<\/span><span>([^<]+)<\/span><\/li>/g);
  for (const lm of lis) {
    searchIndex.push({
      cat: 'Course',
      badge: '🎥 Video Course',
      title: lm[2].replace(' ↗', '').trim(),
      sub: `${lm[3].trim()} · ${lm[4].trim()}`,
      url: lm[1]
    });
  }
}

// Projects
const projMatches = rawHtml.matchAll(/<div class="proj">[\s\S]*?<span class="lv">([^<]+)<\/span>[\s\S]*?<h4>([^<]+)<\/h4>[\s\S]*?<div class="stack">([^<]+)<\/div>[\s\S]*?<div class="proof">🎯 ([^<]+)<\/div>/g);
for (const p of projMatches) {
  searchIndex.push({
    cat: 'Project',
    badge: '🚀 Project',
    title: `${p[1].trim()} — ${p[2].trim()}`,
    sub: `${p[3].trim()} · ${p[4].trim()}`,
    url: 'projects.html'
  });
}

// Interview Questions (80 Items with Model Answers from INTERVIEW_BANK)
for (let idx = 0; idx < INTERVIEW_BANK.length; idx++) {
  const item = INTERVIEW_BANK[idx];
  searchIndex.push({
    cat: 'Interview',
    badge: item.categoryLabel,
    title: item.q,
    sub: item.answer.slice(0, 110) + '...',
    url: `interviews.html#iq-${idx + 1}`
  });
}

// Tools
const toolMatches = rawHtml.matchAll(/<tr><td><b>([^<]+)<\/b><\/td><td>([^<]+)<\/td><td><span class='pill [^']*'>([^<]+)<\/span><\/td><td>([^<]+)<\/td><\/tr>/g);
for (const tm of toolMatches) {
  searchIndex.push({
    cat: 'Tool',
    badge: '🛠️ Tool',
    title: tm[1].trim(),
    sub: `${tm[3].trim()} priority · ${tm[4].trim()} · ${tm[2].trim()}`,
    url: 'market.html'
  });
}

// Companies
const compMatches = rawHtml.matchAll(/<tr><td><b>([^<]+)<\/b><\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g);
for (const cm of compMatches) {
  searchIndex.push({
    cat: 'Company',
    badge: '💼 Target Company',
    title: cm[1].trim(),
    sub: `${cm[2].trim()} · ${cm[3].trim()} · ${cm[4].trim()}`,
    url: 'jobs.html'
  });
}

// Cheat Sheets
const cheatMatches = rawHtml.matchAll(/<tr><td><a href='([^']*)'[^>]*><b>([^<]+)<\/b>[^<]*<\/a><\/td><td><span class='pill [^']*'>([^<]+)<\/span><\/td><td>([^<]+)<\/td><\/tr>/g);
for (const ch of cheatMatches) {
  searchIndex.push({
    cat: 'Cheat',
    badge: '⚡ Cheat Sheet',
    title: ch[2].trim(),
    sub: `${ch[3].trim()} · ${ch[4].trim()}`,
    url: ch[1].startsWith('http') ? ch[1] : 'cheats.html'
  });
}

console.log(`Generated ${searchIndex.length} search items for offline index.`);

// Comprehensive Custom UX, Dark Mode & Responsive CSS
const customUxCss = `
/* ---------- MULTI-PAGE ESSENTIALS ---------- */
.nav-links a.active {
  background: #1E1B2E !important;
  color: #FFF9F2 !important;
}

.page-intro-banner {
  padding: 38px 0 20px;
  border-bottom: 1px solid #EDE6DC;
  margin-bottom: 24px;
}
.page-intro-banner .kicker {
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: #B4512E;
  margin-bottom: 8px;
}
.page-intro-banner h1 {
  font-size: clamp(2rem, 3.8vw, 2.9rem);
  font-weight: 900;
  margin: 0 0 10px;
  color: #1E1B2E;
}
.page-intro-banner .sub {
  color: #5A5570;
  font-size: 1.08rem;
  max-width: 80ch;
  line-height: 1.6;
  margin-top: 6px;
}

.next-step-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  border: 1px solid #EDE6DC;
  border-radius: 22px;
  padding: 22px 28px;
  box-shadow: 0 12px 32px rgba(30, 27, 46, .06);
  margin: 50px 0 20px;
  flex-wrap: wrap;
}
.ns-info {
  flex: 1 1 300px;
}
.ns-info h4 {
  font-size: 1.15rem;
  margin: 4px 0 6px;
  color: #1E1B2E;
}
.ns-info p {
  color: #5A5570;
  font-size: .92rem;
  margin: 0;
}
.ns-label {
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #B4512E;
}
.ns-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* Directory / Hub Grid on Overview page */
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
  margin-top: 24px;
}
.hub-card {
  background: #fff;
  border: 1px solid #EDE6DC;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 26px rgba(30, 27, 46, .05);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  position: relative;
  overflow: hidden;
}
.hub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(30, 27, 46, .10);
  border-color: #D8CDBE;
}
.hub-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.hub-icon {
  font-size: 24px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #F8F3EC;
  display: grid;
  place-items: center;
  flex: 0 0 44px;
}
.hub-card h3 {
  font-size: 1.15rem;
  margin: 0;
  color: #1E1B2E;
}
.hub-card p {
  font-size: .88rem;
  color: #5A5570;
  margin: 0 0 16px;
  flex-grow: 1;
  line-height: 1.5;
}
.hub-link {
  font-size: .84rem;
  font-weight: 800;
  color: #6C4CE0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}
.hub-card:hover .hub-link {
  text-decoration: underline;
}

.copy-btn {
  font-family: inherit;
  font-size: .78rem;
  font-weight: 800;
  background: #1E1B2E;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background .15s;
  margin-top: 10px;
}
.copy-btn:hover {
  background: #3A3450;
}
.copy-btn.copied {
  background: #0E9F8A;
}

/* Nav Actions Container */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}
.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  font-family: inherit;
  font-size: .8rem;
  font-weight: 700;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #EDE6DC;
  color: #3A3450;
  transition: all .15s ease;
}
.nav-icon-btn:hover {
  background: #F4ECE2;
  color: #1E1B2E;
}

/* ---------- DARK MODE THEME ---------- */
html.dark {
  color-scheme: dark;
}
html.dark body {
  background: #0D0A14 !important;
  color: #EDE8F5 !important;
}
html.dark body::before {
  background:
    radial-gradient(900px 600px at 8% -5%, rgba(255,107,61,.18), transparent 60%),
    radial-gradient(800px 600px at 100% 8%, rgba(124,92,255,.22), transparent 60%),
    radial-gradient(900px 700px at 50% 110%, rgba(14,159,138,.16), transparent 60%) !important;
}
html.dark a {
  color: #A78BFA;
}
html.dark .nav {
  background: rgba(13,10,20,.94) !important;
  border-bottom-color: #272036 !important;
}
html.dark .logo {
  color: #EDE8F5 !important;
}
html.dark .nav-links a {
  color: #B8ADC9;
}
html.dark .nav-links a:hover {
  background: #251D36;
  color: #FFF;
}
html.dark .nav-links a.active {
  background: #7C5CFF !important;
  color: #FFF !important;
}
html.dark .nav-progress .mini {
  background: #272036;
}
html.dark .card,
html.dark .panel,
html.dark .phase,
html.dark .proj,
html.dark .rt,
html.dark .hub-card,
html.dark details,
html.dark .iq-card {
  background: #171322 !important;
  border-color: #2D253F !important;
  color: #EDE8F5 !important;
  box-shadow: 0 10px 28px rgba(0,0,0,.35);
}
html.dark .hub-icon {
  background: #231B33 !important;
}
html.dark .hub-card h3 {
  color: #EDE8F5 !important;
}
html.dark .hub-card p,
html.dark .card p,
html.dark .proj p,
html.dark .mission,
html.dark .sub,
html.dark .lede {
  color: #ADA4C2 !important;
}
html.dark .chip {
  background: #201A30 !important;
  border-color: #342A4D !important;
  color: #D3C9E6 !important;
}
html.dark .chip.solid {
  background: #7C5CFF !important;
  border-color: #7C5CFF !important;
  color: #FFF !important;
}
html.dark .btn-ghost {
  background: #1D172B !important;
  color: #EDE8F5 !important;
  border-color: #382E52 !important;
}
html.dark .btn-ghost:hover {
  background: #2A213D !important;
}
html.dark .boss {
  background: rgba(40,30,60,.5) !important;
  color: #DCD4ED !important;
}
html.dark .boss b {
  color: #FFF !important;
}
html.dark .watch li {
  background: #1D172B !important;
  border-color: #2D253F !important;
}
html.dark .watch li a {
  color: #C4B5FD !important;
}
html.dark .watch li span {
  color: #9A8FAE !important;
}
html.dark .chk:hover {
  background: #221B33 !important;
}
html.dark .chk input {
  background: #171322 !important;
  border-color: #4A3E6B !important;
}
html.dark .chk input:checked + span {
  color: #6C6285 !important;
  text-decoration-color: #554C6E !important;
}
html.dark .chk span {
  color: #E2DBEE !important;
}
html.dark .bar {
  background: #272036 !important;
}
html.dark .tool-btn {
  background: #1D172B !important;
  border-color: #382D54 !important;
  color: #EDE8F5 !important;
}
html.dark .tool-btn:hover {
  background: #2D2345 !important;
}
html.dark .table-wrap {
  background: #171322 !important;
  border-color: #2D253F !important;
}
html.dark th {
  background: #1F192E !important;
  color: #B5AACC !important;
  border-bottom-color: #2D253F !important;
}
html.dark td {
  border-bottom-color: #251E36 !important;
  color: #EDE8F5 !important;
}
html.dark tr:hover td {
  background: #221B33 !important;
}
html.dark .note {
  background: linear-gradient(120deg, rgba(14,159,138,.12), rgba(124,92,255,.14)) !important;
  border-color: #2F3E48 !important;
}
html.dark .note ul {
  color: #D5CDE4 !important;
}
html.dark .next-step-bar {
  background: #171322 !important;
  border-color: #2D253F !important;
  color: #EDE8F5 !important;
}
html.dark .tmpl {
  background: #120E1C !important;
  border-color: #382D54 !important;
  color: #E3DCF0 !important;
}
html.dark .rt .fix {
  background: rgba(33,150,83,.16) !important;
  color: #6EE7B7 !important;
}
html.dark .proj .proof {
  background: #1D172B !important;
  color: #C5BBDC !important;
}
html.dark .page-intro-banner {
  border-bottom-color: #2D253F !important;
}
html.dark .page-intro-banner h1 {
  color: #EDE8F5 !important;
}
html.dark .foot {
  background: #0A0812 !important;
  border-top: 1px solid #201A30 !important;
}
html.dark .copy-btn {
  background: #7C5CFF !important;
}
html.dark .copy-btn:hover {
  background: #6C4CE0 !important;
}
html.dark .sched-row {
  border-bottom-color: #2D253F !important;
}
html.dark .day {
  border-bottom-color: #2D253F !important;
}
html.dark .day p {
  color: #ADA4C2 !important;
}
html.dark .eyebrow {
  background: #171322 !important;
  border-color: #2D253F !important;
  color: #D5CDE4 !important;
}
html.dark .top {
  background: #7C5CFF !important;
  color: #FFF !important;
}
html.dark .nav-icon-btn {
  background: #1D172B !important;
  border-color: #342A4D !important;
  color: #EDE8F5 !important;
}
html.dark .nav-icon-btn:hover {
  background: #281F3B !important;
}

/* ---------- INTERVIEW Q&A CARDS & ACCORDION ---------- */
.iq-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
  background: #FFF;
  border: 1px solid #EDE6DC;
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 8px 24px rgba(30,27,46,.04);
}
html.dark .iq-controls {
  background: #171322;
  border-color: #2D253F;
}
.iq-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.iq-filter-btn {
  font-family: inherit;
  font-size: .8rem;
  font-weight: 700;
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid #EDE6DC;
  background: #F8F3EC;
  color: #4A4463;
  cursor: pointer;
  transition: all .15s ease;
}
.iq-filter-btn:hover {
  background: #F1EAE0;
  color: #1E1B2E;
}
.iq-filter-btn.active {
  background: #1E1B2E;
  color: #FFF;
  border-color: #1E1B2E;
}
html.dark .iq-filter-btn {
  background: #1F192E;
  border-color: #352B4E;
  color: #C5BADB;
}
html.dark .iq-filter-btn:hover {
  background: #2A213D;
  color: #FFF;
}
html.dark .iq-filter-btn.active {
  background: #7C5CFF;
  border-color: #7C5CFF;
  color: #FFF;
}
.iq-search-input {
  width: 100%;
  max-width: 380px;
  font-family: inherit;
  font-size: .85rem;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #EDE6DC;
  background: #FDFBF7;
  color: inherit;
  outline: 0;
}
html.dark .iq-search-input {
  background: #1A1527;
  border-color: #352B4E;
  color: #EDE8F5;
}
.iq-card {
  background: #FFF;
  border: 1px solid #EDE6DC;
  border-radius: 18px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(30,27,46,.04);
  transition: border-color .15s, box-shadow .15s;
}
.iq-card.mastered {
  border-left: 5px solid #0E9F8A !important;
}
.iq-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
}
.iq-q-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1E1B2E;
  margin: 4px 0 0;
  line-height: 1.4;
}
html.dark .iq-q-title {
  color: #EDE8F5;
}
.iq-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.iq-badge {
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .08em;
  padding: 3px 8px;
  border-radius: 6px;
  background: #F3EEFF;
  color: #5B3BBF;
}
html.dark .iq-badge {
  background: #2D2345;
  color: #C4B5FD;
}
.iq-num {
  font-size: .72rem;
  font-weight: 800;
  color: #78718C;
}
.iq-toggle-btn {
  font-family: inherit;
  font-size: .76rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #EDE6DC;
  background: #FCF7F0;
  color: #B4512E;
  cursor: pointer;
  white-space: nowrap;
  flex: 0 0 auto;
}
html.dark .iq-toggle-btn {
  background: #251D36;
  border-color: #382D52;
  color: #FF9E7A;
}
.iq-body {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #EDE6DC;
  display: none;
}
html.dark .iq-body {
  border-top-color: #2D253F;
}
.iq-body.open {
  display: block;
}
.iq-ans {
  font-size: .94rem;
  line-height: 1.6;
  color: #3A3450;
  margin-bottom: 12px;
}
html.dark .iq-ans {
  color: #D5CDE4;
}
.iq-code {
  background: #171322;
  color: #F0EAFB;
  border-radius: 12px;
  padding: 14px 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .82rem;
  line-height: 1.5;
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid #2B2340;
}
html.dark .iq-code {
  background: #0E0B16;
  border-color: #272036;
}
.iq-code pre {
  margin: 0;
  white-space: pre;
}
.iq-trap {
  background: #FFF7E3;
  border-left: 4px solid #E39A00;
  border-radius: 0 10px 10px 0;
  padding: 10px 14px;
  font-size: .86rem;
  color: #5C4100;
  margin-top: 12px;
}
html.dark .iq-trap {
  background: rgba(227,154,0,.12);
  border-left-color: #FFB020;
  color: #FDE68A;
}
.iq-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #F4ECE2;
  font-size: .78rem;
}
html.dark .iq-footer {
  border-top-color: #221B33;
}

/* ---------- SEARCH MODAL & COMMAND PALETTE ---------- */
.search-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 18, .75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding: 70px 16px 24px;
}
.search-backdrop.open {
  display: flex;
}
.search-modal {
  width: 100%;
  max-width: 640px;
  background: #FFF;
  border: 1px solid #EDE6DC;
  border-radius: 22px;
  box-shadow: 0 24px 60px rgba(0,0,0,.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  animation: modalPop .15s ease-out;
}
@keyframes modalPop {
  from { opacity: 0; transform: translateY(-12px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
html.dark .search-modal {
  background: #171322;
  border-color: #382D52;
  box-shadow: 0 24px 60px rgba(0,0,0,.65);
}
.search-head {
  padding: 14px 18px;
  border-bottom: 1px solid #EDE6DC;
  display: flex;
  align-items: center;
  gap: 12px;
}
html.dark .search-head {
  border-bottom-color: #2B2240;
}
.search-head input {
  width: 100%;
  border: 0;
  outline: 0;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 600;
  background: transparent;
  color: inherit;
}
.search-kbd {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: .72rem;
  padding: 3px 6px;
  border-radius: 6px;
  background: #EDE6DC;
  color: #4A4463;
  white-space: nowrap;
}
html.dark .search-kbd {
  background: #2A213D;
  color: #B5AACC;
}
.search-results {
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.search-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 11px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: background .12s;
}
.search-item:hover, .search-item.selected {
  background: #F4ECE2;
}
html.dark .search-item:hover, html.dark .search-item.selected {
  background: #251D36;
}
.search-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.search-badge {
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .08em;
  padding: 2px 7px;
  border-radius: 6px;
  background: #EDE6DC;
  color: #4A4463;
}
html.dark .search-badge {
  background: #2D2345;
  color: #C4B5FD;
}
.search-item b {
  font-size: .95rem;
}
.search-item span {
  font-size: .8rem;
  color: #6A6480;
}
html.dark .search-item span {
  color: #9C91B4;
}
.search-foot {
  padding: 10px 16px;
  border-top: 1px solid #EDE6DC;
  font-size: .76rem;
  color: #78718C;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,.02);
}
html.dark .search-foot {
  border-top-color: #2B2240;
  background: #120E1C;
  color: #8C82A4;
}

/* ---------- POMODORO TIMER ---------- */
.timer-widget {
  position: fixed;
  bottom: 22px;
  left: 22px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.timer-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #1E1B2E;
  color: #FFF;
  border: 1.5px solid #3B2E58;
  border-radius: 999px;
  padding: 8px 14px;
  font-family: inherit;
  font-weight: 800;
  font-size: .84rem;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(30,27,46,.25);
  transition: transform .15s, background .15s;
}
html.dark .timer-toggle-btn {
  background: #231B33;
  border-color: #48366B;
}
.timer-toggle-btn:hover {
  transform: translateY(-2px);
}
.timer-popup {
  display: none;
  background: #FFF;
  border: 1px solid #EDE6DC;
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 20px 45px rgba(0,0,0,.22);
  width: 270px;
  margin-bottom: 12px;
  animation: modalPop .15s ease-out;
}
html.dark .timer-popup {
  background: #1A1527;
  border-color: #352B4E;
  color: #EDE8F5;
  box-shadow: 0 20px 45px rgba(0,0,0,.55);
}
.timer-popup.open {
  display: block;
}
.timer-modes {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
.timer-mode-btn {
  flex: 1;
  font-size: .72rem;
  font-weight: 800;
  padding: 5px 3px;
  border-radius: 8px;
  border: 1px solid #EDE6DC;
  background: #F8F3EC;
  color: #4A4463;
  cursor: pointer;
  text-align: center;
}
html.dark .timer-mode-btn {
  background: #221B33;
  border-color: #352B4E;
  color: #C5BADB;
}
.timer-mode-btn.active {
  background: #1E1B2E;
  color: #FFF;
  border-color: #1E1B2E;
}
html.dark .timer-mode-btn.active {
  background: #7C5CFF;
  border-color: #7C5CFF;
}
.timer-digits {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-align: center;
  font-variant-numeric: tabular-nums;
  margin: 6px 0 12px;
  color: #1E1B2E;
}
html.dark .timer-digits {
  color: #EDE8F5;
}
.timer-ctrls {
  display: flex;
  gap: 8px;
}
.timer-ctrl-btn {
  flex: 1;
  font-family: inherit;
  font-weight: 800;
  font-size: .82rem;
  padding: 8px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  transition: opacity .15s;
}
.timer-ctrl-btn:hover {
  opacity: .9;
}
.timer-start {
  background: #0E9F8A;
  color: #FFF;
}
.timer-pause {
  background: #E39A00;
  color: #FFF;
}
.timer-reset {
  background: #EDE6DC;
  color: #3A3450;
}
html.dark .timer-reset {
  background: #2A213D;
  color: #C5BADB;
}

/* ============================================================
   FIT-TO-ALL-SCREENS RESPONSIVE ARCHITECTURE
   ============================================================ */
html {
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  overflow-x: hidden;
}
*, *::before, *::after {
  box-sizing: inherit;
}
body {
  overflow-x: hidden;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
img, svg, video, iframe {
  max-width: 100%;
  height: auto;
}
.wrap {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
}
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 16px;
  position: relative;
}
.grid > *, .two > *, .sched > *, .hub-grid > *, .anime-3 > *, .memes > * {
  min-width: 0;
}

@media (max-width: 1180px) {
  .nav-links a {
    padding: 6px 9px;
    font-size: .78rem;
  }
  .nav .wrap {
    gap: 10px;
  }
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero-art {
    max-width: 600px;
    margin: 0 auto;
  }
  .g3 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .sched {
    grid-template-columns: 1fr !important;
  }
  .two {
    grid-template-columns: 1fr !important;
  }
  .anime-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .arc-divider {
    grid-template-columns: 240px 1fr;
    gap: 18px;
    padding: 18px;
  }
}

@media (max-width: 940px) {
  .nav .wrap {
    height: auto;
    padding: 10px 20px 8px;
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .nav-links {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    margin: 0;
    padding: 2px 0 4px;
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 6px;
  }
  .nav-links::-webkit-scrollbar {
    display: none;
  }
  .nav-links a {
    flex: 0 0 auto;
  }
}

@media (max-width: 768px) {
  .wrap {
    padding: 0 16px !important;
  }
  section {
    padding: 38px 0 !important;
  }
  .nav .wrap {
    height: auto !important;
    padding: 10px 14px 8px !important;
    flex-wrap: wrap !important;
    row-gap: 8px !important;
  }
  .nav-progress {
    display: flex !important;
    margin-left: auto;
    font-size: .74rem;
  }
  .nav-progress .mini {
    width: 44px;
    flex: 0 0 44px;
  }
  .nav-links {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    margin: 0 !important;
    padding: 2px 2px 6px !important;
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 6px !important;
    scroll-snap-type: x mandatory;
  }
  .nav-links::-webkit-scrollbar {
    display: none;
  }
  .nav-links a {
    padding: 6px 12px !important;
    font-size: .8rem !important;
    flex: 0 0 auto !important;
    border-radius: 999px !important;
    scroll-snap-align: start;
  }
  .hero {
    padding: 24px 0 16px !important;
  }
  .hero-grid {
    gap: 24px !important;
  }
  h1 {
    font-size: clamp(1.8rem, 5.5vw, 2.5rem) !important;
  }
  .lede {
    font-size: .98rem !important;
  }
  .cta-row .btn {
    width: 100% !important;
    justify-content: center !important;
  }
  .hub-grid {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 14px !important;
  }
  .g3, .g2 {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .anime-3 {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .anime-card .pic {
    height: 220px !important;
  }
  .arc-divider {
    grid-template-columns: minmax(0, 1fr) !important;
    padding: 16px !important;
  }
  .arc-divider img {
    max-height: 200px !important;
    width: 100% !important;
  }
  .meme-strip img, .meme-strip.levi img {
    aspect-ratio: 16/10 !important;
  }
  .next-step-bar {
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 20px !important;
    gap: 16px !important;
    margin: 32px 0 16px !important;
  }
  .ns-actions {
    flex-direction: column !important;
    width: 100% !important;
    gap: 10px !important;
  }
  .ns-actions .btn {
    width: 100% !important;
    justify-content: center !important;
  }
  .toolbar {
    gap: 8px !important;
    justify-content: flex-start !important;
  }
  .toolbar .spacer {
    display: none !important;
  }
  .tool-btn {
    font-size: .78rem !important;
    padding: 7px 12px !important;
  }
  .checks {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 4px !important;
  }
  .chk {
    padding: 9px 8px !important;
    font-size: .88rem !important;
  }
  .phase {
    padding: 16px !important;
    border-radius: 18px !important;
  }
  .phase-head {
    gap: 12px !important;
  }
  .badge {
    width: 44px !important;
    height: 44px !important;
    flex: 0 0 44px !important;
    border-radius: 12px !important;
    font-size: 1rem !important;
  }
  .memes {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .src {
    columns: 1 !important;
  }
  .sched-row {
    grid-template-columns: 90px 1fr !important;
    gap: 10px !important;
  }
  .iq-controls {
    padding: 14px 16px;
  }
  .iq-card {
    padding: 16px 18px;
  }
}

@media (max-width: 400px) {
  .wrap {
    padding: 0 12px !important;
  }
  .logo {
    font-size: .88rem !important;
    gap: 6px !important;
  }
  .logo .dot {
    width: 28px !important;
    height: 28px !important;
    font-size: 14px !important;
  }
  .sched-row {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 4px !important;
  }
  .sched-row .t {
    display: inline-block !important;
    margin-bottom: 2px !important;
  }
  .day {
    flex-direction: column !important;
    gap: 3px !important;
  }
  .day .d, .day .h {
    min-width: 0 !important;
  }
  .mini-table td {
    padding: 8px 4px !important;
  }
  .mini-table td:first-child {
    width: 48% !important;
  }
  .kbd, .code {
    white-space: normal !important;
    overflow-wrap: anywhere !important;
    font-size: .72rem !important;
  }
  .art-tag {
    position: static !important;
    margin-top: 10px !important;
    border-radius: 12px !important;
  }
}

@media (min-width: 1600px) {
  .wrap {
    max-width: 1320px;
  }
  body {
    font-size: 1.05rem;
  }
}
`;

const COMBINED_CSS = baseCss + '\n' + customUxCss;

// Navigation items definition
const NAV_ITEMS = [
  { key: 'overview', title: 'Overview', file: 'index.html', icon: '⚡' },
  { key: 'market', title: 'Market', file: 'market.html', icon: '📊' },
  { key: 'roadmap', title: 'Roadmap', file: 'roadmap.html', icon: '🗺️' },
  { key: 'schedule', title: 'Schedule', file: 'schedule.html', icon: '⏰' },
  { key: 'projects', title: 'Projects', file: 'projects.html', icon: '🚀' },
  { key: 'jobs', title: 'Job hunt', file: 'jobs.html', icon: '💼' },
  { key: 'interviews', title: 'Interviews', file: 'interviews.html', icon: '🎯' },
  { key: 'cheats', title: 'Cheat sheets', file: 'cheats.html', icon: '⚡' },
  { key: 'review', title: 'Review', file: 'review.html', icon: '🛡️' },
];

function buildNav(activeKey) {
  const links = NAV_ITEMS.map(item => {
    const cls = item.key === activeKey ? 'active' : '';
    return `<a href="${item.file}" class="${cls}">${item.title}</a>`;
  }).join('\n      ');

  return `
<header class="nav">
  <div class="wrap">
    <a class="logo" href="index.html"><span class="dot">⚡</span> Operation Full Stack</a>
    <nav class="nav-links" aria-label="Sections">
      ${links}
    </nav>
    <div class="nav-actions">
      <button class="nav-icon-btn" id="searchTrigger" type="button" title="Search all topics, courses, questions (Ctrl + K)">
        🔍 <span class="search-kbd">Ctrl+K</span>
      </button>
      <button class="nav-icon-btn" id="themeToggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode (D)">
        🌙
      </button>
      <div class="nav-progress" aria-hidden="true" title="Your overall roadmap progress">
        <span id="nav-pct-label">0%</span>
        <span class="mini"><i id="nav-fill"></i></span>
      </div>
    </div>
  </div>
</header>`;
}

function buildSearchModal() {
  return `
<!-- Search & Command Palette Modal -->
<div class="search-backdrop" id="searchBackdrop">
  <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search Roadmap">
    <div class="search-head">
      <span style="font-size:18px">🔍</span>
      <input type="text" id="searchInput" placeholder="Search 300+ topics, courses, questions, tools..." autocomplete="off">
      <span class="search-kbd">Esc</span>
    </div>
    <div class="search-results" id="searchResults">
      <!-- Injected via JS -->
    </div>
    <div class="search-foot">
      <span><b>↑↓</b> to navigate</span>
      <span><b>↵</b> to select</span>
      <span><b>Esc</b> to close</span>
    </div>
  </div>
</div>`;
}

function buildPomodoroWidget() {
  return `
<!-- Pomodoro Study Timer -->
<div class="timer-widget" id="timerWidget">
  <div class="timer-popup" id="timerPopup">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b style="font-size:.84rem;letter-spacing:.06em;text-transform:uppercase">⏱️ Focus Session</b>
      <button id="timerCloseBtn" style="background:none;border:0;cursor:pointer;font-size:16px;color:#78718C">✕</button>
    </div>
    <div class="timer-modes">
      <button class="timer-mode-btn active" data-time="1500">25m Pomodoro</button>
      <button class="timer-mode-btn" data-time="3000">50m Deep</button>
      <button class="timer-mode-btn" data-time="300">5m Rest</button>
      <button class="timer-mode-btn" data-time="900">15m Break</button>
    </div>
    <div class="timer-digits" id="timerDigits">25:00</div>
    <div class="timer-ctrls">
      <button class="timer-ctrl-btn timer-start" id="timerStartBtn">▶ Start</button>
      <button class="timer-ctrl-btn timer-reset" id="timerResetBtn">↺ Reset</button>
    </div>
  </div>
  <button class="timer-toggle-btn" id="timerToggleBtn" type="button" title="Pomodoro focus timer">
    <span>⏱️</span> <span id="timerBadge">25:00</span>
  </button>
</div>`;
}

function buildFooter() {
  return `
<footer class="foot">
  <div class="wrap">
    <div>
      <b>Operation Full Stack · Kerala Edition</b>
      <small>Built for a future full-stack developer in Kerala · October 2026</small>
    </div>
    <div style="text-align:right">
      <b>${checkpointIds.length} checkpoints · 9 seasons · 80 interview Q&amp;As</b>
      <small>Multi-page offline-first edition</small>
    </div>
  </div>
</footer>
<button class="top" id="toTop" type="button" aria-label="Back to top">↑</button>`;
}

// Build the state-of-the-art 80 Question & Answer section for interviews.html
function buildInterviewSection() {
  const cardsHtml = INTERVIEW_BANK.map((item, idx) => {
    const qId = `iq-${idx + 1}`;
    const codeBlock = item.code ? `
      <div class="iq-code">
        <pre><code>${escapeHtml(item.code)}</code></pre>
      </div>` : '';
    const trapBlock = item.trap ? `
      <div class="iq-trap">
        <b>⚠️ Interviewer Trap:</b> ${escapeHtml(item.trap)}
      </div>` : '';

    return `
    <div class="iq-card" id="${qId}" data-cat="${item.category}">
      <div class="iq-card-top" onclick="toggleIqAnswer('${qId}')">
        <div style="flex:1;min-width:0">
          <div class="iq-badges">
            <span class="iq-badge">${item.categoryLabel}</span>
            <span class="iq-num">Question ${idx + 1} of ${INTERVIEW_BANK.length}</span>
          </div>
          <h3 class="iq-q-title">${escapeHtml(item.q)}</h3>
        </div>
        <button class="iq-toggle-btn" type="button" aria-expanded="false">
          <span class="btn-text">👁️ Show Answer</span>
        </button>
      </div>
      <div class="iq-body">
        <div class="iq-ans">
          <b style="display:block;margin-bottom:6px;color:#FF6B3D">💡 Spoken Model Answer:</b>
          <p>${escapeHtml(item.answer)}</p>
        </div>
        ${codeBlock}
        ${trapBlock}
        <div class="iq-footer">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:700">
            <input type="checkbox" class="iq-master-chk" data-qid="${qId}" onchange="toggleMastered('${qId}', this.checked)">
            <span>Mark as Mastered</span>
          </label>
          <span style="color:#78718C">Verbal Practice Question</span>
        </div>
      </div>
    </div>`;
  }).join('\n');

  return `
<section id="interview" style="padding:40px 0 60px">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">Boss Dialogue · Technical & HR Rounds</div>
      <h2>Interview Question & Answer Bank</h2>
      <p class="sub">80 verified questions with comprehensive model answers, code snippets, and traps asked by Kerala & Indian tech panels. Practice answering out loud before revealing the answers.</p>
    </div>

    <!-- Controls & Filters -->
    <div class="iq-controls">
      <div class="iq-filters">
        <button class="iq-filter-btn active" data-filter="all">All (${INTERVIEW_BANK.length})</button>
        <button class="iq-filter-btn" data-filter="javascript">⚡ JavaScript (15)</button>
        <button class="iq-filter-btn" data-filter="react">🔥 React &amp; TS (15)</button>
        <button class="iq-filter-btn" data-filter="node">🏰 Node &amp; APIs (15)</button>
        <button class="iq-filter-btn" data-filter="database">🗄️ SQL &amp; Mongo (12)</button>
        <button class="iq-filter-btn" data-filter="architecture">🏗️ System Design (8)</button>
        <button class="iq-filter-btn" data-filter="hr">🤝 HR &amp; STAR (15)</button>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;width:100%;margin-top:8px">
        <input type="text" id="iqSearch" class="iq-search-input" placeholder="Filter questions by keyword (e.g. closure, ACID, STAR, JWT)...">
        <button class="tool-btn" id="iqExpandAll" type="button" style="margin-left:auto">👁️ Expand All</button>
        <button class="tool-btn" id="iqCollapseAll" type="button">🔒 Self-Test Mode (Hide All)</button>
        <span class="chip" id="iqMasteredCount" style="font-weight:800;background:var(--pcs);color:var(--pc);border:0">0 / ${INTERVIEW_BANK.length} Mastered</span>
      </div>
    </div>

    <!-- Cards Container -->
    <div class="iq-list" id="iqList">
      ${cardsHtml}
    </div>
  </div>
</section>`;
}

function buildSharedScript(isRoadmapPage, isJobsPage, isInterviewsPage = false) {
  return `
<script>
(function(){
  var KEY = 'fs-kerala-progress-v1';
  var THEME_KEY = 'fs-theme';
  var ALL_IDS = ${JSON.stringify(checkpointIds)};
  var TOTAL = ALL_IDS.length;
  var SEARCH_DATA = ${JSON.stringify(searchIndex)};
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { state = {}; }

  function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }

  // 1. Dark Mode Toggle
  var themeBtn = document.getElementById('themeToggle');
  function applyTheme(t){
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeBtn) themeBtn.textContent = '☀️';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeBtn) themeBtn.textContent = '🌙';
    }
  }
  var savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function(){
      var isDark = document.documentElement.classList.contains('dark');
      var newTheme = isDark ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme(newTheme);
    });
  }

  // 2. Overall Progress Updates
  function updateOverall(){
    var done = 0;
    ALL_IDS.forEach(function(id){ if (state[id]) done++; });
    var pct = TOTAL ? Math.round(done * 100 / TOTAL) : 0;

    var big = document.getElementById('pct-big');
    if (big) big.textContent = pct + '%';
    var cnt = document.getElementById('pct-count');
    if (cnt) cnt.textContent = done + ' / ' + TOTAL + ' checkpoints';
    var fill = document.getElementById('overall-fill');
    if (fill) fill.style.width = pct + '%';
    var mini = document.getElementById('nav-fill');
    if (mini) mini.style.width = pct + '%';
    var nl = document.getElementById('nav-pct-label');
    if (nl) nl.textContent = pct + '%';
  }

  // 3. Roadmap Checkbox Handlers & Toolbar
  ${isRoadmapPage ? `
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.chk input'));

  Array.prototype.forEach.call(document.querySelectorAll('.chk'), function(lab){
    lab.addEventListener('mousedown', function(e){
      if (e.target.tagName !== 'INPUT') e.preventDefault();
    });
  });

  function keepScroll(y){
    var restore = function(){
      if (Math.abs(window.scrollY - y) > 2) {
        var de = document.documentElement;
        var prev = de.style.scrollBehavior;
        de.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        de.style.scrollBehavior = prev;
      }
    };
    restore();
    requestAnimationFrame(restore);
    setTimeout(restore, 60);
  }

  boxes.forEach(function(b){
    if (state[b.id]) b.checked = true;
    b.addEventListener('change', function(){
      var y = window.scrollY;
      state[b.id] = b.checked;
      save();
      updatePhases();
      updateOverall();
      keepScroll(y);
    });
  });

  function updatePhases(){
    document.querySelectorAll('.phase').forEach(function(card){
      var inp = card.querySelectorAll('.chk input');
      var on = 0;
      inp.forEach(function(i){ if (i.checked) on++; });
      var p = inp.length ? Math.round(on * 100 / inp.length) : 0;
      var fillEl = card.querySelector('.bar > i');
      if (fillEl) fillEl.style.width = p + '%';
      var label = card.querySelector('.chip.pct');
      if (label) label.textContent = p + '%';
      card.classList.toggle('done', p === 100);
    });
  }

  updatePhases();

  // Reset progress
  var reset = document.getElementById('reset');
  if (reset) reset.addEventListener('click', function(){
    if (!confirm('Reset all checkpoints? Your notes in the Excel tracker are safe.')) return;
    state = {}; save();
    boxes.forEach(function(b){ b.checked = false; });
    updatePhases();
    updateOverall();
  });

  // Hide completed
  var hide = document.getElementById('hide-done');
  if (hide) hide.addEventListener('click', function(){
    document.body.classList.toggle('hide-done');
    hide.textContent = document.body.classList.contains('hide-done') ? 'Show completed' : 'Hide completed';
  });

  // Collapse all
  var toggle = document.getElementById('collapse-all');
  if (toggle) toggle.addEventListener('click', function(){
    var collapsed = document.body.classList.toggle('compact');
    document.querySelectorAll('.phase').forEach(function(c){
      c.querySelector('.checks').style.display = collapsed ? 'none' : '';
      c.querySelector('.watch').style.display = collapsed ? 'none' : '';
    });
    toggle.textContent = collapsed ? 'Expand all checklists' : 'Collapse all checklists';
  });

  // Print PDF
  var printBtn = document.getElementById('print');
  if (printBtn) printBtn.addEventListener('click', function(){ try { window.print(); } catch(e){} });

  // JSON Export Backup
  var exportBtn = document.getElementById('export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', function(){
      var doneCount = 0;
      ALL_IDS.forEach(function(id){ if (state[id]) doneCount++; });
      var backupData = {
        app: "Operation Full Stack — Kerala Edition",
        version: "1.0",
        timestamp: new Date().toISOString(),
        totalCheckpoints: TOTAL,
        completedCount: doneCount,
        progressPercent: TOTAL ? Math.round(doneCount * 100 / TOTAL) : 0,
        checkpoints: state
      };
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      var a = document.createElement('a');
      a.href = dataStr;
      a.download = "operation-fullstack-progress-backup.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // JSON Import Restore
  var importBtn = document.getElementById('import-json-btn');
  var importInput = document.getElementById('import-json-input');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', function(){ importInput.click(); });
    importInput.addEventListener('change', function(e){
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(evt){
        try {
          var imported = JSON.parse(evt.target.result);
          if (imported && imported.checkpoints) {
            state = imported.checkpoints;
            save();
            boxes.forEach(function(b){ b.checked = !!state[b.id]; });
            updatePhases();
            updateOverall();
            alert('✓ Progress successfully restored: ' + (imported.completedCount || 0) + ' / ' + TOTAL + ' checkpoints!');
          } else {
            alert('Invalid backup file format.');
          }
        } catch(err){
          alert('Could not parse backup file: ' + err.message);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }
  ` : ''}

  // 4. Jobs Referral Copy Handler
  ${isJobsPage ? `
  var copyBtn = document.getElementById('copy-referral');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(){
      var tmpl = document.querySelector('.tmpl');
      if (tmpl) {
        navigator.clipboard.writeText(tmpl.innerText.trim()).then(function(){
          copyBtn.textContent = '✓ Copied to clipboard!';
          copyBtn.classList.add('copied');
          setTimeout(function(){
            copyBtn.textContent = '📋 Copy Referral Message';
            copyBtn.classList.remove('copied');
          }, 2500);
        });
      }
    });
  }
  ` : ''}

  // 5. Interview Q&A Interactive Handlers
  ${isInterviewsPage ? `
  var TOTAL_QUESTIONS = ${INTERVIEW_BANK.length};
  var MASTERED_KEY = 'fs-mastered-interviews';
  var masteredState = {};
  try { masteredState = JSON.parse(localStorage.getItem(MASTERED_KEY)) || {}; } catch(e){}

  window.toggleIqAnswer = function(qId) {
    var card = document.getElementById(qId);
    if (!card) return;
    var body = card.querySelector('.iq-body');
    var btnText = card.querySelector('.btn-text');
    var isOpen = body.classList.toggle('open');
    if (btnText) btnText.textContent = isOpen ? '✕ Hide Answer' : '👁️ Show Answer';
  };

  window.toggleMastered = function(qId, isMastered) {
    var card = document.getElementById(qId);
    if (card) card.classList.toggle('mastered', isMastered);
    masteredState[qId] = isMastered;
    try { localStorage.setItem(MASTERED_KEY, JSON.stringify(masteredState)); } catch(e){}
    updateMasteredCounter();
  };

  function updateMasteredCounter() {
    var count = 0;
    Object.keys(masteredState).forEach(function(k){ if (masteredState[k]) count++; });
    var el = document.getElementById('iqMasteredCount');
    if (el) el.textContent = count + ' / ' + TOTAL_QUESTIONS + ' Mastered';
  }

  // Restore mastered checkmarks on load
  document.querySelectorAll('.iq-master-chk').forEach(function(chk){
    var qId = chk.dataset.qid;
    if (masteredState[qId]) {
      chk.checked = true;
      var card = document.getElementById(qId);
      if (card) card.classList.add('mastered');
    }
  });
  updateMasteredCounter();

  // Filter Buttons
  var filterBtns = document.querySelectorAll('.iq-filter-btn');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilters();
    });
  });

  // Keyword Search Filter
  var iqSearchInput = document.getElementById('iqSearch');
  if (iqSearchInput) {
    iqSearchInput.addEventListener('input', applyFilters);
  }

  function applyFilters(){
    var activeFilter = (document.querySelector('.iq-filter-btn.active') || {}).dataset.filter || 'all';
    var q = ((iqSearchInput && iqSearchInput.value) || '').trim().toLowerCase();
    document.querySelectorAll('.iq-card').forEach(function(card){
      var cat = card.dataset.cat;
      var matchesCat = (activeFilter === 'all' || cat === activeFilter);
      var text = card.textContent.toLowerCase();
      var matchesSearch = (!q || text.indexOf(q) !== -1);
      card.style.display = (matchesCat && matchesSearch) ? '' : 'none';
    });
  }

  // Expand All / Collapse All
  var expandAllBtn = document.getElementById('iqExpandAll');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', function(){
      document.querySelectorAll('.iq-body').forEach(function(b){ b.classList.add('open'); });
      document.querySelectorAll('.iq-toggle-btn .btn-text').forEach(function(t){ t.textContent = '✕ Hide Answer'; });
    });
  }

  var collapseAllBtn = document.getElementById('iqCollapseAll');
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', function(){
      document.querySelectorAll('.iq-body').forEach(function(b){ b.classList.remove('open'); });
      document.querySelectorAll('.iq-toggle-btn .btn-text').forEach(function(t){ t.textContent = '👁️ Show Answer'; });
    });
  }
  ` : ''}

  // 6. Search Modal & Command Palette
  var searchBackdrop = document.getElementById('searchBackdrop');
  var searchTrigger = document.getElementById('searchTrigger');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');

  function openSearch(){
    if (!searchBackdrop) return;
    searchBackdrop.classList.add('open');
    if (searchInput) {
      searchInput.value = '';
      renderSearchResults('');
      setTimeout(function(){ searchInput.focus(); }, 50);
    }
  }

  function closeSearch(){
    if (searchBackdrop) searchBackdrop.classList.remove('open');
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', function(e){
      if (e.target === searchBackdrop) closeSearch();
    });
  }

  window.addEventListener('keydown', function(e){
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchBackdrop && searchBackdrop.classList.contains('open')) closeSearch(); else openSearch();
    } else if (e.key === 'Escape') {
      closeSearch();
      var timerPopup = document.getElementById('timerPopup');
      if (timerPopup) timerPopup.classList.remove('open');
    }
  });

  function renderSearchResults(q){
    if (!searchResults) return;
    q = (q || '').trim().toLowerCase();
    var filtered = [];
    if (!q) {
      filtered = SEARCH_DATA.slice(0, 12);
    } else {
      filtered = SEARCH_DATA.filter(function(item){
        return item.title.toLowerCase().indexOf(q) !== -1 ||
               item.sub.toLowerCase().indexOf(q) !== -1 ||
               item.cat.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 30);
    }

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div style="padding:28px;text-align:center;color:#78718C">No matches found for "' + q + '". Try searching for "React", "Docker", "Git", "JWT", or "Infopark".</div>';
      return;
    }

    searchResults.innerHTML = filtered.map(function(item, idx){
      return '<a class="search-item' + (idx === 0 ? ' selected' : '') + '" href="' + item.url + '">' +
        '<div class="search-item-top">' +
          '<b>' + item.title + '</b>' +
          '<span class="search-badge">' + item.badge + '</span>' +
        '</div>' +
        '<span>' + item.sub + '</span>' +
      '</a>';
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', function(e){
      renderSearchResults(e.target.value);
    });

    searchInput.addEventListener('keydown', function(e){
      var items = searchResults.querySelectorAll('.search-item');
      var currIndex = -1;
      items.forEach(function(el, i){ if (el.classList.contains('selected')) currIndex = i; });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = (currIndex + 1) % items.length;
        items.forEach(function(el){ el.classList.remove('selected'); });
        if (items[next]) {
          items[next].classList.add('selected');
          items[next].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = (currIndex - 1 + items.length) % items.length;
        items.forEach(function(el){ el.classList.remove('selected'); });
        if (items[prev]) {
          items[prev].classList.add('selected');
          items[prev].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currIndex >= 0 && items[currIndex]) {
          items[currIndex].click();
        }
      }
    });
  }

  // 7. Pomodoro Study Timer
  var timerToggleBtn = document.getElementById('timerToggleBtn');
  var timerPopup = document.getElementById('timerPopup');
  var timerCloseBtn = document.getElementById('timerCloseBtn');
  var timerDigits = document.getElementById('timerDigits');
  var timerBadge = document.getElementById('timerBadge');
  var timerStartBtn = document.getElementById('timerStartBtn');
  var timerResetBtn = document.getElementById('timerResetBtn');
  var timerModeBtns = document.querySelectorAll('.timer-mode-btn');

  var timerDuration = 1500;
  var timerRemaining = 1500;
  var timerInterval = null;
  var isRunning = false;

  function formatTime(s){
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updateTimerDisplay(){
    var str = formatTime(timerRemaining);
    if (timerDigits) timerDigits.textContent = str;
    if (timerBadge) timerBadge.textContent = str;
  }

  function playChime(){
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch(err){}
  }

  if (timerToggleBtn && timerPopup) {
    timerToggleBtn.addEventListener('click', function(){
      timerPopup.classList.toggle('open');
    });
    if (timerCloseBtn) {
      timerCloseBtn.addEventListener('click', function(){
        timerPopup.classList.remove('open');
      });
    }

    timerModeBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        timerModeBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        timerDuration = parseInt(btn.dataset.time, 10);
        timerRemaining = timerDuration;
        clearInterval(timerInterval);
        isRunning = false;
        if (timerStartBtn) {
          timerStartBtn.textContent = '▶ Start';
          timerStartBtn.className = 'timer-ctrl-btn timer-start';
        }
        updateTimerDisplay();
      });
    });

    if (timerStartBtn) {
      timerStartBtn.addEventListener('click', function(){
        if (!isRunning) {
          isRunning = true;
          timerStartBtn.textContent = '⏸ Pause';
          timerStartBtn.className = 'timer-ctrl-btn timer-pause';
          timerInterval = setInterval(function(){
            if (timerRemaining > 0) {
              timerRemaining--;
              updateTimerDisplay();
            } else {
              clearInterval(timerInterval);
              isRunning = false;
              playChime();
              alert('🎉 Focus block finished! Take a break or start your next sprint.');
              timerRemaining = timerDuration;
              updateTimerDisplay();
              timerStartBtn.textContent = '▶ Start';
              timerStartBtn.className = 'timer-ctrl-btn timer-start';
            }
          }, 1000);
        } else {
          isRunning = false;
          clearInterval(timerInterval);
          timerStartBtn.textContent = '▶ Resume';
          timerStartBtn.className = 'timer-ctrl-btn timer-start';
        }
      });
    }

    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', function(){
        clearInterval(timerInterval);
        isRunning = false;
        timerRemaining = timerDuration;
        if (timerStartBtn) {
          timerStartBtn.textContent = '▶ Start';
          timerStartBtn.className = 'timer-ctrl-btn timer-start';
        }
        updateTimerDisplay();
      });
    }
  }

  updateOverall();

  // Storage sync across tabs
  window.addEventListener('storage', function(e){
    if (e.key === KEY) {
      try { state = JSON.parse(e.newValue) || {}; } catch(err){}
      ${isRoadmapPage ? `
      boxes.forEach(function(b){ b.checked = !!state[b.id]; });
      updatePhases();
      ` : ''}
      updateOverall();
    } else if (e.key === THEME_KEY) {
      applyTheme(e.newValue || 'light');
    }
  });

  // Back to top
  var top = document.getElementById('toTop');
  window.addEventListener('scroll', function(){
    if (!top) return;
    if (window.scrollY > 600) top.classList.add('show'); else top.classList.remove('show');
  }, {passive:true});
  if (top) top.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
})();
</script>`;
}

function wrapPage(title, description, activeKey, contentHtml, isRoadmap = false, isJobs = false, isInterviews = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title} · Operation Full Stack</title>
<meta name="description" content="${description}">
<!-- Instant Theme Guard to avoid FOUT -->
<script>
(function(){
  var t = localStorage.getItem('fs-theme');
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
</script>
<style>${COMBINED_CSS}</style>
</head>
<body>
<a class="skip" href="#main-content">Skip to content</a>
${buildNav(activeKey)}
<main id="main-content">
${contentHtml}
</main>
${buildPomodoroWidget()}
${buildSearchModal()}
${buildFooter()}
${buildSharedScript(isRoadmap, isJobs, isInterviews)}
</body>
</html>`;
}

// -------------------------------------------------------------
// PAGE 1: index.html (Overview / Home)
// -------------------------------------------------------------
let heroSec = sections['hero'];
heroSec = heroSec.replace('href="#roadmap"', 'href="roadmap.html"');

const overviewDirectoryHtml = `
<section id="directory" style="padding: 40px 0 20px;">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">Curriculum Hub</div>
      <h2>Explore the 8 Pillars of Operation Full Stack</h2>
      <p class="sub">The roadmap is organized into focused, dedicated pages so you can study, reference, and execute without losing your place.</p>
    </div>
    <div class="hub-grid">
      <a class="hub-card" href="market.html">
        <div class="hub-card-head">
          <div class="hub-icon">📊</div>
          <h3>Market Intel</h3>
        </div>
        <p>Current hiring data, Infopark vs Technopark benchmarks, fresher salary bands, and tool priority matrices for 2026.</p>
        <span class="hub-link">Explore Market Intel →</span>
      </a>

      <a class="hub-card" href="roadmap.html">
        <div class="hub-card-head">
          <div class="hub-icon">🗺️</div>
          <h3>32-Week Roadmap</h3>
        </div>
        <p>Nine seasons, 148 interactive checkpoints, verified YouTube courses, boss projects, and offline progress tracking.</p>
        <span class="hub-link">Open Full Roadmap →</span>
      </a>

      <a class="hub-card" href="schedule.html">
        <div class="hub-card-head">
          <div class="hub-icon">⏰</div>
          <h3>Study Schedule</h3>
        </div>
        <p>The daily 6-hour timetable designed around an internship, weekly rhythms, 5 arc laws, and milestone save-points.</p>
        <span class="hub-link">View Timetable →</span>
      </a>

      <a class="hub-card" href="projects.html">
        <div class="hub-card-head">
          <div class="hub-icon">🚀</div>
          <h3>Project Ladder</h3>
        </div>
        <p>Five tiered projects from vanilla JS to the SkillBridge Capstone (Docker + CI/CD) and Kerala IT Job Market Analyser.</p>
        <span class="hub-link">View Project Ladder →</span>
      </a>

      <a class="hub-card" href="jobs.html">
        <div class="hub-card-head">
          <div class="hub-icon">💼</div>
          <h3>Job Hunt Playbook</h3>
        </div>
        <p>Infopark & Technopark hiring routes, 14 target companies, 300-application maths, and copyable referral scripts.</p>
        <span class="hub-link">Open Playbook →</span>
      </a>

      <a class="hub-card" href="interviews.html">
        <div class="hub-card-head">
          <div class="hub-icon">🎯</div>
          <h3>Interview Bank</h3>
        </div>
        <p>80 verified questions with comprehensive model answers, code examples, and interviewer traps across 6 categories.</p>
        <span class="hub-link">Practice 80 Questions →</span>
      </a>

      <a class="hub-card" href="cheats.html">
        <div class="hub-card-head">
          <div class="hub-icon">⚡</div>
          <h3>Cheat Sheets</h3>
        </div>
        <p>15 VS Code shortcuts, daily Git commands, essential JS array methods, and links to verified official PDF sheets.</p>
        <span class="hub-link">Access Cheat Sheets →</span>
      </a>

      <a class="hub-card" href="review.html">
        <div class="hub-card-head">
          <div class="hub-icon">🛡️</div>
          <h3>Peer Review</h3>
        </div>
        <p>Hostile red-team pass identifying 7 fatal failure points with built-in mitigations, plus complete verified citations.</p>
        <span class="hub-link">Read Peer Review →</span>
      </a>
    </div>

    <div class="next-step-bar" style="margin-top: 40px;">
      <div class="ns-info">
        <span class="ns-label">Ready to start?</span>
        <h4>Step 1: Check what the Indian market is paying for</h4>
        <p>Review the 2026 hiring intel before diving into the code.</p>
      </div>
      <div class="ns-actions">
        <a href="market.html" class="btn btn-primary">Go to Market Intel →</a>
      </div>
    </div>
  </div>
</section>
`;

const indexHtmlContent = heroSec + '\n' + sections['ribbon'] + '\n' + overviewDirectoryHtml + '\n' + sections['motivation'];

const indexPage = wrapPage(
  'Operation Full Stack · Kerala Edition',
  'A 32-week, research-backed roadmap from intern to full-stack developer for the Kerala and South India job market. Multi-page edition.',
  'overview',
  indexHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'index.html'), indexPage, 'utf8');
console.log('✓ Wrote index.html');

// -------------------------------------------------------------
// PAGE 2: market.html (Market Intel)
// -------------------------------------------------------------
const marketNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Season 1 to 9: The 32-Week Roadmap</h4>
      <p>Nine seasons, 148 checkpoints, verified YouTube courses and project bosses.</p>
    </div>
    <div class="ns-actions">
      <a href="index.html" class="btn btn-ghost">← Overview</a>
      <a href="roadmap.html" class="btn btn-primary">Start Roadmap →</a>
    </div>
  </div>
</div>`;
const marketHtmlContent = sections['market'] + '\n' + marketNextBar;
const marketPage = wrapPage(
  'Market Intel 2026 · What Indian Employers Pay For',
  'Market intelligence, salaries, tech hiring demand, and tool relevance for full-stack developers in Kerala and India.',
  'market',
  marketHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'market.html'), marketPage, 'utf8');
console.log('✓ Wrote market.html');

// -------------------------------------------------------------
// PAGE 3: roadmap.html (Roadmap)
// -------------------------------------------------------------
let roadmapSec = sections['roadmap'];
roadmapSec = roadmapSec.replace(
  '<span class="spacer"></span>',
  '<button class="tool-btn" id="export-json" type="button" title="Download backup of all checked progress">📥 Backup (JSON)</button>\n        <button class="tool-btn" id="import-json-btn" type="button" title="Restore progress from JSON backup">📤 Restore</button>\n        <input type="file" id="import-json-input" accept=".json" style="display:none">\n        <span class="spacer"></span>'
);

const roadmapNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Daily Operating System & Timetable</h4>
      <p>Your 6-hour study day timetable, weekly breakdown, and the 5 laws of this training arc.</p>
    </div>
    <div class="ns-actions">
      <a href="market.html" class="btn btn-ghost">← Market Intel</a>
      <a href="schedule.html" class="btn btn-primary">View Schedule →</a>
    </div>
  </div>
</div>`;
const roadmapHtmlContent = roadmapSec + '\n' + roadmapNextBar;
const roadmapPage = wrapPage(
  '32-Week Full Stack Roadmap · Kerala Edition',
  'Nine seasons, 148 checkpoints, verified YouTube courses, projects, schedule, and interactive progress tracking.',
  'roadmap',
  roadmapHtmlContent,
  true // isRoadmap
);
fs.writeFileSync(path.join(baseDir, 'roadmap.html'), roadmapPage, 'utf8');
console.log('✓ Wrote roadmap.html');

// -------------------------------------------------------------
// PAGE 4: schedule.html (Schedule)
// -------------------------------------------------------------
const scheduleNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Boss Rush: The Project Ladder</h4>
      <p>Five projects from vanilla JS to the SkillBridge Capstone (Docker + CI/CD).</p>
    </div>
    <div class="ns-actions">
      <a href="roadmap.html" class="btn btn-ghost">← Roadmap</a>
      <a href="projects.html" class="btn btn-primary">View Projects →</a>
    </div>
  </div>
</div>`;
const scheduleHtmlContent = sections['schedule'] + '\n' + scheduleNextBar;
const schedulePage = wrapPage(
  'Daily Schedule & Study Operating System',
  'Your 6-hour daily study routine, weekly rhythm, 5 training arc laws, and milestone save-points.',
  'schedule',
  scheduleHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'schedule.html'), schedulePage, 'utf8');
console.log('✓ Wrote schedule.html');

// -------------------------------------------------------------
// PAGE 5: projects.html (Projects)
// -------------------------------------------------------------
const projectsNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>The Kerala Job-Hunt Playbook</h4>
      <p>Where openings live, 14 target companies, 300 applications maths, and cold referral scripts.</p>
    </div>
    <div class="ns-actions">
      <a href="schedule.html" class="btn btn-ghost">← Schedule</a>
      <a href="jobs.html" class="btn btn-primary">Job Playbook →</a>
    </div>
  </div>
</div>`;
const projectsHtmlContent = sections['projects'] + '\n' + projectsNextBar;
const projectsPage = wrapPage(
  'Project Ladder & Portfolio Bosses',
  'Five tiered full-stack projects to prove your engineering ability and ace technical interviews.',
  'projects',
  projectsHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'projects.html'), projectsPage, 'utf8');
console.log('✓ Wrote projects.html');

// -------------------------------------------------------------
// PAGE 6: jobs.html (Job Hunt)
// -------------------------------------------------------------
let jobsSec = sections['jobs'];
jobsSec = jobsSec.replace(
  'Thanks either way!</div>',
  'Thanks either way!</div>\n          <button class="copy-btn" id="copy-referral" type="button">📋 Copy Referral Message</button>'
);

const jobsNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Interview Question Bank (80 Q&amp;As)</h4>
      <p>80 actual technical and behavioural questions with complete model answers asked by Indian fresher hiring panels.</p>
    </div>
    <div class="ns-actions">
      <a href="projects.html" class="btn btn-ghost">← Projects</a>
      <a href="interviews.html" class="btn btn-primary">Practice Interviews →</a>
    </div>
  </div>
</div>`;
const jobsHtmlContent = jobsSec + '\n' + jobsNextBar;
const jobsPage = wrapPage(
  'Kerala Job-Hunt Playbook & Referral Strategy',
  'Infopark, Technopark, Cyberpark job boards, 14 company target list, referral messages, and application maths.',
  'jobs',
  jobsHtmlContent,
  false,
  true // isJobs
);
fs.writeFileSync(path.join(baseDir, 'jobs.html'), jobsPage, 'utf8');
console.log('✓ Wrote jobs.html');

// -------------------------------------------------------------
// PAGE 7: interviews.html (Interviews with 80 Model Answers)
// -------------------------------------------------------------
const interviewsNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Power-ups: Shortcuts & Cheat Sheets</h4>
      <p>VS Code shortcuts, daily Git commands, essential JS array methods, and PDF cheat sheets.</p>
    </div>
    <div class="ns-actions">
      <a href="jobs.html" class="btn btn-ghost">← Job Playbook</a>
      <a href="cheats.html" class="btn btn-primary">Get Cheat Sheets →</a>
    </div>
  </div>
</div>`;
const interviewsHtmlContent = buildInterviewSection() + '\n' + interviewsNextBar;
const interviewsPage = wrapPage(
  'Interview Question & Answer Bank · 80 Questions with Model Answers',
  '80 curated technical & HR questions with spoken model answers, code examples, and interviewer traps across JavaScript, React, Node, SQL, and Architecture.',
  'interviews',
  interviewsHtmlContent,
  false,
  false,
  true // isInterviews
);
fs.writeFileSync(path.join(baseDir, 'interviews.html'), interviewsPage, 'utf8');
console.log('✓ Wrote interviews.html');

// -------------------------------------------------------------
// PAGE 8: cheats.html (Cheat sheets)
// -------------------------------------------------------------
const cheatsNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Next Arc Step</span>
      <h4>Peer Review & Verification Sources</h4>
      <p>The hostile red-team analysis and full research citations behind this 32-week plan.</p>
    </div>
    <div class="ns-actions">
      <a href="interviews.html" class="btn btn-ghost">← Interviews</a>
      <a href="review.html" class="btn btn-primary">Read Review →</a>
    </div>
  </div>
</div>`;
const cheatsHtmlContent = sections['cheats'] + '\n' + cheatsNextBar;
const cheatsPage = wrapPage(
  'Shortcuts, Commands & PDF Cheat Sheets',
  'Essential VS Code shortcuts, daily Git commands, JS array methods, and official verified PDF cheat sheets.',
  'cheats',
  cheatsHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'cheats.html'), cheatsPage, 'utf8');
console.log('✓ Wrote cheats.html');

// -------------------------------------------------------------
// PAGE 9: review.html (Review & Sources)
// -------------------------------------------------------------
const reviewNextBar = `
<div class="wrap">
  <div class="next-step-bar">
    <div class="ns-info">
      <span class="ns-label">Arc Completed</span>
      <h4>Ready to begin Season 1?</h4>
      <p>Return to the Overview or jump straight into Week 1 in the Roadmap.</p>
    </div>
    <div class="ns-actions">
      <a href="index.html" class="btn btn-ghost">← Overview</a>
      <a href="roadmap.html" class="btn btn-primary">Start Season 1 →</a>
    </div>
  </div>
</div>`;
const reviewHtmlContent = sections['review'] + '\n' + sections['sources'] + '\n' + reviewNextBar;
const reviewPage = wrapPage(
  'Peer Review & Research Sources',
  'Hostile red-team pass identifying 7 critical failure modes, mitigations, and salary data citations.',
  'review',
  reviewHtmlContent
);
fs.writeFileSync(path.join(baseDir, 'review.html'), reviewPage, 'utf8');
console.log('✓ Wrote review.html');

console.log('All 9 pages updated with 80 interview questions & model answers!');
