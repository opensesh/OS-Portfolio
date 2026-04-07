# Task Brief: T007

**Title:** Migrate free resources data and copy assets from OS_our-links
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 2

---

## Objective

Create `/src/data/free-resources.ts` with the 5 free resource records that currently live in the separate `OS_our-links` repo. Copy all associated image and video assets from that repo into `/public/images/resources/`. Each resource must conform to the `FreeResource` TypeScript type that T002 defines.

---

## Context

**Parent Feature:** framer-cms-migration PRD

Open Session has a separate `OS_our-links` repo at `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/` that contains a standalone links page. Inside it, `src/components/FreeResources.tsx` defines 5 free resource cards inline as a `resourceCards` constant. These resources need to be extracted into the main portfolio's data layer so they can be displayed in the Lab page (T015) and future pages.

The source of truth for the resource data is the `FreeResources.tsx` component in `OS_our-links`. This task reads from that source and creates canonical data in the portfolio project.

Wave 1 dependency:
- **T002** defines the `FreeResource`, `ResourceBadge`, and `ResourceMedia` TypeScript types in `/src/types/free-resources.ts`

This task is part of **Wave 2** — content migration.

---

## Source Data (from OS_our-links/src/components/FreeResources.tsx)

The `resourceCards` array in the source component contains 5 entries with this shape:

```typescript
// Source shape in OS_our-links (for reference only — do NOT copy verbatim):
interface ResourceCard {
  id: string;
  badge: { text: string; variant: "coming-soon" | "live" };  // source uses object shape
  mediaDefault: string;  // image or video src
  mediaType: "image" | "video";
  imageHover: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}
// NOTE: The OS-Portfolio FreeResource type uses badge: "live" | "coming-soon" (plain string),
// NOT the object shape above. Adapt when writing free-resources.ts.
```

### Resource 1: Portfolio Template

```
id: "portfolio"
badge: { text: "Live", variant: "live" }
mediaDefault: "/OS_our-links/images/portfolio-01.jpg"   → copy to /public/images/resources/portfolio-01.jpg
mediaType: "image"
imageHover: "/OS_our-links/images/portfolio-02.jpg"     → copy to /public/images/resources/portfolio-02.jpg
title: "Portfolio Template"
description: "Our co-founder's portfolio that helped him land jobs at Google, Salesforce, and other Fortune 500 companies. Open source and ready to customize"
href: "https://www.figma.com/community/file/1597821544420498783/portfolio-presentation-template-built-to-land-offers"
buttonLabel: "Figma"
```

### Resource 2: Design Directory

```
id: "design-directory"
badge: { text: "Live", variant: "live" }
mediaDefault: "/OS_our-links/images/design-directory-01.mp4"  → copy to /public/images/resources/design-directory-01.mp4
mediaType: "video"
imageHover: "/OS_our-links/images/design-directory-02.jpg"    → copy to /public/images/resources/design-directory-02.jpg
title: "Design Directory"
description: "All of our favorite design tools in one interactive directory. Open-source and ready to adapt for your own creative workflow."
href: "https://design-directory-blue.vercel.app/"
buttonLabel: "Website"
```

### Resource 3: Brand Design System

```
id: "brand-design-system"
badge: { text: "Live", variant: "live" }
mediaDefault: "/OS_our-links/images/brand-design-system-01.jpg"  → copy to /public/images/resources/brand-design-system-01.jpg
mediaType: "image"
imageHover: "/OS_our-links/images/brand-design-system-02.jpg"    → copy to /public/images/resources/brand-design-system-02.jpg
title: "Brand Design System"
description: "Comprehensive design system optimized for brand identity in the AI era. Fully configurable with connected variables and ready to customize."
href: "https://www.figma.com/community/file/1618448560463755361"
buttonLabel: "Figma"
```

### Resource 4: Linktree Template

```
id: "linktree-template"
badge: { text: "Live", variant: "live" }
mediaDefault: "/OS_our-links/images/linktree-template-01.jpg"  → copy to /public/images/resources/linktree-template-01.jpg
mediaType: "image"
imageHover: "/OS_our-links/images/linktree-template-02.jpg"    → copy to /public/images/resources/linktree-template-02.jpg
title: "Linktree Template"
description: "A beautiful, customizable link portal template built with Next.js. Open-source and ready to adapt for your own brand."
href: "https://github.com/opensesh/linktree-alternative"
buttonLabel: "GitHub"
```

### Resource 5: KARIMO

```
id: "karimo"
badge: { text: "Live", variant: "live" }
mediaDefault: "/OS_our-links/images/karimo-01.jpg"  → copy to /public/images/resources/karimo-01.jpg
mediaType: "image"
imageHover: "/OS_our-links/images/karimo-02.jpg"    → copy to /public/images/resources/karimo-02.jpg
title: "KARIMO"
description: "A framework and Claude Code plug-in for PRD-driven autonomous development. Think of it as plan mode on steroids."
href: "https://github.com/opensesh/KARIMO"
buttonLabel: "GitHub"
```

---

## Asset Copy Instructions

The source images/video live in the `OS_our-links` repo. Their current paths in the source component use `/OS_our-links/images/` (a local dev convention for that repo's public folder).

**Source directory:** `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/`

**Note:** If the `public/images/` directory doesn't exist in OS_our-links (the glob returned no results), check `public/` directly. The files should be served from that repo's `public/` folder. The asset filenames referenced in the component are:

```
portfolio-01.jpg
portfolio-02.jpg
design-directory-01.mp4
design-directory-02.jpg
brand-design-system-01.jpg
brand-design-system-02.jpg
linktree-template-01.jpg
linktree-template-02.jpg
karimo-01.jpg
karimo-02.jpg
```

**Destination directory:** `/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/resources/`

To locate source files, look in:
1. `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/` (check subdirectories)
2. `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/`
3. `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/OS_our-links/images/` (if the repo serves from a subdirectory)

Use `ls` to find the actual location before copying. Do not assume the path — verify it exists first.

Copy all 10 files (9 images + 1 MP4 video) to `/public/images/resources/` in the portfolio project.

---

## Expected FreeResource Type (from T002)

After T002 completes, `/src/types/free-resources.ts` will export:

```typescript
export type ResourceBadge = 'live' | 'coming-soon';

export interface ResourceMedia {
  type: 'image' | 'video';
  src: string;
}

export interface FreeResource {
  id: string;
  badge: ResourceBadge;    // simple string union — NOT an object
  media: ResourceMedia;
  hoverImage?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}
```

**Critical:** `badge` is a plain string (`'live' | 'coming-soon'`), NOT an object `{ text, variant }`. Use the string form in all data records. The badge text displayed in the UI ("Live" / "Coming Soon") is derived by the component, not stored in data.

---

## Target Data File

Create `/src/data/free-resources.ts` with the following content structure:

```typescript
import { FreeResource } from "@/types/free-resources";

export const freeResources: FreeResource[] = [
  {
    id: "portfolio",
    badge: "live",
    media: { src: "/images/resources/portfolio-01.jpg", type: "image" },
    hoverImage: "/images/resources/portfolio-02.jpg",
    title: "Portfolio Template",
    description: "Our co-founder's portfolio that helped him land jobs at Google, Salesforce, and other Fortune 500 companies. Open source and ready to customize",
    href: "https://www.figma.com/community/file/1597821544420498783/portfolio-presentation-template-built-to-land-offers",
    buttonLabel: "Figma",
  },
  {
    id: "design-directory",
    badge: "live",
    media: { src: "/images/resources/design-directory-01.mp4", type: "video" },
    hoverImage: "/images/resources/design-directory-02.jpg",
    title: "Design Directory",
    description: "All of our favorite design tools in one interactive directory. Open-source and ready to adapt for your own creative workflow.",
    href: "https://design-directory-blue.vercel.app/",
    buttonLabel: "Website",
  },
  {
    id: "brand-design-system",
    badge: "live",
    media: { src: "/images/resources/brand-design-system-01.jpg", type: "image" },
    hoverImage: "/images/resources/brand-design-system-02.jpg",
    title: "Brand Design System",
    description: "Comprehensive design system optimized for brand identity in the AI era. Fully configurable with connected variables and ready to customize.",
    href: "https://www.figma.com/community/file/1618448560463755361",
    buttonLabel: "Figma",
  },
  {
    id: "linktree-template",
    badge: "live",
    media: { src: "/images/resources/linktree-template-01.jpg", type: "image" },
    hoverImage: "/images/resources/linktree-template-02.jpg",
    title: "Linktree Template",
    description: "A beautiful, customizable link portal template built with Next.js. Open-source and ready to adapt for your own brand.",
    href: "https://github.com/opensesh/linktree-alternative",
    buttonLabel: "GitHub",
  },
  {
    id: "karimo",
    badge: "live",
    media: { src: "/images/resources/karimo-01.jpg", type: "image" },
    hoverImage: "/images/resources/karimo-02.jpg",
    title: "KARIMO",
    description: "A framework and Claude Code plug-in for PRD-driven autonomous development. Think of it as plan mode on steroids.",
    href: "https://github.com/opensesh/KARIMO",
    buttonLabel: "GitHub",
  },
];
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/src/data/free-resources.ts` exists and exports a `freeResources` array of 5 `FreeResource` objects
- [ ] All 5 records have complete required fields with no `undefined` values
- [ ] All image/video assets copied to `/public/images/resources/` (10 files total: 9 images + 1 MP4)
- [ ] All `media.src` and `hoverImage` paths reference `/images/resources/` (not `/OS_our-links/` or any external URL)
- [ ] All `href` values are valid `https://` URLs
- [ ] The `design-directory` resource has `media.type: "video"` and the `.mp4` file is present in `/public/images/resources/`
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/free-resources.ts` | create | Export `freeResources` array typed as `FreeResource[]` |
| `public/images/resources/portfolio-01.jpg` | create (copy) | Portfolio template default media |
| `public/images/resources/portfolio-02.jpg` | create (copy) | Portfolio template hover media |
| `public/images/resources/design-directory-01.mp4` | create (copy) | Design directory default video |
| `public/images/resources/design-directory-02.jpg` | create (copy) | Design directory hover image |
| `public/images/resources/brand-design-system-01.jpg` | create (copy) | Brand design system default media |
| `public/images/resources/brand-design-system-02.jpg` | create (copy) | Brand design system hover media |
| `public/images/resources/linktree-template-01.jpg` | create (copy) | Linktree template default media |
| `public/images/resources/linktree-template-02.jpg` | create (copy) | Linktree template hover media |
| `public/images/resources/karimo-01.jpg` | create (copy) | KARIMO default media |
| `public/images/resources/karimo-02.jpg` | create (copy) | KARIMO hover media |

### File Ownership Notes

- `src/types/free-resources.ts` is owned by T002. Do NOT modify it here.
- The `OS_our-links` repo is read-only for this task — copy assets from it, do not modify it.

---

## Implementation Guidance

### Step 1: Verify Source Assets Exist (required before proceeding)

**Do not skip this step.** Before writing any TypeScript or copying any files, verify the source directory exists and contains the expected assets:

```bash
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/
```

The reviewer confirmed these 10 files exist at that exact flat path:
- `portfolio-01.jpg`, `portfolio-02.jpg`
- `design-directory-01.mp4`, `design-directory-02.jpg`
- `brand-design-system-01.jpg`, `brand-design-system-02.jpg`
- `linktree-template-01.jpg`, `linktree-template-02.jpg`
- `karimo-01.jpg`, `karimo-02.jpg`

If `ls` returns results confirming these files are present, proceed. If the directory doesn't exist or files are missing, check these fallback paths:
1. `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/`
2. `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/OS_our-links/images/`

Do not assume the path — verify it first.

### Step 2: Create Destination Directory

```bash
mkdir -p /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/resources
```

### Step 3: Copy Assets

Copy each file individually (or use a glob copy). Example for one file:
```bash
cp "/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/portfolio-01.jpg" \
   "/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/resources/portfolio-01.jpg"
```

For the MP4 video:
```bash
cp "/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/design-directory-01.mp4" \
   "/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/resources/design-directory-01.mp4"
```

### Step 4: Create the Data File

Use the TypeScript data file structure shown above. Import type from T002's output.

### Type Adapter Pattern

If T002's `FreeResource` type uses different field names than what's documented here (e.g., `defaultMedia` vs `media`), adapt the data file to match the actual exported type. The source of truth for types is `src/types/free-resources.ts` after T002 runs.

### Edge Cases

- The video file (`design-directory-01.mp4`) may be large. Copy it as-is — do not compress or re-encode.
- If any source file is missing from the `OS_our-links` repo, note it in the PR description and use a placeholder path. Do not skip the record.
- All `href` values point to external URLs (Figma community, GitHub, Vercel) — they should all use `https://`.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/types/free-resources.ts` (owned by T002)
- Any files in `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/` (read-only source)

### Files Requiring Review

- `package.json` — do not modify

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads project/blog images (not directly required for this task, but confirms the `/public/images/` structure is in place) | Verify `/public/images/` directory exists |
| T002 | `FreeResource` type in `src/types/free-resources.ts` | Verify `src/types/free-resources.ts` exists and exports `FreeResource` |

### Downstream Impact

Tasks that depend on this one:
- **T012** — Builds `FreeResourceCard` and `FreeResourcesGrid` components that consume `freeResources`
- **T017** — Validates image paths and external hrefs in the data file

**Before starting:** Confirm T002 is complete and `src/types/free-resources.ts` exports `FreeResource`. If the type doesn't exist yet, you cannot complete this task.

---

## GitHub Context

**Issue:** T007 (to be created)
**Branch:** `worktree/framer-cms-migration-T007`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

```
feat(resources): copy free resource assets from OS_our-links

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
feat(resources): create free-resources data file with 5 records

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] `npm run lint` passes
- [ ] All 10 asset files present in `public/images/resources/`
- [ ] `src/data/free-resources.ts` has 5 complete records
- [ ] No `/OS_our-links/` paths in the data file
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T007 | Wave: 2_
