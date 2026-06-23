// Post-build fix: Vite strips /personal-website/ from src/href attributes.
// This restores them by targeting ONLY the generated asset paths in JSX output.
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'dist', 'assets');
const jsFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.js'));
if (!jsFile) {
  console.error('No JS file found');
  process.exit(1);
}

const filePath = path.join(assetsDir, jsFile);
let content = fs.readFileSync(filePath, 'utf8');
const base = '/personal-website';

// Only fix patterns that appear as actual HTML attribute values:
//   href:"/path"  →  href:"/personal-website/path"
//   src:"/path"   →  src:"/personal-website/path"
// This avoids touching string comparisons or data values.
content = content.replace(
  /(href|src):"\/cv\.html"/g,
  '$1:"' + base + '/cv.html"'
);
content = content.replace(
  /(href|src):"\/images\/([^"]+)"/g,
  '$1:"' + base + '/images/$2"'
);
content = content.replace(
  /(href|src):"\/videos\/([^"]+)"/g,
  '$1:"' + base + '/videos/$2"'
);

fs.writeFileSync(filePath, content);

// Log results
const cvOk = (content.match(/\/personal-website\/cv\.html/g) || []).length;
const imgOk = (content.match(/\/personal-website\/images\//g) || []).length;
const vidOk = (content.match(/\/personal-website\/videos\//g) || []).length;
console.log(`Fixed: cv.html x${cvOk}  images/ x${imgOk}  videos/ x${vidOk}`);
