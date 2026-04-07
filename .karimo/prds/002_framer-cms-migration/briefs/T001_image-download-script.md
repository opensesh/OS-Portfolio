# Task Brief: T001

**Title:** Write image download script
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation — no GitHub issue yet)

---

## Objective

Write a Node.js script at `scripts/download-framer-images.js` that downloads all ~75 images from `framerusercontent.com` into `/public/images/` with the correct subdirectory layout. The script must be idempotent, resilient to individual failures, and log progress clearly.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The portfolio site at OS-Portfolio currently has empty image directories. Images for all 5 projects, the about page, homepage, and blog posts are hosted on Framer's CDN at `framerusercontent.com`. These CDN URLs follow the pattern:

```
https://framerusercontent.com/images/{hash}.{ext}?width={w}&height={h}
```

The query parameters are CDN-resizing hints — stripping them gives you the original-resolution file. All ~75 images must be downloaded locally to `/public/images/` before any downstream tasks (T005, T007, T019, T020) can populate correct image paths.

Currently, `public/images/` only contains:
- `public/images/team/karim.webp`
- `public/images/team/morgan.webp`

No `projects/`, `blog/`, `about/`, or `homepage/` subdirectories exist yet.

This task is part of **Wave 1** — the foundation phase. No other tasks depend on this completing before they start, but T005 (project data), T019 (homepage images), and T020 (about images) all depend on its output.

---

## Research Context

### Image Catalog (Full)

All source URLs use base: `https://framerusercontent.com/images/{hash}.{ext}` (strip any `?` params).

#### Projects

**Iterra** → `/public/images/projects/iterra/`
- `vvl6xyIdUMskDBgstfyClKSxE8.svg` (hero)
- `i8dim26bhvu5qQR9wg3QosYwH30.jpg`
- `dNN6V4QOZliCydifbZq9mZHgs.jpg`
- `4iGWtlK9qyEQGR3kn226neLeOx0.jpg`
- `8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg`
- `ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg`
- `iKQP3E2D7UXucYJbubSRc3A7I.jpg`
- `oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg`

**BILTFOUR** → `/public/images/projects/biltfour/`
- `ZwDzuAZjuENRwaTtArVGJQsGc.svg` (hero)
- `sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg`
- `pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg`
- `fQNXA7iFcdLekr5tbHmESnMDE.jpg`
- `5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg`
- `VWj6qlkvnLdlyTExZDWZiezC104.jpg`
- `rPlUBgrbosziZBcZfJfPe8sIHA.jpg`
- `WUB4oauOJh26lOozw9rKdgUYRk.jpg`

**NEXT (Google Cloud)** → `/public/images/projects/google-cloud-next/`
- `zwWkHCt1g0HSk5r9elbNigK55dk.svg` (hero)
- `EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg`
- `Zcgxim04ZIbn7CooJkyUahMgtU.jpg`
- `vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg`
- `Y1GhTfRUj1WegONQQcS7bRybV8I.jpg`
- `TVWePxkVuYJ2ynKwvW8na7Gz8.jpg`
- `1PeraZj4rwCBVywk3sEvPzcRvYw.jpg`
- `kdIwpWfuzthCYLWztP0haNTzq0.jpg`

**Infinite Nature (Google Gemini)** → `/public/images/projects/gemini-infinite-nature/`
- `enyu0AxPncALYsOKGqBz5dcGo.svg` (hero)
- `0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg`
- `akEhFihTl9pdmzuHDf5W4UluIjA.jpg`
- `q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg`
- `69we6OfP9rfNdtqOohJDJYMYcC4.jpg`
- `ZWM3jBNXCq5MI740NZoGE0owGx4.jpg`
- `FhgyvB0QzTK3QC0aY40xLmw4K8.jpg`
- `fEgHnqjSmKjGa0On2DRyNU9HTo.jpg`

**Universal Audio** → `/public/images/projects/universal-audio/`
- `Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg` (hero)
- `5rY7sMJWPqahP45iscJTiYEOw.jpg`
- `gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg`
- `VKLBL93wfWhPj6VObEt1a4HlEA.jpg`
- `2MalmzAFsqsCILwoPC2A6s6Hs.jpg`
- `UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif`
- `CJC7mcxaL9DGEYB4HGificxTbA.jpg`
- `PWbwliRrvDvOr6Iw28xulNrFSc.jpg`

#### Homepage → `/public/images/homepage/`
- `5tYWjZYwckbQWoi9rQ9mkhAoLG8.png` (hero)
- `CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg` (service 1)
- `Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg` (service 2)
- `XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg` (service 3)
- `p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg` (service 4)
- `nQ5h9VMZNz5knXmzATISCBWqakc.jpg` (team photo)

#### About → `/public/images/about/`
- `Sj4TYZrc68BDHPXs5O5D19mVik.jpg` (main hero, 7008x4672)
- `HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg` (Karim photo)
- `Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp` (Morgan photo)
- `TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg` (story 1)
- `wKJt8b9CgcZCyP5NKky2RDcdQ.jpg` (story 2)
- `hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg` (story 3)
- `qvzOeu5vdocdhOTq2yANNjMg0.jpg` (story 4)
- `TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg` (BILTFOUR logo variant)

#### Blog → `/public/images/blog/`
- `KKSflaBzLhQtCCknGCHsQqbqU2s.jpg` (EP02 thumbnail)
- `dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg` (EP01 thumbnail)
- `c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg` (Democratizing thumbnail)
- `6zZWCJwMNLKAwcShUSZbwsO7prA.jpg` (MCP for Designers thumbnail)

### Known Issues

- The CDN URLs sometimes include `?width=X&height=Y` params — always strip the query string before downloading.
- The `about` hero image is 7008x4672 — Next.js Image will optimize it at serve time, so download it as-is. Do not resize during download.
- `UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif` is a GIF for Universal Audio — treat it as a binary file (no text encoding).

---

## Requirements

1. Script lives at `scripts/download-framer-images.js` (plain Node.js, no transpilation needed — CJS or ESM with `.js` extension is fine).
2. Uses only Node.js built-ins (`https`, `fs`, `path`) — no npm dependencies.
3. Downloads each URL to the correct local path (see Image Catalog above).
4. Strips query params from source URLs before fetching.
5. Skips files that already exist on disk (idempotent).
6. Follows HTTP redirects (framerusercontent.com may issue 301/302).
7. Logs each file: `[skip] path/to/file.jpg` or `[done] path/to/file.jpg` or `[fail] path/to/file.jpg — {error message}`.
8. Does not crash the entire run on a single download failure — catches errors per-file and continues.
9. Prints a final summary: `Downloaded: X | Skipped: Y | Failed: Z`.
10. Creates parent directories automatically before writing files.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `scripts/download-framer-images.js` exists
- [ ] Running `node scripts/download-framer-images.js` downloads all ~75 images
- [ ] Re-running the script skips all already-downloaded files without re-fetching
- [ ] A single failed URL does not stop the remaining downloads
- [ ] All 5 project hero SVGs land in `/public/images/projects/{slug}/`
- [ ] All project gallery JPGs land in `/public/images/projects/{slug}/`
- [ ] About page images (hero, team photos, story images) land in `/public/images/about/`
- [ ] Homepage images land in `/public/images/homepage/`
- [ ] Blog thumbnails (4 JPGs) land in `/public/images/blog/`
- [ ] Final summary line printed to stdout

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/download-framer-images.js` | create | Node.js download script |

### File Ownership Notes

This task only creates a new file in a new directory. No conflicts with any other Wave 1 task.

---

## Implementation Guidance

### Script Structure

Use a declarative manifest approach — define a flat array of `{ url, dest }` objects, then iterate over them with a sequential or concurrent download loop.

```js
// Suggested structure
const BASE = 'https://framerusercontent.com/images/';
const PUBLIC = 'public/images'; // relative to repo root

const IMAGES = [
  // projects/iterra
  { url: `${BASE}vvl6xyIdUMskDBgstfyClKSxE8.svg`, dest: `${PUBLIC}/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg` },
  // ... etc
];
```

### HTTP Download (Node built-ins only)

```js
const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    // Strip query params
    const cleanUrl = url.split('?')[0];
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest)) {
      return resolve('skip');
    }

    const file = fs.createWriteStream(dest);
    https.get(cleanUrl, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('done'); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}
```

### Concurrency

Run downloads with limited concurrency (5 at a time) to avoid overwhelming the CDN:

```js
async function downloadAll(images, concurrency = 5) {
  const queue = [...images];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const { url, dest } = queue.shift();
      // try/catch per file
    }
  });
  await Promise.all(workers);
}
```

### Edge Cases

- **Redirect loops:** Limit redirect following to a max depth of 5.
- **Empty file on failure:** Always `fs.unlink` the dest file if a download fails midway — prevents corrupt partial files.
- **SVG files:** Same download logic applies — SVGs are text but treated as binary streams here (no difference).
- **GIF file:** Same binary stream logic — no special handling needed.

### Code Style

- Plain CJS (`require`/`module.exports`) or ESM (`import`/`export`) — choose CJS since `package.json` does not set `"type": "module"`.
- No TypeScript — this is a plain `.js` utility script.
- No external dependencies.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

None for this task — only creating a new script file.

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T005** (migrate project data) — needs project images downloaded
- **T007** (free resources) — independent, uses OS_our-links assets
- **T019** (homepage image paths) — needs homepage images downloaded
- **T020** (about page image paths) — needs about images downloaded

---

## GitHub Context

**Branch:** `worktree/framer-cms-migration-T001`
**Target:** feature branch `feat/framer-cms-migration` or main (determined by PM Agent)

---

## Commit Guidelines

```
chore(scripts): add framer image download script

Downloads ~75 images from framerusercontent.com to public/images/
with correct subdirectory structure. Script is idempotent and
resilient to individual failures.

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking task complete:

- [ ] `node scripts/download-framer-images.js` runs without crashing
- [ ] Re-run shows all files skipped (idempotent)
- [ ] All 5 project subdirs exist under `public/images/projects/`
- [ ] `public/images/blog/`, `public/images/about/`, `public/images/homepage/` all contain files
- [ ] `npm run build` still passes (script does not affect build)
- [ ] `npm run lint` passes (script not linted by Next.js ESLint config — confirm with `npm run lint`)

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T001 | Wave: 1_
