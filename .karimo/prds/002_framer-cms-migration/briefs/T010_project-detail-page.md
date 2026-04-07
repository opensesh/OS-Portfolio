# Task Brief: T010

**Title:** Update project detail page to render enriched schema
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 7/10
**Model:** opus
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace the current placeholder-only project detail view with a fully rendered case study layout. The enriched project schema (added by Wave 2 task T005) includes structured sections, gallery images, testimonials, and results — this task wires those fields into the `ProjectDetail` component and its sub-components.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

The current `src/components/projects/project-detail.tsx` renders mostly placeholder content:
- Hero image is commented out behind a placeholder div
- Gallery images are placeholder divs
- Challenge/Solution sections use lorem ipsum text
- No testimonials block, no results block, no services list, no CTA button, no duration

Wave 2 task T005 has enriched the `Project` type and populated all 5 project data records with:
- `sections: ProjectSection[]` — Challenge, Solution, Impact (each with `heading`, `headline`, `body`)
- `images: ProjectImage[]` — hero + gallery images in `/public/images/projects/{slug}/`
- `testimonials?: ProjectTestimonial[]` — optional, only Iterra has one
- `results?: string[]` — optional, BILTFOUR, NEXT, Universal Audio have them
- `services: string[]`
- `duration?: string`
- `buttonText?: string`
- `buttonHref?: string`
- `categories: string[]` (replaces `category`)

This task builds the rendering components to display all of that data. All 5 project detail pages must render correctly: `/projects/iterra`, `/projects/biltfour`, `/projects/google-cloud-next`, `/projects/google-gemini-infinite-nature`, `/projects/universal-audio`.

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. Update `ProjectDetail` component (`src/components/projects/project-detail.tsx`)

The component receives `{ project, prevProject, nextProject }`. Update it to:

- **Hero image:** Uncomment and use `next/image` with `fill` on the hero image. Find the hero image from `project.images.find(img => img.context === 'hero')`. Use `priority` since it's above the fold.
- **Categories in meta:** Replace `project.category` with `project.categories.map(c => categoryLabel(c)).join(" / ")`. Import `categoryLabel` from `@/data/categories`.
- **Services sidebar:** Replace `project.tags.map(tag => tag)` with `project.services.map(service => service)`.
- **Duration in sidebar:** Add a Duration row if `project.duration` is present.
- **Sections:** Replace lorem ipsum placeholder blocks with a loop over `project.sections`. Each section renders: heading (h2), headline (bold intro), body text, then the section's gallery images.
- **Gallery images:** Images are grouped by `section` context. For the Challenge section, render images where `image.section === 'challenge'`; Solution where `image.section === 'solution'`; Impact where `image.section === 'impact'`. Gallery images use `next/image` with explicit `width`/`height` or `fill` inside a sized container.
- **Testimonial block:** If `project.testimonials && project.testimonials.length > 0`, render a blockquote-style testimonial section.
- **Results block:** If `project.results && project.results.length > 0`, render a results/metrics list.
- **CTA button:** If `project.buttonText && project.buttonHref`, render a button linking to the external URL (`target="_blank"`, `rel="noopener noreferrer"`). Use the existing `Button` component from `@/components/shared/button`.

### 2. Create sub-components

Create these new files. Keep them focused — each renders one concern:

**`src/components/projects/project-section.tsx`**
```typescript
interface ProjectSectionProps {
  section: ProjectSection;  // from @/types/project
  images: ProjectImage[];   // images for this section
}
```
Renders: section heading, headline, body text, then images below.

**`src/components/projects/project-gallery.tsx`**
```typescript
interface ProjectGalleryProps {
  images: ProjectImage[];
  layout?: "single" | "grid-2";  // default "single" if 1 image, "grid-2" if 2+
}
```
Renders a responsive image layout using `next/image`. Use `aspect-[16/9]` containers for landscape images, `aspect-[4/3]` for general gallery.

**`src/components/projects/project-testimonial.tsx`**
```typescript
interface ProjectTestimonialProps {
  testimonials: ProjectTestimonial[];  // from @/types/project
}
```
Renders a blockquote with quote, author name, and role.

**`src/components/projects/project-results.tsx`**
```typescript
interface ProjectResultsProps {
  results: string[];
}
```
Renders a metrics list — each result as a callout item.

### 3. Update `src/app/projects/[slug]/page.tsx`

No structural changes needed. Verify the page still calls `<ProjectDetail project={project} prevProject={prevProject} nextProject={nextProject} />` correctly.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 5 project detail pages render without errors (`/projects/iterra`, `/projects/biltfour`, `/projects/google-cloud-next`, `/projects/google-gemini-infinite-nature`, `/projects/universal-audio`)
- [ ] Hero image renders using `next/image` (not a placeholder div)
- [ ] Challenge, Solution, and Impact sections display with correct heading text and body copy from `project.sections`
- [ ] Gallery images render using `next/image` with proper aspect ratio containers (no layout shift)
- [ ] Testimonial block renders on Iterra project page; absent (no empty block) on the other 4
- [ ] Results block renders on BILTFOUR, NEXT, and Universal Audio pages; absent on Iterra and Infinite Nature
- [ ] Services list in sidebar uses `project.services`, not `project.tags`
- [ ] CTA button renders with `project.buttonText` and links to `project.buttonHref` in a new tab
- [ ] Categories displayed in meta use display labels (from `categoryLabel()`), not raw slugs
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/projects/project-detail.tsx` | modify | Wire up enriched data, enable images, add sections/testimonial/results/CTA |
| `src/components/projects/project-section.tsx` | create | Renders one structured section (heading + headline + body + images) |
| `src/components/projects/project-gallery.tsx` | create | Responsive image grid using next/image |
| `src/components/projects/project-testimonial.tsx` | create | Blockquote testimonial block |
| `src/components/projects/project-results.tsx` | create | Metrics/results list |

### File Ownership Notes

`project-detail.tsx` is the only existing component touched here. The new sub-components are net-new files. T009 also touches `project-detail.tsx` to change `{project.category}` → joined category labels. **T010 should run after T009 completes** to avoid merge conflicts on this file. T009 owns the category rendering change; T010 owns the full layout enhancement. If T009 has already made the category change, T010 should incorporate it (not overwrite it).

---

## Implementation Guidance

### Patterns to Follow

- **Existing component structure:** `project-detail.tsx` uses `motion` from framer-motion with `staggerContainer`/`fadeInUp` variants from `@/lib/motion`. Follow the same pattern for any new animated sections.
- **next/image fill pattern:** The codebase uses `fill` with a sized parent container:
  ```tsx
  <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden">
    <Image src={img.src} alt={img.alt} fill className="object-cover" />
  </div>
  ```
- **Badge component:** Use `<Badge type="color" color="gray" size="md">` from `@/components/uui/base/badges/badges` for service tags (same as current `project.tags` rendering).
- **Button component:** Use `<Button href={project.buttonHref} variant="brand" target="_blank" rel="noopener noreferrer">` from `@/components/shared/button`.
- **ArrowLeft/ArrowRight:** Import from `@untitledui-pro/icons/line` (already imported in project-detail.tsx).

### Code Style

- Kebab-case filenames: `project-section.tsx`, `project-gallery.tsx`, etc.
- Use semantic Tailwind classes: `bg-bg-secondary`, `text-fg-primary`, `border-border-secondary`
- No raw `bg-[var(--...)]` or opacity modifiers like `/30` on CSS vars
- Component props interfaces are co-located in the same file

### Graceful Fallback Pattern

All optional fields must be guarded:
```tsx
{project.testimonials && project.testimonials.length > 0 && (
  <ProjectTestimonial testimonials={project.testimonials} />
)}

{project.results && project.results.length > 0 && (
  <ProjectResults results={project.results} />
)}

{project.buttonText && project.buttonHref && (
  <Button href={project.buttonHref} target="_blank" rel="noopener noreferrer">
    {project.buttonText}
  </Button>
)}
```

### Section/Image Relationship

Images in `project.images` have an optional `section` field:
- `context: 'hero'` — the cover/thumbnail image (1 per project)
- `context: 'gallery'`, `section: 'challenge'` — images that accompany the Challenge section
- `context: 'gallery'`, `section: 'solution'` — images that accompany the Solution section
- `context: 'gallery'`, `section: 'impact'` — images for the Impact section
- `context: 'mockup'` — may or may not have a section

When rendering `ProjectSection`, filter images: `images.filter(img => img.section === sectionKey)` where `sectionKey` is derived from the section heading (e.g., "The Challenge" → "challenge").

### Hero Image

The hero image is: `project.images.find(img => img.context === 'hero')`.
If no hero image is found (shouldn't happen after T005, but guard anyway), fall back to `project.thumbnail`.

### Testimonial Layout

Render as a full-width pullquote section with a left border accent:
```
| "Quote text here in large italic type."
|
| — Author Name, Role
```
Use `border-l-4 border-bg-brand-solid pl-8` for the visual treatment.

### Results Layout

Each result string in `project.results` is a metric like "40% increase in brand recognition". Render them as a row of stat cards or a simple bulleted list with large bold numbers when a numeric value is present.

### Edge Cases

- A project may have no images for a particular section — `ProjectGallery` should render nothing if `images.length === 0`
- `project.duration` is optional — only render the Duration sidebar row if it exists
- `project.tags` still exists on the type (T005 adds new fields, may not remove old ones) — use `project.services` for the sidebar, not `project.tags`

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `package.json` — no new packages needed; `next/image` is part of Next.js
- `next.config.ts` — do not touch; images are local (no remote domain config needed)
- `tsconfig.json` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T005 | Enriched `Project` type + populated project data in `src/data/projects.ts` with `sections[]`, `images[]`, `testimonials?`, `results?`, `services[]`, `duration`, `buttonText`, `buttonHref` | Check `src/types/project.ts` exports `ProjectSection`, `ProjectImage`, `ProjectTestimonial` interfaces and `Project.sections` field |
| T009 | `categoryLabel()` helper in `src/data/categories.ts` | Check that `src/data/categories.ts` exists and exports `categoryLabel` |

### Downstream Impact

Tasks that depend on this one:
- **T016** (Wave 4) — SEO metadata generation — depends on project detail pages rendering correctly

**Before starting:** Verify T005 and T009 are complete:
```
grep "sections:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/types/project.ts
grep "categoryLabel" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/categories.ts
```

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T010`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
feat(projects): render enriched case study layout with sections, gallery, and testimonials

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Type check: no TypeScript errors in build output
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified
- [ ] No `project.category` (singular) references remain in project-detail.tsx
- [ ] All 5 project detail routes tested (mentally traced or build verified)
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T010 | Wave: 3_
