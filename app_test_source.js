const fs = require('node:fs');
const path = require('node:path');

/**
 * Reconstruct the browser document for source-level contract tests.
 * Production keeps the large CSS and app program in cacheable static files;
 * tests inspect the assembled source in the same execution order.
 */
function readAppDocument(root = __dirname) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  return read('index.html')
    .replace(/<link rel="stylesheet" href="app-shell\.css\?v=[^"]+">/,
      `<style>\n${read('app-shell.css')}</style>`)
    .replace(/<script src="app\.js\?v=[^"]+"[^>]*><\/script>/,
      `<script>\n${read('app.js')}</script>`);
}

module.exports = { readAppDocument };
