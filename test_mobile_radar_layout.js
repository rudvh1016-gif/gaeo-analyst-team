const assert = require('node:assert/strict');
const fs = require('node:fs');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

// Compact screens should use a consistent two-column radar category grid,
// with smaller one-line controls instead of a tall, ragged flex layout.
const radarStart = html.indexOf('.gaeo-radar{margin:');
const mobileStart = html.indexOf('@media(max-width:620px){', radarStart);
const mobileEnd = html.indexOf('@media(prefers-reduced-motion:reduce)', mobileStart);
assert.ok(radarStart >= 0 && mobileStart > radarStart && mobileEnd > mobileStart, 'mobile radar media query should exist');
const mobile = html.slice(mobileStart, mobileEnd);
assert.match(mobile, /\.gr-chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\);gap:5px;/);
assert.match(mobile, /\.gr-chip\{width:100%;min-width:0;min-height:32px;justify-content:center;gap:3px;font-size:9\.5px;padding:5px 6px;white-space:nowrap;/);
assert.match(mobile, /\.gr-chip \.gr-ico\{font-size:8px\}/);

console.log('mobile radar layout tests passed');
