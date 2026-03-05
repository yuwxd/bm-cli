import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const DEFAULT_PATH = join(homedir(), '.bm-bookmarks.json');

export function getStorePath(customPath) {
  return customPath || process.env.BM_PATH || DEFAULT_PATH;
}

export function load(path) {
  const p = getStorePath(path);
  if (!existsSync(p)) return { bookmarks: [], nextId: 1 };
  const raw = readFileSync(p, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.bookmarks)) data.bookmarks = [];
  if (typeof data.nextId !== 'number') data.nextId = data.bookmarks.length + 1;
  return data;
}

export function save(data, path) {
  const p = getStorePath(path);
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

export function add(store, url, title, tags = []) {
  const id = store.nextId++;
  const b = { id, url, title: title || url, tags: Array.isArray(tags) ? tags : [tags], added: new Date().toISOString() };
  store.bookmarks.push(b);
  return b;
}

export function list(store, tag) {
  let out = store.bookmarks;
  if (tag) out = out.filter((b) => b.tags && b.tags.includes(tag));
  return out;
}

export function search(store, q) {
  const lower = (q || '').toLowerCase();
  return store.bookmarks.filter(
    (b) =>
      (b.url && b.url.toLowerCase().includes(lower)) ||
      (b.title && b.title.toLowerCase().includes(lower)) ||
      (b.tags && b.tags.some((t) => t.toLowerCase().includes(lower)))
  );
}

export function remove(store, id) {
  const idx = store.bookmarks.findIndex((b) => b.id === id || String(b.id) === String(id));
  if (idx === -1) return false;
  store.bookmarks.splice(idx, 1);
  return true;
}
