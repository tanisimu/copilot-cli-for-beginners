#!/usr/bin/env node
const fs = require('fs');

const input = fs.readFileSync(0, 'utf8').trim();
if (!input) {
  console.error('No input provided. Pipe CSV/tab-separated lines into this script.');
  process.exit(1);
}

const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

function parseLine(line) {
  // Try comma split first (CSV-like). This is a simple parser; not handling quoted commas.
  let parts = line.split(',').map(s => s.trim());
  if (parts.length < 4) {
    // Try tab split
    parts = line.split('\t').map(s => s.trim());
  }
  // If still fewer than 4, pad with '不明'
  while (parts.length < 4) parts.push('不明');
  const [title, author, year, summary] = parts;
  return { title: title || '不明', author: author || '不明', year: year || '不明', summary: summary || '不明' };
}

for (const line of lines) {
  const { title, author, year, summary } = parseLine(line);
  console.log(`### 『${title}』`);
  console.log(`- 著者: ${author}`);
  console.log(`- 発売年: ${year}`);
  console.log(`- あらすじ: ${summary}`);
  console.log();
}
