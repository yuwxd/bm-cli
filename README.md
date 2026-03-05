# bm-cli

**Simple terminal bookmark manager.** Single-file store (JSON) in your home directory. Commands: add, list, search, open in browser, export to HTML. No external services — everything stays local.

- **What it’s for:** Storing and quickly accessing links from the CLI (add, list, search, open, rm, export-html). Handy when you prefer the terminal over browser bookmarks or want a single-file backup.
- **What it does:** Saves bookmarks to `~/.bm-bookmarks.json`. The `add` command adds a URL with optional title and tags; `list` and `search` print results; `open <id>` opens the link in your default browser; `export-html` generates an HTML file with all links.
- **Open source:** MIT. Author: **yuw**.

---

## Requirements

Node.js 18+

## Install

```bash
git clone https://github.com/yuwxd/bm-cli.git
cd bm-cli
npm link
```

(Or run via `node cli.js` without linking.)

## Usage (step by step)

1. **Add a bookmark:**  
   `bm add https://example.com "Example"`

2. **Add with tags:**  
   `bm add https://github.com yuw --tag dev --tag code`

3. **List all:**  
   `bm list`

4. **List only bookmarks with a given tag:**  
   `bm list --tag dev`

5. **Search by text (URL, title, or tag):**  
   `bm search github`

6. **Open in browser (by ID from list):**  
   `bm open 1`

7. **Remove a bookmark:**  
   `bm rm 1`

8. **Export to HTML:**  
   `bm export-html`  
   `bm export-html my-links.html`

9. **Where the bookmark file lives:**  
   `bm path`  
   Default: `~/.bm-bookmarks.json`. You can set `BM_PATH` in the environment.

## Publishing to GitHub

Repo: `yuwxd/bm-cli`. After creating an empty repo on GitHub:

```bash
cd bm-cli
git remote add origin https://github.com/yuwxd/bm-cli.git
git push -u origin main
```

CI (tests) runs on every push to `main`.

## License

MIT. Author: **yuw**.
