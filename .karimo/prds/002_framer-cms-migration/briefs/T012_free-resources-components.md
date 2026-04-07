# Task Brief: T012

**Title:** Create free resources data structure and card component
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Build the `FreeResourceCard` and `FreeResourcesGrid` components that render the 5 free resources (Portfolio Template, Design Directory, Brand Design System, Linktree Template, KARIMO) using the data structure provided by Wave 2 task T007. These components will be used in the Lab page (Wave 4, T015) and potentially on the homepage.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Reference Implementation (OS_our-links)

There is an existing `FreeResources.tsx` component in the OS_our-links project at `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/src/components/FreeResources.tsx`. Use it as a **reference for the card pattern**, but do NOT copy it verbatim. That component:
- Uses custom CSS variables from a different design system (`var(--color-vanilla)`)
- Has mobile pagination and a subscribe modal gate (not needed here)
- Uses `<img>` instead of `next/image`
- Has a complex desktop reordering (Brand Design System spanning full width)

The new components for OS-Portfolio must:
- Use `next/image` for all image media
- Use the OS-Portfolio design system (mapped Tailwind classes: `bg-bg-secondary`, `text-fg-primary`, etc.)
- Be typed against the `FreeResource` interface from `@/types/free-resources`
- Have no subscription gate — CTA button links directly to `href` in a new tab
- Be simple and composable — no built-in pagination (that's the Lab page's concern)

### Wave 2 outputs (T007)

T007 has created:
- `src/data/free-resources.ts` exporting `freeResources: FreeResource[]` with 5 records
- `src/types/free-resources.ts` exporting `FreeResource`, `ResourceBadge`, `ResourceMedia`
- All image assets copied to `public/images/resources/` with these filenames:
  - `portfolio-01.jpg`, `portfolio-02.jpg`
  - `design-directory-01.mp4`, `design-directory-02.jpg`
  - `brand-design-system-01.jpg`, `brand-design-system-02.jpg`
  - `linktree-template-01.jpg`, `linktree-template-02.jpg`
  - `karimo-01.jpg`, `karimo-02.jpg`

### FreeResource type (from T002/T007)

```typescript
type ResourceBadge = "live" | "coming-soon";

interface ResourceMedia {
  type: "image" | "video";
  src: string;
}

interface FreeResource {
  id: string;
  badge: ResourceBadge;
  media: ResourceMedia;
  hoverImage?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}
```

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. Create `src/components/resources/free-resource-card.tsx`

A single card component that renders one `FreeResource`. Props:

```typescript
interface FreeResourceCardProps {
  resource: FreeResource;
}
```

**Card structure:**
1. **Media area** (top): fixed-height container (`h-48` or `aspect-[4/3]`) with `overflow-hidden bg-bg-tertiary`
   - If `media.type === "image"`: use `next/image` with `fill`, `object-cover`. On hover, crossfade to `hoverImage` if it exists.
   - If `media.type === "video"`: use a plain `<video>` tag with `autoPlay muted loop playsInline` and `object-cover`. Hover image overlay uses `next/image` if `hoverImage` exists.
2. **Badge**: positioned `absolute top-3 right-3` inside the media area. Two variants: "live" (green accent) and "coming-soon" (muted).
3. **Content area** (below media):
   - Title: `text-fg-primary font-accent` uppercase tracking
   - Description: `text-fg-secondary` with `line-clamp-3`
   - CTA button: opens `resource.href` in a new tab. Use `resource.buttonLabel` as the text. Style as an inline text link with external arrow icon, or use the shared `Button` component with `variant="ghost"`.

**Hover interaction:**
- On hover, if `hoverImage` is present, crossfade from `media.src` to `hoverImage` using `AnimatePresence` or a simple CSS opacity transition. Use `motion.div` from `framer-motion` — it is already a project dependency.
- Subtle scale on the media container: `group-hover:scale-105` transition on the inner image container.

**For video media:**
- Use `<video>` tag (cannot use `next/image` for video)
- The hover image overlay is a `next/image` rendered on top with `absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`

### 2. Create `src/components/resources/free-resources-grid.tsx`

A grid wrapper that maps over resources.

```typescript
import { freeResources } from "@/data/free-resources";
import { FreeResourceCard } from "./free-resource-card";

export function FreeResourcesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {freeResources.map((resource) => (
        <FreeResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
```

Keep `FreeResourcesGrid` simple — it just maps and passes data. The Lab page (T015) will handle section headers and layout context.

### 3. Badge styling

Two badge variants, rendered as a small pill:

```tsx
function ResourceBadgeChip({ badge }: { badge: ResourceBadge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5",
        "font-accent text-xs uppercase tracking-wider",
        badge === "live"
          ? "bg-green-500/20 text-green-400"   // or use a semantic color if available
          : "bg-bg-secondary text-fg-tertiary"
      )}
    >
      {badge === "live" ? "Live" : "Coming Soon"}
    </span>
  );
}
```

Note: if the design system has a semantic color for success/green, prefer it. Otherwise use the Tailwind `green-*` utility — this is acceptable for a badge accent.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `FreeResourceCard` renders image media correctly using `next/image` with `fill` inside a sized container
- [ ] `FreeResourceCard` renders video media with `autoPlay muted loop playsInline` attributes (no `controls`)
- [ ] Badge displays "Live" or "Coming Soon" with appropriate styling (green for live, muted for coming-soon)
- [ ] CTA button/link opens `resource.href` in a new tab (`target="_blank" rel="noopener noreferrer"`)
- [ ] Hover state: if `hoverImage` is provided, it becomes visible on hover via opacity transition
- [ ] `FreeResourcesGrid` renders all 5 resource cards in a grid layout
- [ ] All components are typed with `FreeResource` interface — no `any` types
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/resources/free-resource-card.tsx` | create | Single resource card with media, badge, content, CTA |
| `src/components/resources/free-resources-grid.tsx` | create | Grid wrapper mapping over all resources |

### File Ownership Notes

No existing files are modified. These are net-new components. The `src/components/resources/` directory does not yet exist — create it.

---

## Implementation Guidance

### Patterns to Follow

- **Fill-based image pattern** (used throughout the codebase):
  ```tsx
  <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary">
    <Image src={resource.media.src} alt={resource.title} fill className="object-cover" />
  </div>
  ```
- **Hover crossfade** (follow the OS_our-links reference for the concept, but use `framer-motion`):
  ```tsx
  const [isHovered, setIsHovered] = useState(false);
  // ...
  <motion.div
    animate={{ opacity: isHovered ? 0 : 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* default media */}
  </motion.div>
  <motion.div
    className="absolute inset-0"
    animate={{ opacity: isHovered ? 1 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <Image src={resource.hoverImage} alt="" fill className="object-cover" />
  </motion.div>
  ```
- **Project card pattern:** `src/components/projects/project-card.tsx` shows how to handle hover state with magnetic cursor label — reference for overall card structure, not copied verbatim.
- **Kebab-case filenames:** `free-resource-card.tsx`, not `FreeResourceCard.tsx`
- **No inline style props** — use Tailwind mapped classes

### Code Style

- Use `"use client"` directive since the card uses `useState` for hover state
- Use semantic Tailwind: `bg-bg-secondary`, `text-fg-primary`, `border-border-secondary`
- Never `bg-[var(--bg-secondary)]` or opacity modifiers like `/30` on CSS vars
- Import `cn` from `@/lib/utils` for conditional class merging
- Import `motion` from `framer-motion` for hover animations

### Video considerations

`next/image` does not support video. For `media.type === "video"`, use a raw `<video>` tag:
```tsx
<video
  src={resource.media.src}
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
/>
```
The `design-directory` resource uses a video (`design-directory-01.mp4`).

### External links

Always use `target="_blank" rel="noopener noreferrer"` on the CTA button since `resource.href` values are external URLs (Figma, GitHub, Vercel).

### Edge Cases

- If `resource.hoverImage` is undefined, skip the hover image overlay entirely (no empty `<Image>` with undefined src)
- If `media.type` is something unexpected, default to image rendering
- The description field may be long — use `line-clamp-3` to keep cards equal height

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- Files in `src/components/home/` — not in scope for this task

### Files Requiring Review

- `package.json` — no new packages needed; `framer-motion` and `next/image` are already installed
- `next.config.ts` — do not touch; images are local, no domain allowlisting needed
- `tsconfig.json` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | `FreeResource`, `ResourceBadge`, `ResourceMedia` types in `src/types/free-resources.ts` | Check `src/types/free-resources.ts` exists |
| T007 | `src/data/free-resources.ts` with 5 records; image/video assets in `public/images/resources/` | Check that `src/data/free-resources.ts` exists and `public/images/resources/` has files |

### Downstream Impact

Tasks that depend on this one:
- **T015** (Wave 4) — Lab page imports `FreeResourcesGrid`

**Before starting:** Verify dependencies:
```
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/free-resources.ts
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/resources/
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/types/free-resources.ts
```

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T012`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
feat(resources): add FreeResourceCard and FreeResourcesGrid components

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified
- [ ] No `any` types in new component files
- [ ] Video card renders without `controls` attribute
- [ ] CTA button opens in new tab
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T012 | Wave: 3_
