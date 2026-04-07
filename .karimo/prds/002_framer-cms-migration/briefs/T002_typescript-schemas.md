# Task Brief: T002

**Title:** Define enriched TypeScript schemas for all content types
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation)

---

## Objective

Enrich and extend the TypeScript type definitions in `src/types/` to support the full Framer CMS data model: enriched Project with sections/images/testimonials/results, updated BlogPost with `contentPath`, new Playbook type, new FreeResource types. Install `next-mdx-remote` for the MDX pipeline. Ensure `npm run build` passes after all type changes by updating any existing data files that reference changed types.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The codebase has two type files today:

- `src/types/project.ts` — defines `Project`, `ProjectCategory` (enum), `ViewMode`
- `src/types/blog.ts` — defines `BlogPost`, `BlogCategory` (enum)

There is no `src/types/index.ts` barrel export file.

The current `Project` type uses a single `category: ProjectCategory` field (one of four hardcoded values) and has no fields for sections, gallery images, testimonials, results, or services. The Framer CMS data has all of these.

The current `BlogPost` type embeds content as a `content: string` field. The migration plan replaces this with `contentPath: string` (pointing to an MDX file). This is a breaking change — the existing `src/data/blog.ts` file must also be updated to remove the `content` field and add `contentPath`.

The current `BlogCategory` union (`"Design" | "AI" | "Process" | "Insights"`) does not match the actual Framer post categories. It must be replaced with the correct values.

No MDX rendering library is currently installed. `next-mdx-remote` must be added as a dependency.

This task is part of **Wave 1** — the foundation phase. T005 (project data), T006 (blog MDX), T007 (free resources), T008 (legal), and T013 (playbooks) all depend on the types defined here.

---

## Research Context

### Current Type Files (Exact Content)

**`src/types/project.ts` (current):**
```typescript
export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;  // ← REMOVE this field
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}

export type ProjectCategory =
  | "Brand Identity"
  | "Digital Design"
  | "Art Direction"
  | "Strategy";

export const projectCategories: ProjectCategory[] = [
  "Brand Identity",
  "Digital Design",
  "Art Direction",
  "Strategy",
];

export type ViewMode = "carousel" | "two-column" | "grid";
```

**`src/types/blog.ts` (current):**
```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;  // ← REMOVE this field
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

export type BlogCategory = "Design" | "AI" | "Process" | "Insights";

export const blogCategories: BlogCategory[] = [
  "Design",
  "AI",
  "Process",
  "Insights",
];
```

### Current Data Files That Reference These Types

**`src/data/projects.ts`** — imports `Project` from `@/types/project`. Uses `category: "Brand Identity"` etc. — this will become `categories: string[]`. You must update this file to match the new schema so `npm run build` passes.

**`src/data/blog.ts`** — imports `BlogPost` from `@/types/blog`. Uses `content: string` embedded markdown. You must update this file to remove `content` and add `contentPath`. The actual MDX files don't exist yet (T003/T006 create them) — use a placeholder path like `"blog/placeholder.mdx"` for now.

### Components That Use `ProjectCategory`

Search these locations for `ProjectCategory` or `.category` references before finalizing:
- `src/app/projects/page.tsx` — likely uses `projectCategories` for filter tabs
- `src/app/projects/[slug]/page.tsx` — likely renders `project.category`
- Any component that imports from `@/types/project`

**Action:** Update any component that reads `project.category` (singular string) to read `project.categories` (string array). This is a breaking change — do not leave it for a later task or `npm run build` will fail.

### Known Issues to Address

- The `category` → `categories` rename is a breaking change across data files and components. Audit all usages before committing.
- `BlogCategory` values are being completely replaced — any component that hardcodes the old values (`"Design"`, `"AI"`, etc.) must be updated.
- `next-mdx-remote` latest version as of 2026 should be compatible with Next.js 16. Verify by checking the npm page or README before installing.

---

## Requirements

### 1. Update `src/types/project.ts`

Replace the existing file with the enriched schema. Keep `ViewMode` export — it is used by the project listing page.

```typescript
// TEMPLATE: replace with your content

export interface ProjectSection {
  heading: string;     // e.g. "The Challenge"
  headline: string;    // Bold intro sentence
  body: string;        // Full paragraph
}

export interface ProjectImage {
  src: string;         // e.g. /images/projects/iterra/filename.jpg
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  // --- enriched fields ---
  categories: string[];           // replaces single category enum
  services: string[];
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}

// Keep for backwards compat — old enum no longer used on Project
// but may still be used in filter UI until T009 replaces it
export type ProjectCategory =
  | "Brand Identity"
  | "Digital Design"
  | "Art Direction"
  | "Strategy";

export const projectCategories: ProjectCategory[] = [
  "Brand Identity",
  "Digital Design",
  "Art Direction",
  "Strategy",
];

export type ViewMode = "carousel" | "two-column" | "grid";
```

**Note:** Keep `ProjectCategory` and `projectCategories` temporarily to avoid breaking the filter UI — T009 will remove them in Wave 3.

### 2. Update `src/types/blog.ts`

```typescript
// TEMPLATE: replace with your content

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "blog/ep02-creative-ai-framework.mdx"
  content?: string;      // BRIDGE: optional empty string kept by T006 to prevent blog-post.tsx crash before T011 lands; T011 removes it
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

export type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';

export const blogCategories: BlogCategory[] = [
  'Creative Philosophy',
  'About Us',
  'Digital Design',
  'Design Strategy',
  'Brand Identity',
];
```

### 3. Create `src/types/playbook.ts`

```typescript
// TEMPLATE: replace with your content

export interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "playbooks/slug.mdx"
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
}
```

### 4. Create `src/types/free-resources.ts`

```typescript
// TEMPLATE: replace with your content

export type ResourceBadge = 'live' | 'coming-soon';

export interface ResourceMedia {
  type: 'image' | 'video';
  src: string;
}

export interface FreeResource {
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

### 5. Create `src/types/index.ts`

**This file does not yet exist — create it.** `src/types/` currently only has `blog.ts` and `project.ts`. The barrel export collects all four type files:

```typescript
export * from './project';
export * from './blog';
export * from './playbook';
export * from './free-resources';
```

Verify all four files exist before writing this barrel export (i.e., confirm `playbook.ts` and `free-resources.ts` were created in steps 3 and 4 above).

### 6. Update `src/data/projects.ts` to match new schema

The existing `projects.ts` uses `category: "Brand Identity"` — this will cause a TypeScript error once `category` is removed from the `Project` interface. Update each project to use `categories: string[]` and add stub values for required new fields (`sections: []`, `images: []`, `services: []`). Actual content will be populated in T005.

Example minimal stub for each project:
```typescript
{
  id: "iterra",
  slug: "iterra",
  title: "Iterra",
  client: "Iterra",
  year: "2025",
  industry: "Technology",
  description: "...",
  thumbnail: "/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg",
  featured: true,
  tags: ["Logo", "Visual Identity", "Guidelines"],
  // new required fields
  categories: ["brand-identity"],
  services: [],
  sections: [],
  images: [],
}
```

### 7. Update `src/data/blog.ts` to match new schema

Remove the `content: string` embedded markdown from each post. Add `contentPath: string` with a placeholder path. Update `category` values to match the new `BlogCategory` union.

Example:
```typescript
{
  id: "ep02-creative-ai-framework",
  slug: "ep02-creative-ai-framework",
  title: "EP02: Creative AI Framework",
  excerpt: "...",
  contentPath: "blog/ep02-creative-ai-framework.mdx",  // file created in T006
  author: { name: "Karim Bouhdary" },
  date: "2026-02-03",
  category: "Creative Philosophy",
  thumbnail: "/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg",
  readingTime: "5 min read",
  featured: true,
}
```

**Replace all 3 existing placeholder posts** with the 4 real posts from Framer (see Research Context for slugs/dates).

### 8. Install `next-mdx-remote`

```bash
npm install next-mdx-remote
```

Verify compatibility: `next-mdx-remote` v4+ supports Next.js App Router. Check that the installed version does not conflict with React 19 (it should be fine). Do not modify `package-lock.json` directly — let npm manage it.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/types/project.ts` exports `Project`, `ProjectSection`, `ProjectImage`, `ProjectTestimonial`, `ViewMode`
- [ ] `Project.category` field removed; `Project.categories: string[]` present
- [ ] `src/types/blog.ts` exports `BlogPost` with `contentPath` field (no `content` field)
- [ ] `BlogCategory` union includes `'Creative Philosophy'`, `'About Us'`, `'Digital Design'`
- [ ] `src/types/playbook.ts` exists and exports `Playbook`
- [ ] `src/types/free-resources.ts` exists and exports `FreeResource`, `ResourceBadge`, `ResourceMedia`
- [ ] `src/types/index.ts` barrel exports all four type files
- [ ] `src/data/projects.ts` updated — no TypeScript errors (uses `categories` not `category`)
- [ ] `src/data/blog.ts` updated — no TypeScript errors (uses `contentPath` not `content`)
- [ ] `next-mdx-remote` appears in `package.json` dependencies
- [ ] `npm run build` passes with no TypeScript errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/types/project.ts` | modify | Add ProjectSection, ProjectImage, ProjectTestimonial; replace category with categories |
| `src/types/blog.ts` | modify | Replace content with contentPath; expand BlogCategory union |
| `src/types/playbook.ts` | create | New Playbook type |
| `src/types/free-resources.ts` | create | New FreeResource, ResourceBadge, ResourceMedia types |
| `src/types/index.ts` | create (file does not yet exist) | Barrel export for all four type files |
| `src/data/projects.ts` | modify | Update to use categories[] and stub new required fields |
| `src/data/blog.ts` | modify | Replace content with contentPath; update categories and slugs to Framer data |
| `package.json` | modify | Add next-mdx-remote dependency |

### File Ownership Notes

`src/data/projects.ts` is also touched by T005, which fully populates project data. This task only stubs the new required fields — T005 will overwrite the data section. No conflict expected because this task runs first (Wave 1) and T005 runs in Wave 2.

`src/data/blog.ts` is also touched by T006 (blog MDX migration). Same pattern — this task stubs the contentPath and updates metadata; T006 provides actual MDX files.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `package.json` — modified to add `next-mdx-remote` (expected; review before committing)

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T005** — project data migration (needs enriched Project type)
- **T006** — blog MDX migration (needs BlogPost with contentPath)
- **T007** — free resources data (needs FreeResource type)
- **T008** — legal pages (needs T002 + T003)
- **T013** — playbook scaffolding (needs Playbook type)

---

## GitHub Context

**Branch:** `worktree/framer-cms-migration-T002`
**Target:** feature branch `feat/framer-cms-migration` or main (determined by PM Agent)

---

## Commit Guidelines

```
refactor(types): enrich TypeScript schemas for CMS migration

- Add ProjectSection, ProjectImage, ProjectTestimonial interfaces
- Replace Project.category enum with categories string[]
- Replace BlogPost.content with contentPath for MDX
- Expand BlogCategory union with Creative Philosophy, About Us, Digital Design
- Add Playbook and FreeResource types
- Create src/types/index.ts barrel export
- Update data stubs to match new schemas
- Install next-mdx-remote

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes with no errors
- [ ] No `never_touch` files modified
- [ ] All new type files have `// TEMPLATE: replace with your content` comment at top

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T002 | Wave: 1_
