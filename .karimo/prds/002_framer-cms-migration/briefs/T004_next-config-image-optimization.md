# Task Brief: T004

**Title:** Update next.config.ts for image optimization
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation)

---

## Objective

Update `next.config.ts` to ensure Next.js Image is correctly configured for local images only: confirm no `framerusercontent.com` domain is allowlisted, clean up `remotePatterns` if any exist, and add image size/format configuration appropriate for the large about-page hero image (7008x4672). Document all config changes inline.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The current `next.config.ts` is essentially empty:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

There is no `remotePatterns` configuration, no `images` block, and no domain allowlisting. This is actually the desired end state for image domains — local images via `/public/images/` need no remote configuration.

However, once images are downloaded (T001) and components begin using `next/image` to serve them, Next.js needs to know the expected image dimensions and formats. The about-page hero is exceptionally large (7008x4672 pixels) and should be configured to avoid any build-time warnings.

The PRD specifies: use `next/image` with fill-based layout (the existing component pattern). No changes to component-level image rendering are needed here — this task only configures `next.config.ts`.

This task is part of **Wave 1** — the foundation phase. All downstream image-rendering tasks (T019, T020, T010) assume this config is correct before they run.

---

## Research Context

### Current `next.config.ts` (exact)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### What Next.js 16 Requires for Local Images

For images stored in `/public/`, Next.js Image (`next/image`) works without any configuration — the `src` prop accepts a path string like `/images/projects/iterra/hero.svg` and Next.js serves it via the built-in image optimization endpoint.

**No `remotePatterns` is needed for local images.**

### About Page Hero Consideration

The image `Sj4TYZrc68BDHPXs5O5D19mVik.jpg` (7008x4672) is very large. Next.js Image will automatically resize and optimize it via the `/_next/image` endpoint. No special config is strictly required for this to work, but adding `deviceSizes` and `imageSizes` helps Next.js generate better responsive variants.

Additionally, setting `formats: ['image/avif', 'image/webp']` ensures modern format delivery (Next.js 16 default already includes webp; avif is opt-in).

### Known Pattern: `next/image` with `fill`

The codebase uses `next/image` with the `fill` prop and a `sizes` string — for example:
```tsx
<Image
  src={project.thumbnail}
  alt={project.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

No changes needed to this usage pattern — it is already correct for local images.

---

## Requirements

### Updated `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All images are served locally from /public/images/.
    // No remote domains are allowlisted — framerusercontent.com
    // is intentionally absent.
    remotePatterns: [],

    // Device breakpoints for responsive image generation.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Thumbnail/icon sizes — used when <Image> has a fixed width/height.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Serve AVIF (smallest) and WebP (broad support).
    // Next.js will fall back to the original format if the browser
    // does not support AVIF.
    formats: ["image/avif", "image/webp"],

    // The about-page hero is 7008x4672. Next.js Image handles
    // optimization at serve time — no build-time resize needed.
    // Setting minimumCacheTTL ensures optimized variants are cached.
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
```

### What NOT to Add

- Do not add `domains` (deprecated in Next.js 13+, use `remotePatterns`)
- Do not add `framerusercontent.com` to `remotePatterns`
- Do not add any `loader` configuration — the default Next.js Image loader is correct
- Do not add `unoptimized: true` — we want optimization enabled

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `next.config.ts` has an `images` block with `remotePatterns: []`
- [ ] `framerusercontent.com` is not present anywhere in `next.config.ts`
- [ ] `npm run build` passes with no image configuration warnings
- [ ] `formats`, `deviceSizes`, and `imageSizes` are configured inline-documented

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `next.config.ts` | modify | Add images block with empty remotePatterns and size/format config |

### File Ownership Notes

`next.config.ts` is marked `require_review` in `config.yaml`. The change is minimal and well-defined — review before committing.

No other Wave 1 task touches `next.config.ts`. No conflicts.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `next.config.ts` — this is the only file changed; review the diff before committing

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T019** (homepage images) — assumes Next.js Image is correctly configured
- **T020** (about page images) — assumes the large hero image will optimize correctly
- **T010** (project detail page) — uses `next/image` for gallery

**Before starting downstream tasks:** Verify `npm run build` passes after this config change.

---

## GitHub Context

**Branch:** `worktree/framer-cms-migration-T004`
**Target:** feature branch `feat/framer-cms-migration` or main (determined by PM Agent)

---

## Commit Guidelines

```
chore(config): configure next.config.ts for local image optimization

- Add images block with empty remotePatterns (no CDN domains)
- Configure deviceSizes, imageSizes, formats for responsive delivery
- Document about-page hero size consideration inline

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking task complete:

- [ ] All success criteria met
- [ ] `npm run build` passes with no image configuration warnings
- [ ] `npm run lint` passes
- [ ] `grep -r "framerusercontent" next.config.ts` returns nothing
- [ ] `next.config.ts` changes reviewed before commit

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T004 | Wave: 1_
