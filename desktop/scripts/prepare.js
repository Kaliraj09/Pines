// Copies ../writings (the web app) into ./app so the desktop build always uses the same source.
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', '..', 'writings');
const dst = path.join(__dirname, '..', 'app');
if (!fs.existsSync(path.join(src, 'index.html'))) throw new Error('writings/index.html not found at ' + src);
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true, filter: p => path.basename(p) !== 'README.md' });
console.log('prepare: copied writings ->', dst);
