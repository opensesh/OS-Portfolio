# Task Brief: T019

**Title:** Update homepage components with downloaded image paths
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace placeholder gradients and absent image renders in the homepage components with `next/image` references pointing to locally downloaded assets in `/public/images/`. Wave 1 task T001 downloaded all images from framerusercontent.com to the local filesystem — this task wires those paths into the components.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Current state of homepage components

The homepage is composed of several sections. The relevant ones for this task:

1. **`src/components/home/hero.tsx`** — Currently renders a CRT TV 3D scene, client logos, and text content. The hero component itself does not render a standalone hero image (it uses a 3D canvas + FaultyTerminal background). However, the research identified a hero PNG (`5tYWjZYwckbQWoi9rQ9mkhAoLG8.png`) — this may be intended as a background or an `og:image` reference rather than a rendered `<Image>` tag. See implementation guidance.

2. **`src/components/home/what-we-do-section.tsx`** (now named `OurExpertiseSection`) — Currently renders color blocks (`imageBg: "bg-bg-brand-solid"`) as placeholders in the accordion image panel. The research found 4 service images (`CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg`, `Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg`, `XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg`, `p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg`). These should be used as the accordion panel images.

3. **`src/components/home/featured-work.tsx`** (`FeaturedWork`) — Renders `featuredProjects` from `src/data/projects`. The `ProjectCard` component currently shows placeholder gradients instead of actual project thumbnails. Once T005 has populated project data with local image paths, the project cards need to use those paths. This task uncomments (or adds) the `next/image` render in `ProjectCard`.

4. **`src/data/what-we-do.ts`** — The `WhatWeDoItem` interface has `imageBg`/`imageHoverBg` fields for color classes. This task adds an `image?: string` field to use actual downloaded service images in the expertise section.

### Downloaded image locations (from T001)

| File | Local path |
|------|-----------|
| Homepage hero | `/public/images/homepage/5tYWjZYwckbQWoi9rQ9mkhAoLG8.png` |
| Service image 1 | `/public/images/homepage/CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg` |
| Service image 2 | `/public/images/homepage/Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg` |
| Service image 3 | `/public/images/homepage/XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg` |
| Service image 4 | `/public/images/homepage/p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg` |
| Team photo | `/public/images/homepage/nQ5h9VMZNz5knXmzATISCBWqakc.jpg` |
| Blog thumb (EP02) | `/public/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg` |
| Blog thumb (EP01) | `/public/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg` |
| Blog thumb (Democratizing) | `/public/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg` |
| Project thumbnails | `/public/images/projects/{slug}/` (downloaded by T001) |

**Note:** Verify these files actually exist before referencing them. T001 is a prerequisite — if it hasn't run, this task cannot proceed. See the "Before starting" check below.

This task is part of **Wave 3** — Component Updates. T001 and T005 are upstream.

---

## Requirements

### 1. Update `src/data/what-we-do.ts`

Add an optional `image` field to `WhatWeDoItem`:

```typescript
export interface WhatWeDoItem {
  id: string;
  title: string;
  description: string;
  items: string[];
  imageBg: string;
  imageHoverBg: string;
  image?: string;        // path to downloaded service image
}
```

Update the 4 service items that have images. Map them by position (Brand Identity = image 1, Design Systems = image 2, etc.). The exact mapping should make visual sense — assign images to the services that most closely match their content. Use your judgment for the mapping; it can be revised later.

Example:
```typescript
{
  id: "brand-identity",
  title: "Brand Identity",
  // ... existing fields
  image: "/images/homepage/CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg",
},
```

There are 4 service images and 5 service items. One item will not have an image — it falls back to the existing color block.

### 2. Update `src/components/home/what-we-do-section.tsx` (`OurExpertiseSection`)

The accordion right panel currently renders color blocks via `PixelTransition`. When a service item has `item.image`, render the image instead of (or underneath) the color block.

The `PixelTransition` component uses `firstContent` and `secondContent` slots. Update those to use `next/image` when an image is available:

```tsx
firstContent={
  item.image ? (
    <div className="relative w-full h-full">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  ) : (
    <div className={cn("w-full h-full", item.imageBg)} />
  )
}
```

Do the same for the mobile inline image inside the accordion content area.

### 3. Update `src/components/projects/project-card.tsx`

The `CarouselCard` and `GridCard` components both have commented-out/placeholder image rendering. Replace the placeholder gradient div with `next/image`:

**GridCard** — replace the inner content div with:
```tsx
<div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
  <Image
    src={project.thumbnail}
    alt={project.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

**CarouselCard** — replace the inner gradient div with:
```tsx
<motion.div
  className="absolute inset-0"
  style={parallaxX ? { x: parallaxX, scale: 1.225 } : undefined}
>
  <Image
    src={project.thumbnail}
    alt={project.title}
    fill
    className="object-cover"
    sizes="100vw"
  />
</motion.div>
```

Keep the existing `MagneticCursorLabel` overlay on top.

**Important:** Keep the fallback gradient div as a sibling/background for when the image loads or if thumbnail is missing:
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-bg-secondary" />
<Image ... />
```
The gradient shows before the image loads (it will be covered once the image renders).

### 4. Update `src/data/blog.ts` thumbnail paths

T006 has already set thumbnail paths to `/public/images/blog/{filename}.jpg`. Verify these paths match the actual downloaded filenames from T001. The mapping is:
- EP02 → `KKSflaBzLhQtCCknGCHsQqbqU2s.jpg`
- EP01 → `dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg`
- Democratizing → `c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg`
- MCP Guide → `6zZWCJwMNLKAwcShUSZbwsO7prA.jpg`

If T006 already set these paths correctly, no change needed. Just verify.

### 5. Hero image note

The homepage hero PNG (`5tYWjZYwckbQWoi9rQ9mkhAoLG8.png`) — the hero component uses a full-screen 3D canvas, so a standard `<Image>` tag is not the right vehicle. Instead:
- Add this image path as `og:image` reference (that's T016's job)
- Do NOT attempt to add it as a background image to the Hero component — it would conflict with the existing CRT/FaultyTerminal visual system

If there's a specific non-hero section on the homepage that should show this image, defer to product judgment. Skip the hero PNG for now and note it in a TODO comment in the brief's checklist.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Featured work section (`FeaturedWork`) renders project thumbnails using `next/image` instead of placeholder gradients
- [ ] Expertise section (`OurExpertiseSection`) renders actual service images in the accordion panel for items that have an `image` field
- [ ] `src/data/what-we-do.ts` has `image` field added to at least 4 of the 5 service items
- [ ] Blog thumbnails in `src/data/blog.ts` reference `/public/images/blog/` local paths (verify or update)
- [ ] No images reference framerusercontent.com or any external CDN
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/what-we-do.ts` | modify | Add optional `image` field to `WhatWeDoItem`, populate for 4 items |
| `src/components/home/what-we-do-section.tsx` | modify | Render downloaded images in PixelTransition slots |
| `src/components/projects/project-card.tsx` | modify | Enable next/image in both carousel and grid card variants |
| `src/data/blog.ts` | modify | Verify/update thumbnail paths to local files |

### File Ownership Notes

`project-card.tsx` is also relevant to T010 (project detail page) — but the card component itself is only touched here. T010 creates new sub-components. No conflict.

`src/data/blog.ts` may be owned by T006. If T006 already set the correct local paths, do not re-modify — just verify.

---

## Implementation Guidance

### next/image sizes prop

Always include a `sizes` prop when using `fill`:
- Full-width: `sizes="100vw"`
- Half-width layout: `sizes="(max-width: 768px) 100vw, 50vw"`
- Grid (3 col): `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`

### Preserving existing hover animations

The `what-we-do-section.tsx` component uses `PixelTransition` with GSAP crossfade between `firstContent` and `secondContent`. This animation must be preserved. Only the content inside the slots changes — from solid color divs to image containers.

### Fallback strategy for missing images

If an image file doesn't exist (T001 may not have run, or a specific file failed to download), `next/image` will error at build time. Two options:
1. Keep the color block fallback as a sibling: it shows behind the image and covers the "broken" state
2. Use `onError` prop to hide the image on load failure (less elegant)

Prefer option 1 — it's the most resilient.

### `project-card.tsx` — "use client" directive

`project-card.tsx` already has `"use client"` (it uses `useRef`, `useMagneticCursor`, `motion.div`). Adding `next/image` (a server-compatible component) works fine inside a client component.

### Code Style

- Use mapped Tailwind classes: `bg-bg-tertiary`, `text-fg-primary`
- No `bg-[var(--...)]` or `/30` opacity modifiers
- Preserve all existing motion/animation code — only add image elements

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/components/home/hero.tsx` — do not modify the hero component's visual system

### Files Requiring Review

- `package.json` — no new packages needed
- `next.config.ts` — do not touch (images are local, no remote domain config needed)

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads all images to `/public/images/homepage/`, `/public/images/blog/`, `/public/images/projects/{slug}/` | Check `ls /public/images/homepage/` returns files |
| T005 | Populates `project.thumbnail` with local paths like `/images/projects/{slug}/hero.svg` | Check `src/data/projects.ts` has local thumbnail paths |

### Downstream Impact

Tasks that depend on this one:
- None directly in Wave 3
- T016 (Wave 4) — SEO metadata — needs `project.thumbnail` to be a valid local path for `og:image`

**Before starting:** Verify dependencies:
```
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/homepage/
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/blog/
grep "thumbnail:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/projects.ts | head -5
```
All three should return results. If `/public/images/homepage/` is empty, T001 has not run — block this task until T001 is complete.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T019`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
feat(home): wire downloaded images into expertise section and project cards

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No framerusercontent.com URLs in any modified files
- [ ] Project cards render images (not placeholder gradients) in both carousel and grid views
- [ ] Expertise section accordion shows images in right panel
- [ ] No `never_touch` files modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T019 | Wave: 3_
