/* Run inside the writings folder:  node make-sw-list.js
   Rewrites the SHELL file list in sw.js and bumps VERSION. */
const fs = require('fs'), path = require('path');
const skip = new Set(['README.md', 'sw.js', 'make-sw-list.js']);
const out = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f), rel = path.relative('.', p).split(path.sep).join('/');
    if (f.startsWith('.') || skip.has(rel)) continue;
    fs.statSync(p).isDirectory() ? walk(p) : out.push('./' + rel);
  }
})('.');
let s = fs.readFileSync('sw.js', 'utf8');
s = s.replace(/const SHELL = \[[\s\S]*?\];/, 'const SHELL = ' + JSON.stringify(['./'].concat(out.sort()), null, 1) + ';');
s = s.replace(/const VERSION = 'pines-v[^']*'/, "const VERSION = 'pines-v" + Date.now() + "'");
fs.writeFileSync('sw.js', s);
console.log('sw.js updated with ' + (out.length + 1) + ' files');
