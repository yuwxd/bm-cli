import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { load, save, add, list, search, remove, getStorePath } from './store.js';

const testPath = join(tmpdir(), 'bm-test-' + Date.now() + '.json');
const orig = process.env.BM_PATH;
process.env.BM_PATH = testPath;

const store = load();
add(store, 'https://a.com', 'A', ['x']);
add(store, 'https://b.com', 'B', ['x', 'y']);
save(store);

const l = list(load(), 'x');
if (l.length !== 2) throw new Error('list by tag expected 2');
const s = search(load(), 'b.com');
if (s.length !== 1 || s[0].title !== 'B') throw new Error('search expected B');
remove(store, 1);
save(store);
if (load().bookmarks.length !== 1) throw new Error('after rm expected 1');

if (orig !== undefined) process.env.BM_PATH = orig;
else delete process.env.BM_PATH;
unlinkSync(testPath);

console.log('bm-cli test ok');
