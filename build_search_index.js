const fs = require('fs');
const path = require('path');

const srcHtml = fs.readFileSync(path.join(__dirname, 'Full-Stack-Roadmap-Kerala.html'), 'utf8');

const searchIndex = [];

// 1. Phases
const phaseMatches = srcHtml.matchAll(/<article class="phase [^"]*" id="(phase-\d+)">[\s\S]*?<div class="arc">([^<]+)<\/div>[\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?<div class="boss"><b>[^<]*<\/b>([^<]+)<\/div>/g);
for (const m of phaseMatches) {
  searchIndex.push({
    cat: 'Season',
    badge: '🗺️ Roadmap',
    title: `${m[2].trim()} — ${m[3].trim()}`,
    sub: `Boss: ${m[4].trim()}`,
    url: `roadmap.html#${m[1]}`
  });
}

// 2. Checkpoints
const chkMatches = srcHtml.matchAll(/<article class="phase [^"]*" id="(phase-\d+)">([\s\S]*?)<\/article>/g);
for (const pm of chkMatches) {
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

// 3. Watch Courses
const watchMatches = srcHtml.matchAll(/<div class="watch">[\s\S]*?<ul>([\s\S]*?)<\/ul>/g);
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

// 4. Projects
const projMatches = srcHtml.matchAll(/<div class="proj">[\s\S]*?<span class="lv">([^<]+)<\/span>[\s\S]*?<h4>([^<]+)<\/h4>[\s\S]*?<div class="stack">([^<]+)<\/div>[\s\S]*?<div class="proof">🎯 ([^<]+)<\/div>/g);
for (const p of projMatches) {
  searchIndex.push({
    cat: 'Project',
    badge: '🚀 Project',
    title: `${p[1].trim()} — ${p[2].trim()}`,
    sub: `${p[3].trim()} · ${p[4].trim()}`,
    url: 'projects.html'
  });
}

// 5. Interview questions
const interviewMatches = srcHtml.matchAll(/<details>[\s\S]*?<summary>([^<]+)<\/summary>[\s\S]*?<ol class="q">([\s\S]*?)<\/ol>/g);
for (const im of interviewMatches) {
  const topic = im[1].split('—')[0].trim();
  const qLis = im[2].matchAll(/<li>([^<]+)<\/li>/g);
  for (const q of qLis) {
    searchIndex.push({
      cat: 'Interview',
      badge: '🎯 Interview',
      title: q[1].trim(),
      sub: `${topic} Question`,
      url: 'interviews.html'
    });
  }
}

// 6. Tools
const toolMatches = srcHtml.matchAll(/<tr><td><b>([^<]+)<\/b><\/td><td>([^<]+)<\/td><td><span class='pill [^']*'>([^<]+)<\/span><\/td><td>([^<]+)<\/td><\/tr>/g);
for (const tm of toolMatches) {
  searchIndex.push({
    cat: 'Tool',
    badge: '🛠️ Tool',
    title: tm[1].trim(),
    sub: `${tm[3].trim()} priority · ${tm[4].trim()} · ${tm[2].trim()}`,
    url: 'market.html'
  });
}

// 7. Companies
const compMatches = srcHtml.matchAll(/<tr><td><b>([^<]+)<\/b><\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g);
for (const cm of compMatches) {
  searchIndex.push({
    cat: 'Company',
    badge: '💼 Target Company',
    title: cm[1].trim(),
    sub: `${cm[2].trim()} · ${cm[3].trim()} · ${cm[4].trim()}`,
    url: 'jobs.html'
  });
}

// 8. Cheat Sheets & Shortcuts
const cheatMatches = srcHtml.matchAll(/<tr><td><a href='([^']*)'[^>]*><b>([^<]+)<\/b>[^<]*<\/a><\/td><td><span class='pill [^']*'>([^<]+)<\/span><\/td><td>([^<]+)<\/td><\/tr>/g);
for (const ch of cheatMatches) {
  searchIndex.push({
    cat: 'Cheat',
    badge: '⚡ Cheat Sheet',
    title: ch[2].trim(),
    sub: `${ch[3].trim()} · ${ch[4].trim()}`,
    url: ch[1].startsWith('http') ? ch[1] : 'cheats.html'
  });
}

console.log('Total search index items built:', searchIndex.length);
console.log('Sample item:', searchIndex[0]);
console.log('Categories breakdown:');
const counts = {};
for (const item of searchIndex) {
  counts[item.cat] = (counts[item.cat] || 0) + 1;
}
console.log(counts);
