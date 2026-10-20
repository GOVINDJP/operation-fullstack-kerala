const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'generate_multipage.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Inject Solo Leveling CSS into customUxCss
const cssAnchor = '@media (min-width: 1600px) {';
const soloCss = `
/* ---------- SOLO LEVELING HUNTER RANK STYLING ---------- */
.hunter-status-panel {
  position: relative;
  background: linear-gradient(135deg, rgba(16, 18, 32, 0.96), rgba(26, 20, 48, 0.96)) !important;
  border: 1.5px solid rgba(0, 229, 255, 0.35) !important;
  border-radius: 20px !important;
  padding: 20px 22px !important;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35), 0 0 25px rgba(0, 229, 255, 0.12) !important;
  color: #EDE8F5 !important;
  overflow: hidden;
}

.hunter-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  flex-wrap: wrap;
}

.hunter-sys-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .74rem;
  font-weight: 900;
  letter-spacing: .14em;
  color: #00F0FF;
}

.hunter-sys-tag .sys-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00F0FF;
  box-shadow: 0 0 8px #00F0FF;
  animation: pulse-sys 2s infinite;
}

@keyframes pulse-sys {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.hunter-current-title {
  font-size: .86rem;
  font-weight: 800;
  color: #E2DBEE;
}

.hunter-panel-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

@media (max-width: 580px) {
  .hunter-panel-main {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
}

.hunter-rank-badge-box {
  width: 86px;
  height: 86px;
  flex: 0 0 86px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all .3s ease;
}

@media (max-width: 580px) {
  .hunter-rank-badge-box {
    width: 100%;
    height: 64px;
    flex-direction: row;
    gap: 12px;
  }
}

.hunter-rank-badge-box .hrb-label {
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .18em;
  opacity: .8;
}

.hunter-rank-badge-box .hrb-letter {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
}

.hunter-rank-badge-box .hrb-name {
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .08em;
  margin-top: 2px;
}

/* Rank Themes */
.rank-e {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.25), rgba(71, 85, 105, 0.4)) !important;
  border: 2px solid #64748B !important;
  color: #CBD5E1 !important;
  box-shadow: 0 0 16px rgba(100, 116, 139, 0.3) !important;
}

.rank-d {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(180, 83, 9, 0.4)) !important;
  border: 2px solid #F59E0B !important;
  color: #FDE68A !important;
  box-shadow: 0 0 18px rgba(245, 158, 11, 0.35) !important;
}

.rank-c {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 116, 144, 0.4)) !important;
  border: 2px solid #06B6D4 !important;
  color: #A5F3FC !important;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4) !important;
}

.rank-b {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(29, 78, 216, 0.4)) !important;
  border: 2px solid #3B82F6 !important;
  color: #BFDBFE !important;
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.45) !important;
}

.rank-a {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(109, 40, 217, 0.4)) !important;
  border: 2px solid #A855F7 !important;
  color: #E9D5FF !important;
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.5) !important;
}

.rank-s {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(202, 138, 4, 0.5)) !important;
  border: 2px solid #FFD700 !important;
  color: #FEF08A !important;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6) !important;
}

.rank-monarch {
  background: linear-gradient(135deg, #00F0FF, #7C5CFF, #FF3366) !important;
  border: 2px solid #FFF !important;
  color: #FFF !important;
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.8), 0 0 60px rgba(124, 92, 255, 0.5) !important;
  animation: monarch-pulse 2s infinite ease-in-out !important;
}

@keyframes monarch-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.04); filter: brightness(1.2); }
}

.hunter-panel-stats {
  flex: 1;
  min-width: 0;
}

.hunter-meta-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hunter-level-badge {
  font-size: .75rem;
  font-weight: 900;
  letter-spacing: .08em;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: #00F0FF;
}

.cyber-bar {
  position: relative;
  height: 14px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(0, 229, 255, 0.25);
  border-radius: 99px;
  overflow: hidden;
  margin-top: 10px;
}

.cyber-bar > i {
  background: linear-gradient(90deg, #00F0FF, #7C5CFF, #FF3366) !important;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
}

.hunter-panel-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.hunter-next-rank {
  font-size: .78rem;
  font-weight: 800;
  color: #FDE047;
}

.hunter-status-sub {
  font-size: .76rem;
  color: #94A3B8;
  font-style: italic;
  max-width: 65ch;
}

/* Nav Rank Pill */
.nav-rank-badge {
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .08em;
  padding: 3px 7px;
  border-radius: 6px;
  margin-right: 4px;
  text-transform: uppercase;
}
`;

if (!code.includes('.hunter-status-panel')) {
  code = code.replace(cssAnchor, soloCss + '\n' + cssAnchor);
}

// 2. Add nav-rank-badge into buildNav()
const oldNavProgress = `<div class="nav-progress" aria-hidden="true" title="Your overall roadmap progress">
        <span id="nav-pct-label">0%</span>
        <span class="mini"><i id="nav-fill"></i></span>
      </div>`;
const newNavProgress = `<div class="nav-progress" aria-hidden="true" title="Solo Leveling Hunter Rank &amp; Progress">
        <span class="nav-rank-badge rank-e" id="nav-rank-badge">E-RANK</span>
        <span id="nav-pct-label">0%</span>
        <span class="mini"><i id="nav-fill"></i></span>
      </div>`;
code = code.replace(oldNavProgress, newNavProgress);

// 3. Update buildSharedScript() with getHunterRank and updateOverall
const oldUpdateOverall = `  // 2. Overall Progress Updates
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
  }`;

const newUpdateOverall = `  // 2. Solo Leveling Hunter Rank Calculation
  function getHunterRank(pct) {
    if (pct >= 100) {
      return {
        rank: 'S',
        class: 'rank-s rank-monarch',
        name: 'S-RANK',
        title: '👑 S-Rank Shadow Monarch · "ARISE"',
        level: 'LV. 100',
        next: 'MAX RANK REACHED 👑',
        lore: 'ALL 148 CHECKPOINTS COMPLETED! You have awakened as the S-Rank Shadow Monarch!'
      };
    } else if (pct >= 80) {
      return {
        rank: 'A',
        class: 'rank-a',
        name: 'A-RANK',
        title: '🔮 A-Rank Guild Master Class',
        level: 'LV. ' + Math.max(1, pct),
        next: '🎯 S-Rank at 100%',
        lore: 'Approaching National Level! Final stretch to S-Rank.'
      };
    } else if (pct >= 60) {
      return {
        rank: 'B',
        class: 'rank-b',
        name: 'B-RANK',
        title: '⚔️ B-Rank Elite Raid Leader',
        level: 'LV. ' + Math.max(1, pct),
        next: '🎯 A-Rank at 80%',
        lore: 'Production architect online! High-rank dungeon specialist.'
      };
    } else if (pct >= 40) {
      return {
        rank: 'C',
        class: 'rank-c',
        name: 'C-RANK',
        title: '🛡️ C-Rank Dungeon Raider',
        level: 'LV. ' + Math.max(1, pct),
        next: '🎯 B-Rank at 60%',
        lore: 'Frontend & Backend mana circuits flowing. Building real systems.'
      };
    } else if (pct >= 20) {
      return {
        rank: 'D',
        class: 'rank-d',
        name: 'D-RANK',
        title: '🗡️ D-Rank Awakened Hunter',
        level: 'LV. ' + Math.max(1, pct),
        next: '🎯 C-Rank at 40%',
        lore: 'Awakened from novice to junior contender. Keep leveling up!'
      };
    } else {
      return {
        rank: 'E',
        class: 'rank-e',
        name: 'E-RANK',
        title: '🌱 E-Rank Weakest Hunter',
        level: 'LV. ' + Math.max(1, pct),
        next: '🎯 D-Rank at 20%',
        lore: 'The System has designated you as a Player. Complete checkpoints to level up to S-Rank.'
      };
    }
  }

  // Overall Progress & Solo Leveling Rank Updates
  function updateOverall(){
    var done = 0;
    ALL_IDS.forEach(function(id){ if (state[id]) done++; });
    var pct = TOTAL ? Math.round(done * 100 / TOTAL) : 0;
    var rank = getHunterRank(pct);

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

    // Solo Leveling Hunter updates
    var rl = document.getElementById('rankLetter');
    if (rl) rl.textContent = rank.rank;
    var rn = document.getElementById('rankName');
    if (rn) rn.textContent = rank.name;
    var ht = document.getElementById('hunterTitle');
    if (ht) ht.textContent = rank.title;
    var hl = document.getElementById('hunterLevel');
    if (hl) hl.textContent = rank.level;
    var nr = document.getElementById('nextRankText');
    if (nr) nr.textContent = rank.next;
    var lore = document.getElementById('hunterLore');
    if (lore) lore.textContent = '"' + rank.lore + '"';

    var rbb = document.getElementById('rankBadgeBox');
    if (rbb) {
      rbb.className = 'hunter-rank-badge-box ' + rank.class;
    }

    // Top navbar rank pill
    var nrb = document.getElementById('nav-rank-badge');
    if (nrb) {
      nrb.textContent = rank.name;
      nrb.className = 'nav-rank-badge ' + rank.class;
    }
  }`;

code = code.replace(oldUpdateOverall, newUpdateOverall);

// 4. In heroSec, replace the default panel with the Solo Leveling Hunter Status Panel
const oldPanelPattern = /<div class="panel" style="margin-top:24px">[\s\S]*?<\/div>\s*<\/div>/;

const newHunterPanel = `<div class="panel hunter-status-panel" style="margin-top:24px">
          <div class="hunter-panel-head">
            <div class="hunter-sys-tag">
              <span class="sys-dot"></span>
              <span class="font-mono">[ SYSTEM: LEARNING PROGRESS ]</span>
            </div>
            <div class="hunter-current-title" id="hunterTitle">🌱 E-Rank Weakest Hunter</div>
          </div>

          <div class="hunter-panel-main">
            <!-- Rank Crest Badge -->
            <div class="hunter-rank-badge-box rank-e" id="rankBadgeBox">
              <span class="hrb-label">RANK</span>
              <span class="hrb-letter" id="rankLetter">E</span>
              <span class="hrb-name" id="rankName">E-RANK</span>
            </div>

            <!-- Stats & Progress -->
            <div class="hunter-panel-stats">
              <div class="panel-top">
                <div class="big" id="pct-big">0%</div>
                <div class="hunter-meta-right">
                  <span class="hunter-level-badge font-mono" id="hunterLevel">LV. 1</span>
                  <small id="pct-count">0 / 148 checkpoints</small>
                </div>
              </div>
              <div class="bar cyber-bar"><i id="overall-fill"></i></div>
              
              <div class="hunter-panel-foot">
                <span class="hunter-next-rank" id="nextRankText">🎯 Next: D-Rank at 20%</span>
                <span class="hunter-status-sub" id="hunterLore">"The System has designated you as a Player. Complete checkpoints to level up to S-Rank."</span>
              </div>
            </div>
          </div>
        </div>`;

// Replace in heroSec
const heroReplaceTarget = `let heroSec = sections['hero'];
heroSec = heroSec.replace('href="#roadmap"', 'href="roadmap.html"');`;

const heroReplacement = `let heroSec = sections['hero'];
heroSec = heroSec.replace('href="#roadmap"', 'href="roadmap.html"');
heroSec = heroSec.replace(/<div class="panel" style="margin-top:24px">[\\s\\S]*?<\\/div>\\s*<\\/div>/, \`${newHunterPanel}\`);`;

code = code.replace(heroReplaceTarget, heroReplacement);

fs.writeFileSync(filePath, code, 'utf8');
console.log('✓ Successfully updated generate_multipage.js with Solo Leveling Hunter System!');
