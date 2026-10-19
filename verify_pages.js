const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'market.html',
  'roadmap.html',
  'schedule.html',
  'projects.html',
  'jobs.html',
  'interviews.html',
  'cheats.html',
  'review.html'
];

let errors = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  
  // Check for unresolved placeholders like __XYZ__
  const placeholders = content.match(/__[A-Z_]+__/g);
  if (placeholders) {
    console.error(`[ERROR] ${file} has unresolved placeholders:`, placeholders);
    errors++;
  }

  // Check for hash links in nav
  const navMatch = content.match(/<nav class="nav-links"[\s\S]*?<\/nav>/);
  if (navMatch) {
    const hashLinks = navMatch[0].match(/href="#[^"]*"/g);
    if (hashLinks) {
      console.error(`[ERROR] ${file} has hash links in nav:`, hashLinks);
      errors++;
    }
  }

  // Check for non-existent local links
  const localLinks = content.matchAll(/href="([^":#]+?\.html)"/g);
  for (const m of localLinks) {
    const target = m[1];
    if (!fs.existsSync(path.join(__dirname, target))) {
      console.error(`[ERROR] ${file} links to non-existent file: ${target}`);
      errors++;
    }
  }

  console.log(`✓ ${file}: passed checks (length: ${content.length})`);
}

if (errors === 0) {
  console.log('\nAll 9 pages passed link and placeholder verification!');
} else {
  console.error(`\nFound ${errors} errors!`);
  process.exit(1);
}
