# Task Brief: T020

**Title:** Update about page components with downloaded image paths
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Update the about page components (`AboutHero`, `TeamShowcase`) and the team data file to reference locally downloaded images instead of placeholder paths. All images are downloaded by Wave 1 task T001 to `/public/images/about/`. This task wires those paths into the components using `next/image`.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Current state of about page components

The about page at `/about` renders these components (from `src/app/about/page.tsx`):
1. `<AboutHero />` — Currently a text-only section with a word-by-word animation. No hero image.
2. `<TeamShowcase />` — Renders two team members side-by-side using `HoverMaskReveal`. Uses image paths from `src/data/team.ts` (`showcase` array).
3. `<ThesisSection />`, `<ValuesSection />`, `<BeliefsSection />` — Not in scope for this task.

### Current team data (`src/data/team.ts`)

```typescript
export const showcase: TeamMember[] = [
  {
    id: "karim",
    name: "Karim",
    role: "Co-Founder & CEO",
    bio: "...",
    image: "/images/team/karim.webp",  // placeholder path — directory doesn't exist
    social: { linkedin: "..." },
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Co-Founder & COO",
    bio: "...",
    image: "/images/team/morgan.webp",  // placeholder path
    social: { linkedin: "..." },
  },
];
```

The paths `/images/team/karim.webp` and `/images/team/morgan.webp` point to non-existent directories. The actual downloaded files are in `/public/images/about/`.

### Downloaded image locations (from T001)

All are in `/public/images/about/` after T001 runs. **Verify these files exist before proceeding.**

| Description | Filename (from framerusercontent hash) | Local path |
|-------------|---------------------------------------|-----------|
| About page hero | `Sj4TYZrc68BDHPXs5O5D19mVik.jpg` (7008×4672) | `/public/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg` |
| Karim photo | `HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg` | `/public/images/about/HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg` |
| Morgan photo | `Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp` | `/public/images/about/Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp` |
| Story image 1 | `TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg` | `/public/images/about/TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg` |
| Story image 2 | `wKJt8b9CgcZCyP5NKky2RDcdQ.jpg` | `/public/images/about/wKJt8b9CgcZCyP5NKky2RDcdQ.jpg` |
| Story image 3 | `hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg` | `/public/images/about/hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg` |
| Story image 4 | `qvzOeu5vdocdhOTq2yANNjMg0.jpg` | `/public/images/about/qvzOeu5vdocdhOTq2yANNjMg0.jpg` |

### `HoverMaskReveal` component

`TeamShowcase` uses `<HoverMaskReveal src={karim.image!} alt={karim.name} className="aspect-[3/4] w-full" />`. This is a custom component at `src/components/shared/hover-mask-reveal.tsx`. You need to check if it uses `next/image` internally — if not, you may need to either:
a. Update `HoverMaskReveal` to use `next/image` (if it uses a raw `<img>` tag)
b. Or accept that it uses `<img>` with a local path (local images work fine with raw `<img>`)

Check `src/components/shared/hover-mask-reveal.tsx` before deciding. If it uses `next/image` with `fill`, just updating the `src` prop (via team data) is sufficient.

This task is part of **Wave 3** — Component Updates. Only T001 is a prerequisite.

---

## Requirements

### 1. Update `src/data/team.ts`

Update the `showcase` array to use the correct local image paths:

```typescript
export const showcase: TeamMember[] = [
  {
    id: "karim",
    name: "Karim",
    role: "Co-Founder & CEO",
    bio: "Karim drives the strategic vision behind Open Session...",
    image: "/images/about/HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg",
    social: { linkedin: "https://linkedin.com/in/karim" },
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Co-Founder & COO",
    bio: "Morgan brings operational excellence and creative leadership...",
    image: "/images/about/Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp",
    social: { linkedin: "https://linkedin.com/in/morgan" },
  },
];
```

Note: paths are `/images/about/...` (no `public/` prefix — Next.js serves from `public/` as root).

### 2. Update `src/components/about/about-hero.tsx`

The current `AboutHero` renders only text. Add the hero image below the text block as a full-width image section:

```tsx
{/* Story text grid — existing */}
<motion.div ...>
  {/* ... existing two-column text ... */}
</motion.div>

{/* Hero image — NEW */}
<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  transition={{ delay: 0.8 }}
  className="relative aspect-[16/9] lg:aspect-[21/9] mt-16 lg:mt-24 overflow-hidden bg-bg-tertiary"
>
  <Image
    src="/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg"
    alt="Open Session team at work"
    fill
    className="object-cover"
    sizes="100vw"
    quality={85}
    priority
  />
</motion.div>
```

The hero image is 7008×4672 (very large). Use `quality={85}` to reduce file size. Next.js Image optimization handles downscaling automatically — do NOT manually resize the source image.

Import `Image` from `"next/image"` at the top of `about-hero.tsx`.

The `about-hero.tsx` component is currently a client component (`"use client"`) due to `motion` imports. Adding `next/image` is fine in client components.

### 3. Update `src/components/about/team-showcase.tsx`

The `TeamShowcase` component reads from `showcase` data in `src/data/team.ts`. After updating `team.ts`, the new image paths flow automatically into `HoverMaskReveal`.

**Check `HoverMaskReveal`:** Look at `src/components/shared/hover-mask-reveal.tsx`. If it:
- Uses `next/image` internally → no changes needed to `team-showcase.tsx`
- Uses raw `<img>` tag → it will work with local paths, but consider adding `loading="lazy"` if not present

If `HoverMaskReveal` has a fixed size constraint that would crop the portrait photos poorly, consider adjusting the `className` passed from `TeamShowcase`:
- Current: `className="aspect-[3/4] w-full"` — this is a 3:4 portrait ratio, which is correct for headshots.
- Keep as-is unless the component doesn't respect the className.

### 4. Story images (optional, if scope allows)

The about page currently has no "story" section rendering the 4 story images (`TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg`, etc.). The existing `AboutHero` and `TeamShowcase` don't have a story images section. Adding a new story section is out of scope for this task (that would be a visual redesign).

Store the story image paths in `src/data/team.ts` as a separate export for future use:

```typescript
export const storyImages = [
  "/images/about/TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg",
  "/images/about/wKJt8b9CgcZCyP5NKky2RDcdQ.jpg",
  "/images/about/hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg",
  "/images/about/qvzOeu5vdocdhOTq2yANNjMg0.jpg",
];
```

This makes the paths available for future visual work without rendering them now.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] About page hero image (`Sj4TYZrc68BDHPXs5O5D19mVik.jpg`) renders using `next/image` in `AboutHero`
- [ ] Team member photos render from `/public/images/about/` (Karim: `.jpg`, Morgan: `.webp`)
- [ ] `src/data/team.ts` `showcase` array has updated `image` paths pointing to `/images/about/`
- [ ] No images reference framerusercontent.com or external CDN URLs
- [ ] Story image paths stored in `storyImages` export in `team.ts`
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/team.ts` | modify | Update `showcase` image paths to local `/images/about/` files; add `storyImages` export |
| `src/components/about/about-hero.tsx` | modify | Add hero image below existing text content |
| `src/components/about/team-showcase.tsx` | modify | Verify `HoverMaskReveal` receives correct paths; update `sizes` prop if needed |

### File Ownership Notes

`src/data/team.ts` is not touched by any other Wave 3 tasks. Safe to modify freely.

`src/components/about/about-hero.tsx` is not touched by any other Wave 3 tasks.

`src/components/shared/hover-mask-reveal.tsx` — read it to understand its internals, but only modify it if strictly necessary (e.g., it has hardcoded `<img>` that doesn't accept `src` path changes gracefully). Prefer minimal changes to shared components.

---

## Implementation Guidance

### Check HoverMaskReveal first

Before writing any code, read `src/components/shared/hover-mask-reveal.tsx`. If it:
- Uses `next/image` with `src={src}` prop → team.ts path update is sufficient, no component changes needed
- Uses `<img src={src} />` → local paths work fine; add `loading="lazy"` if missing

### next/image for large images

The about hero is 7008×4672 pixels. Use these settings:
```tsx
<Image
  src="/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg"
  alt="Open Session team at work"
  fill
  className="object-cover"
  sizes="100vw"
  quality={85}
  priority
/>
```

- `fill` + `sizes="100vw"` → Next.js generates optimized srcset
- `quality={85}` → reduces output file size from the large original
- `priority` → this is a visible on-page image, load it eagerly

### Aspect ratio container for hero

Use a responsive aspect ratio:
```tsx
<div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
  <Image ... fill className="object-cover" />
</div>
```

`aspect-[21/9]` gives a cinematic banner ratio on desktop. `aspect-[16/9]` on mobile avoids the image being too tall on small screens.

### About hero motion pattern

`about-hero.tsx` uses `motion.div` with `wordContainer`/`wordReveal` variants from `@/lib/motion`. The new image section should use `fadeInUp` variant to match:

```tsx
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";
// ...
<motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
  {/* image */}
</motion.div>
```

### Code Style

- Use mapped Tailwind classes: `bg-bg-tertiary`, `text-fg-secondary`
- No `style={}` props with raw CSS vars
- Keep `"use client"` directive at top of `about-hero.tsx` (it's already there)

### Edge Cases

- If a photo file doesn't exist (T001 failed for that file), `next/image` throws at build time. Keep the fallback in `team-showcase.tsx`:
  - `karim.image!` — the `!` non-null assertion assumes the image exists. If it might be missing, add a guard or a conditional render. Since T001 is a hard dependency, this is acceptable risk.
- Morgan's photo is a `.webp` file — `next/image` handles WebP natively; no special configuration needed.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/components/home/**` — homepage is T019's scope
- `src/components/about/values-section.tsx` — not in scope
- `src/components/home/thesis-section.tsx` — used on about page but not in scope

### Files Requiring Review

- `package.json` — no new packages needed
- `next.config.ts` — do not touch; local images need no domain config
- `tsconfig.json` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads about page images to `/public/images/about/` | Check `ls /public/images/about/` returns files including the Karim/Morgan photos |

### Downstream Impact

Tasks that depend on this one: None in Wave 3.
- T016 (Wave 4) — SEO metadata for the about page — benefits from having a proper hero image path available.

**Before starting:** Verify T001 has run:
```
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/about/
```
Should return at least: the hero JPG, Karim's JPG, Morgan's webp. If empty, T001 must run first.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T020`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
feat(about): add hero image and update team photos with downloaded assets

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No framerusercontent.com URLs in any modified files
- [ ] About page hero image renders correctly
- [ ] Team member photos render (not blank/broken)
- [ ] `storyImages` export added to `team.ts` for future use
- [ ] No `never_touch` files modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T020 | Wave: 3_
