#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { load, save, add, list, search, remove, getStorePath } from './store.js';

function openUrl(url) {
  const p = process.platform;
  const cmd = p === 'darwin' ? 'open' : p === 'win32' ? 'start' : 'xdg-open';
  execSync(`${cmd} "${url.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
}

const args = process.argv.slice(2);
const cmd = args[0];

function parseTags(argv) {
  const tags = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--tag' && argv[i + 1]) tags.push(argv[++i]);
    else if (argv[i].startsWith('--tag=')) tags.push(argv[i].slice(6));
  }
  return tags;
}

function parseArgs(argv) {
  const rest = argv.filter((a) => !a.startsWith('--'));
  const tags = parseTags(argv);
  return { rest, tags };
}

function main() {
  if (!cmd) {
    console.log(`bm — CLI bookmark manager (yuw)
Usage:
  bm add <url> [title] [--tag t1] [--tag t2]   Add bookmark
  bm list [--tag t]                             List (optional filter by tag)
  bm search <query>                             Search by url/title/tags
  bm open <id>                                  Open URL in default browser
  bm rm <id>                                    Remove bookmark
  bm export-html [file]                         Export to HTML
  bm path                                       Print store file path
Store: ${getStorePath()}`);
    process.exit(0);
  }

  const storePath = getStorePath();
  let store = load();

  switch (cmd) {
    case 'add': {
      const { rest, tags } = parseArgs(args.slice(1));
      const url = rest[0];
      const title = rest[1];
      if (!url) {
        console.error('Usage: bm add <url> [title] [--tag t1]');
        process.exit(1);
      }
      const b = add(store, url, title, tags);
      save(store);
      console.log('Added:', b.id, b.title || b.url);
      break;
    }
    case 'list': {
      const { tags } = parseArgs(args.slice(1));
      const tag = tags[0];
      const items = list(store, tag);
      if (items.length === 0) {
        console.log('No bookmarks.');
        break;
      }
      for (const b of items) {
        const t = b.tags && b.tags.length ? ' [' + b.tags.join(', ') + ']' : '';
        console.log(`${b.id}. ${b.title || b.url}${t}`);
        console.log(`   ${b.url}`);
      }
      break;
    }
    case 'search': {
      const q = args.slice(1).filter((a) => !a.startsWith('--')).join(' ');
      if (!q) {
        console.error('Usage: bm search <query>');
        process.exit(1);
      }
      const items = search(store, q);
      if (items.length === 0) {
        console.log('No matches.');
        break;
      }
      for (const b of items) {
        const t = b.tags && b.tags.length ? ' [' + b.tags.join(', ') + ']' : '';
        console.log(`${b.id}. ${b.title || b.url}${t}`);
        console.log(`   ${b.url}`);
      }
      break;
    }
    case 'open': {
      const id = args[1];
      if (!id) {
        console.error('Usage: bm open <id>');
        process.exit(1);
      }
      const b = store.bookmarks.find((x) => x.id === Number(id) || String(x.id) === id);
      if (!b) {
        console.error('Bookmark not found:', id);
        process.exit(1);
      }
      openUrl(b.url);
      console.log('Opened:', b.url);
      break;
    }
    case 'rm': {
      const id = args[1];
      if (!id) {
        console.error('Usage: bm rm <id>');
        process.exit(1);
      }
      const ok = remove(store, id);
      if (!ok) {
        console.error('Bookmark not found:', id);
        process.exit(1);
      }
      save(store);
      console.log('Removed:', id);
      break;
    }
    case 'export-html': {
      const outFile = args[1] || 'bookmarks.html';
      const items = store.bookmarks;
      const lines = [
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bookmarks</title></head><body>',
        '<h1>Bookmarks</h1><ul>',
        ...items.map((b) => `<li><a href="${escapeHtml(b.url)}">${escapeHtml(b.title || b.url)}</a>${b.tags && b.tags.length ? ' ' + b.tags.map((t) => escapeHtml(t)).join(', ') : ''}</li>`),
        '</ul></body></html>',
      ];
      writeFileSync(outFile, lines.join('\n'), 'utf8');
      console.log('Exported', items.length, 'bookmarks to', outFile);
      break;
    }
    case 'path':
      console.log(storePath);
      break;
    default:
      console.error('Unknown command:', cmd);
      process.exit(1);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
