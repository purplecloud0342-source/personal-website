// Post-build fix: Vite strips the /personal-website/ base prefix from
// asset paths in JSX output. This script adds it back.
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'dist', 'assets');
const jsFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.js'));
if (!jsFile) {
  console.error('No JS file found in dist/assets');
  process.exit(1);
}

const filePath = path.join(assetsDir, jsFile);
let content = fs.readFileSync(filePath, 'utf8');

const base = '/personal-website';

// Fix: "/cv.html" → "/personal-website/cv.html"
const cvBefore = content.match(/\/cv\.html/g)?.length || 0;
content = content.replace(/"\/cv\.html"/g, `"${base}/cv.html"`);

// Fix: "/images/intro.png" → "/personal-website/images/intro.png"
const introBefore = content.match(/\/images\/intro\.png/g)?.length || 0;
content = content.replace(/"\/images\/intro\.png"/g, `"${base}/images/intro.png"`);

fs.writeFileSync(filePath, content);

const cvAfter = content.match(new RegExp(base + '/cv\\.html', 'g'))?.length || 0;
const introAfter = content.match(new RegExp(base + '/images/intro\\.png', 'g'))?.length || 0;
console.log(`Fixed: cv.html (${cvBefore}→${cvAfter}), intro.png (${introBefore}→${introAfter})`);
