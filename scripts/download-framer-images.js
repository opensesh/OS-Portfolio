#!/usr/bin/env node
/**
 * download-framer-images.js
 *
 * Downloads all ~57 images from framerusercontent.com to /public/images/
 * with the correct subdirectory layout.
 *
 * Usage: node scripts/download-framer-images.js
 *
 * Features:
 * - Idempotent: skips already-downloaded files
 * - Resilient: catches per-file errors without stopping the run
 * - Follows HTTP 301/302 redirects (up to MAX_REDIRECTS deep)
 * - Strips CDN query params before downloading
 * - Logs each file with [done], [skip], or [fail] prefix
 * - Prints final summary
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = 'https://framerusercontent.com/images/';
const PUBLIC = path.join(__dirname, '..', 'public', 'images');
const MAX_REDIRECTS = 5;
const CONCURRENCY = 5;

// ─────────────────────────────────────────────
// Image manifest
// ─────────────────────────────────────────────

const IMAGES = [
  // ── Projects / Iterra ──────────────────────
  { url: `${BASE}vvl6xyIdUMskDBgstfyClKSxE8.svg`, dest: path.join(PUBLIC, 'projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg') },
  { url: `${BASE}i8dim26bhvu5qQR9wg3QosYwH30.jpg`, dest: path.join(PUBLIC, 'projects/iterra/i8dim26bhvu5qQR9wg3QosYwH30.jpg') },
  { url: `${BASE}dNN6V4QOZliCydifbZq9mZHgs.jpg`,   dest: path.join(PUBLIC, 'projects/iterra/dNN6V4QOZliCydifbZq9mZHgs.jpg') },
  { url: `${BASE}4iGWtlK9qyEQGR3kn226neLeOx0.jpg`, dest: path.join(PUBLIC, 'projects/iterra/4iGWtlK9qyEQGR3kn226neLeOx0.jpg') },
  { url: `${BASE}8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg`,   dest: path.join(PUBLIC, 'projects/iterra/8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg') },
  { url: `${BASE}ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg`, dest: path.join(PUBLIC, 'projects/iterra/ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg') },
  { url: `${BASE}iKQP3E2D7UXucYJbubSRc3A7I.jpg`,   dest: path.join(PUBLIC, 'projects/iterra/iKQP3E2D7UXucYJbubSRc3A7I.jpg') },
  { url: `${BASE}oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg`, dest: path.join(PUBLIC, 'projects/iterra/oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg') },

  // ── Projects / BILTFOUR ────────────────────
  { url: `${BASE}ZwDzuAZjuENRwaTtArVGJQsGc.svg`,   dest: path.join(PUBLIC, 'projects/biltfour/ZwDzuAZjuENRwaTtArVGJQsGc.svg') },
  { url: `${BASE}sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg`, dest: path.join(PUBLIC, 'projects/biltfour/sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg') },
  { url: `${BASE}pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg`, dest: path.join(PUBLIC, 'projects/biltfour/pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg') },
  { url: `${BASE}fQNXA7iFcdLekr5tbHmESnMDE.jpg`,   dest: path.join(PUBLIC, 'projects/biltfour/fQNXA7iFcdLekr5tbHmESnMDE.jpg') },
  { url: `${BASE}5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg`, dest: path.join(PUBLIC, 'projects/biltfour/5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg') },
  { url: `${BASE}VWj6qlkvnLdlyTExZDWZiezC104.jpg`, dest: path.join(PUBLIC, 'projects/biltfour/VWj6qlkvnLdlyTExZDWZiezC104.jpg') },
  { url: `${BASE}rPlUBgrbosziZBcZfJfPe8sIHA.jpg`,  dest: path.join(PUBLIC, 'projects/biltfour/rPlUBgrbosziZBcZfJfPe8sIHA.jpg') },
  { url: `${BASE}WUB4oauOJh26lOozw9rKdgUYRk.jpg`,  dest: path.join(PUBLIC, 'projects/biltfour/WUB4oauOJh26lOozw9rKdgUYRk.jpg') },

  // ── Projects / Google Cloud NEXT ───────────
  { url: `${BASE}zwWkHCt1g0HSk5r9elbNigK55dk.svg`, dest: path.join(PUBLIC, 'projects/google-cloud-next/zwWkHCt1g0HSk5r9elbNigK55dk.svg') },
  { url: `${BASE}EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg`, dest: path.join(PUBLIC, 'projects/google-cloud-next/EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg') },
  { url: `${BASE}Zcgxim04ZIbn7CooJkyUahMgtU.jpg`,  dest: path.join(PUBLIC, 'projects/google-cloud-next/Zcgxim04ZIbn7CooJkyUahMgtU.jpg') },
  { url: `${BASE}vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg`,  dest: path.join(PUBLIC, 'projects/google-cloud-next/vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg') },
  { url: `${BASE}Y1GhTfRUj1WegONQQcS7bRybV8I.jpg`, dest: path.join(PUBLIC, 'projects/google-cloud-next/Y1GhTfRUj1WegONQQcS7bRybV8I.jpg') },
  { url: `${BASE}TVWePxkVuYJ2ynKwvW8na7Gz8.jpg`,   dest: path.join(PUBLIC, 'projects/google-cloud-next/TVWePxkVuYJ2ynKwvW8na7Gz8.jpg') },
  { url: `${BASE}1PeraZj4rwCBVywk3sEvPzcRvYw.jpg`, dest: path.join(PUBLIC, 'projects/google-cloud-next/1PeraZj4rwCBVywk3sEvPzcRvYw.jpg') },
  { url: `${BASE}kdIwpWfuzthCYLWztP0haNTzq0.jpg`,  dest: path.join(PUBLIC, 'projects/google-cloud-next/kdIwpWfuzthCYLWztP0haNTzq0.jpg') },

  // ── Projects / Google Gemini Infinite Nature ──
  { url: `${BASE}enyu0AxPncALYsOKGqBz5dcGo.svg`,   dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/enyu0AxPncALYsOKGqBz5dcGo.svg') },
  { url: `${BASE}0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg`,  dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg') },
  { url: `${BASE}akEhFihTl9pdmzuHDf5W4UluIjA.jpg`, dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/akEhFihTl9pdmzuHDf5W4UluIjA.jpg') },
  { url: `${BASE}q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg`, dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg') },
  { url: `${BASE}69we6OfP9rfNdtqOohJDJYMYcC4.jpg`, dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/69we6OfP9rfNdtqOohJDJYMYcC4.jpg') },
  { url: `${BASE}ZWM3jBNXCq5MI740NZoGE0owGx4.jpg`, dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/ZWM3jBNXCq5MI740NZoGE0owGx4.jpg') },
  { url: `${BASE}FhgyvB0QzTK3QC0aY40xLmw4K8.jpg`,  dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/FhgyvB0QzTK3QC0aY40xLmw4K8.jpg') },
  { url: `${BASE}fEgHnqjSmKjGa0On2DRyNU9HTo.jpg`,  dest: path.join(PUBLIC, 'projects/google-gemini-infinite-nature/fEgHnqjSmKjGa0On2DRyNU9HTo.jpg') },

  // ── Projects / Universal Audio ─────────────
  { url: `${BASE}Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg`, dest: path.join(PUBLIC, 'projects/universal-audio/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg') },
  { url: `${BASE}5rY7sMJWPqahP45iscJTiYEOw.jpg`,   dest: path.join(PUBLIC, 'projects/universal-audio/5rY7sMJWPqahP45iscJTiYEOw.jpg') },
  { url: `${BASE}gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg`, dest: path.join(PUBLIC, 'projects/universal-audio/gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg') },
  { url: `${BASE}VKLBL93wfWhPj6VObEt1a4HlEA.jpg`,  dest: path.join(PUBLIC, 'projects/universal-audio/VKLBL93wfWhPj6VObEt1a4HlEA.jpg') },
  { url: `${BASE}2MalmzAFsqsCILwoPC2A6s6Hs.jpg`,   dest: path.join(PUBLIC, 'projects/universal-audio/2MalmzAFsqsCILwoPC2A6s6Hs.jpg') },
  { url: `${BASE}UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif`,  dest: path.join(PUBLIC, 'projects/universal-audio/UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif') },
  { url: `${BASE}CJC7mcxaL9DGEYB4HGificxTbA.jpg`,  dest: path.join(PUBLIC, 'projects/universal-audio/CJC7mcxaL9DGEYB4HGificxTbA.jpg') },
  { url: `${BASE}PWbwliRrvDvOr6Iw28xulNrFSc.jpg`,  dest: path.join(PUBLIC, 'projects/universal-audio/PWbwliRrvDvOr6Iw28xulNrFSc.jpg') },

  // ── Homepage ───────────────────────────────
  { url: `${BASE}5tYWjZYwckbQWoi9rQ9mkhAoLG8.png`, dest: path.join(PUBLIC, 'homepage/5tYWjZYwckbQWoi9rQ9mkhAoLG8.png') },
  { url: `${BASE}CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg`, dest: path.join(PUBLIC, 'homepage/CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg') },
  { url: `${BASE}Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg`, dest: path.join(PUBLIC, 'homepage/Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg') },
  { url: `${BASE}XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg`, dest: path.join(PUBLIC, 'homepage/XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg') },
  { url: `${BASE}p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg`,   dest: path.join(PUBLIC, 'homepage/p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg') },
  { url: `${BASE}nQ5h9VMZNz5knXmzATISCBWqakc.jpg`, dest: path.join(PUBLIC, 'homepage/nQ5h9VMZNz5knXmzATISCBWqakc.jpg') },

  // ── About ──────────────────────────────────
  { url: `${BASE}Sj4TYZrc68BDHPXs5O5D19mVik.jpg`,  dest: path.join(PUBLIC, 'about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg') },
  { url: `${BASE}HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg`, dest: path.join(PUBLIC, 'about/HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg') },
  { url: `${BASE}Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp`, dest: path.join(PUBLIC, 'about/Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp') },
  { url: `${BASE}TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg`, dest: path.join(PUBLIC, 'about/TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg') },
  { url: `${BASE}wKJt8b9CgcZCyP5NKky2RDcdQ.jpg`,   dest: path.join(PUBLIC, 'about/wKJt8b9CgcZCyP5NKky2RDcdQ.jpg') },
  { url: `${BASE}hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg`,  dest: path.join(PUBLIC, 'about/hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg') },
  { url: `${BASE}qvzOeu5vdocdhOTq2yANNjMg0.jpg`,   dest: path.join(PUBLIC, 'about/qvzOeu5vdocdhOTq2yANNjMg0.jpg') },
  { url: `${BASE}TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg`, dest: path.join(PUBLIC, 'about/TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg') },

  // ── Blog ───────────────────────────────────
  { url: `${BASE}KKSflaBzLhQtCCknGCHsQqbqU2s.jpg`, dest: path.join(PUBLIC, 'blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg') },
  { url: `${BASE}dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg`,  dest: path.join(PUBLIC, 'blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg') },
  { url: `${BASE}c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg`, dest: path.join(PUBLIC, 'blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg') },
  { url: `${BASE}6zZWCJwMNLKAwcShUSZbwsO7prA.jpg`, dest: path.join(PUBLIC, 'blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg') },
];

// ─────────────────────────────────────────────
// Download logic
// ─────────────────────────────────────────────

/**
 * Download a single URL to dest. Follows redirects up to MAX_REDIRECTS.
 * Returns 'done', 'skip', or throws on failure.
 */
function download(url, dest, redirectDepth = 0) {
  return new Promise((resolve, reject) => {
    if (redirectDepth > MAX_REDIRECTS) {
      return reject(new Error('Too many redirects'));
    }

    // Strip query params
    const cleanUrl = url.split('?')[0];

    // Skip if already downloaded
    if (fs.existsSync(dest)) {
      return resolve('skip');
    }

    // Ensure parent directory exists
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const protocol = cleanUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    const req = protocol.get(cleanUrl, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        const location = res.headers.location;
        if (!location) return reject(new Error('Redirect with no Location header'));
        return download(location, dest, redirectDepth + 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve('done');
      });
      file.on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    });

    req.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

/**
 * Run downloads with limited concurrency.
 */
async function downloadAll(images, concurrency = CONCURRENCY) {
  const queue = [...images];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const { url, dest } = item;
      const relDest = path.relative(path.join(__dirname, '..'), dest);
      try {
        const result = await download(url, dest);
        if (result === 'skip') {
          console.log(`[skip] ${relDest}`);
          skipped++;
        } else {
          console.log(`[done] ${relDest}`);
          downloaded++;
        }
      } catch (err) {
        console.error(`[fail] ${relDest} — ${err.message}`);
        failed++;
      }
    }
  });

  await Promise.all(workers);

  console.log('');
  console.log(`Downloaded: ${downloaded} | Skipped: ${skipped} | Failed: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────

console.log(`Downloading ${IMAGES.length} images from framerusercontent.com...`);
console.log(`Destination: ${PUBLIC}`);
console.log('');

downloadAll(IMAGES);
