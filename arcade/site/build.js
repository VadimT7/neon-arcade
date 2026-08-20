/* The arcade ships as one 250 KB HTML file. It travels here brotli-compressed and
   base64-encoded, and is expanded back into a plain, complete index.html at build
   time — so what the site serves is ordinary static HTML, not a self-extracting page. */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const OUT = 'dist';
const STATIC = ['manifest.webmanifest', 'sw.js', 'icon.svg', 'og.jpg', 'robots.txt'];

fs.mkdirSync(OUT, { recursive: true });

const packed = fs.readFileSync('payload.br.b64', 'utf8').trim();
const html = zlib.brotliDecompressSync(Buffer.from(packed, 'base64'));
if (!html.slice(0, 200).toString().includes('<!DOCTYPE html>')) {
  throw new Error('payload did not decompress into an HTML document');
}
fs.writeFileSync(path.join(OUT, 'index.html'), html);

for (const f of STATIC) fs.copyFileSync(f, path.join(OUT, f));

console.log('built', OUT + '/index.html', html.length, 'bytes +', STATIC.length, 'static files');
