# Task Brief: T009

**Title:** Update category system to multi-tag with canonical slugs
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace the existing single-value `ProjectCategory` enum with a multi-tag string array system using canonical slugs sourced from the Framer CMS CSV. Update the filter UI and type system so a project with multiple categories appears under each applicable filter tab.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

The current codebase uses a single `ProjectCategory` enum in `src/types/project.ts`:

```typescript
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
```

Wave 2 task T005 has already migrated all 5 projects to use `categories: string[]` (replacing `category: ProjectCategory`). This task wires up the data side (canonical slug list + display labels) and updates the filter components so the UI works correctly with the new array-based categories.

The Framer CMS CSV defines these canonical slugs:
- `art-direction`
- `strategy`
- `digital-design`
- `brand-identity`
- `web-design`

This task is part of **Wave 3** — Component Updates. T014 depends on this task.

---

## Requirements

1. Create `/src/data/categories.ts` exporting:
   - A `CATEGORY_SLUGS` const array of the 5 canonical slugs
   - A `Category` type derived from that array (`typeof CATEGORY_SLUGS[number]`)
   - A `CATEGORY_LABELS` record mapping each slug to its display name
   - A `categoryLabel(slug: string): string` helper function

2. Remove `ProjectCategory`, `projectCategories` from `src/types/project.ts`. The `Project` interface must use `categories: string[]` (T005 will have done this, verify it is in place).

3. Update `src/app/projects/page.tsx`:
   - Replace `ProjectCategory | "All"` state type with `string | "All"`
   - Update the filter logic: `projects.filter(p => p.categories.includes(activeFilter))` instead of `p.category === activeFilter`
   - Import filter tab labels from `/src/data/categories.ts` instead of `projectCategories`

4. Update `src/components/projects/project-filters.tsx`:
   - Import `CATEGORY_SLUGS` and `categoryLabel` from `/src/data/categories.ts`
   - Replace `ProjectCategory` type references with `string`
   - Render display names (e.g. "Brand Identity") while filtering by slug (e.g. "brand-identity")
   - The trigger button should show the active filter's display name, not the raw slug

5. Update `src/components/projects/project-card.tsx`:
   - The carousel card and grid card both render `project.category` — change to render `project.categories.join(", ")` or the first category's display label. Use `categoryLabel(project.categories[0])` for the primary display.

6. Update `src/components/projects/project-detail.tsx`:
   - Line 54 renders `{project.category}` — change to render joined category labels: `{project.categories.map(s => categoryLabel(s)).join(" / ")}`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/src/data/categories.ts` exists and exports `CATEGORY_SLUGS`, `Category`, `CATEGORY_LABELS`, and `categoryLabel()`
- [ ] No remaining references to old `ProjectCategory` type in any component files
- [ ] No remaining references to `projectCategories` array in any component files
- [ ] `project.category` (singular) references replaced everywhere with `project.categories` (plural)
- [ ] Project listing filter shows correct projects for each category tab (multi-tag intersection)
- [ ] Projects with multiple categories appear under each applicable filter tab
- [ ] Filter dropdown shows human-readable display names (not raw slugs)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/categories.ts` | create | Canonical slug list, display labels, helper |
| `src/types/project.ts` | modify | Remove `ProjectCategory` enum, verify `categories: string[]` exists |
| `src/app/projects/page.tsx` | modify | Update state type and filter logic |
| `src/components/projects/project-filters.tsx` | modify | Use canonical slugs + display names from categories.ts |
| `src/components/projects/project-card.tsx` | modify | Render `categories` array instead of `category` |
| `src/components/projects/project-detail.tsx` | modify | Render `categories` array in meta line |

### File Ownership Notes

`src/app/projects/page.tsx` is also modified by T014. T009 makes the type/filter-logic change; T014 handles further filter UI refinement. Do not overlap — T009 focuses on the data wiring and type removal; T014 focuses on the filter component tab rendering.

---

## Implementation Guidance

### Patterns to Follow

- Data constants follow the pattern in `src/data/what-we-do.ts` — export a typed const array and a corresponding interface
- Tailwind uses mapped semantic classes: `bg-bg-secondary`, `text-fg-primary`, etc. Never raw CSS vars
- The filter component (`project-filters.tsx`) uses a dropdown pattern with `AnimatePresence` — keep the dropdown structure intact, only change the data source and label rendering

### `src/data/categories.ts` — Reference Implementation

```typescript
// TEMPLATE: replace with your content

export const CATEGORY_SLUGS = [
  "art-direction",
  "strategy",
  "digital-design",
  "brand-identity",
  "web-design",
] as const;

export type Category = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "art-direction": "Art Direction",
  "strategy": "Strategy",
  "digital-design": "Digital Design",
  "brand-identity": "Brand Identity",
  "web-design": "Web Design",
};

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug as Category] ?? slug;
}
```

### Filter Logic Change in `projects/page.tsx`

Current (wrong after T005):
```typescript
const [activeFilter, setActiveFilter] = useState<ProjectCategory | "All">("All");
// ...
return projects.filter((p) => p.category === activeFilter);
```

New (correct):
```typescript
const [activeFilter, setActiveFilter] = useState<string>("All");
// ...
return activeFilter === "All"
  ? projects
  : projects.filter((p) => p.categories.includes(activeFilter));
```

The `ALL_FILTERS` array in `project-filters.tsx` should become:
```typescript
import { CATEGORY_SLUGS } from "@/data/categories";
const ALL_FILTERS: string[] = ["All", ...CATEGORY_SLUGS];
```

### Edge Cases

- If `project.categories` is empty for any project, that project should still appear under "All" but under no specific filter tab — this is acceptable
- `categoryLabel()` must handle unknown slugs gracefully (return the slug as-is)
- The filter dropdown trigger button currently shows the raw category name — after this change it should show the display label for the active filter

### Code Style

- Use `"use client"` directive on components that already have it — do not add it where absent
- No inline `style={}` props — use Tailwind mapped classes
- Component filenames stay kebab-case

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `package.json` — do not modify (no new dependencies needed for this task)
- `next.config.ts` — do not touch
- `tsconfig.json` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T005 | Updates `src/types/project.ts` to use `categories: string[]` and populates all 5 project records with `categories` arrays | Check that `Project` interface has `categories: string[]` and that `projects.ts` data has `categories` populated |

### Downstream Impact

Tasks that depend on this one:
- **T014** — Update project listing to use multi-tag filtering (depends on `CATEGORY_SLUGS` from categories.ts)

**Before starting:** Verify T005 is complete by checking:
```
grep "categories:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/types/project.ts
grep "categories:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/projects.ts
```
Both should return results with `string[]` type and populated arrays respectively.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T009`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
refactor(categories): replace ProjectCategory enum with multi-tag slug system

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: feat, fix, refactor, test, docs, chore

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified
- [ ] No references to `ProjectCategory` or `p.category` (singular) remain in component files
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T009 | Wave: 3_
