# Task Brief: T014

**Title:** Update project listing to use multi-tag filtering
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Update the `/projects` listing page filter UI to use the canonical category system established by T009. Category tabs must use display names from `src/data/categories.ts`, filter logic must handle multi-tag intersection, and the "All" tab must show all 5 projects.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### What T009 already did

T009 (which this task depends on) has:
1. Created `src/data/categories.ts` with `CATEGORY_SLUGS`, `CATEGORY_LABELS`, and `categoryLabel()`
2. Removed the old `ProjectCategory` enum and `projectCategories` array from `src/types/project.ts`
3. Updated `src/app/projects/page.tsx` to change the filter state type from `ProjectCategory | "All"` to `string`
4. Updated `src/components/projects/project-filters.tsx` to import from `categories.ts` instead of the old type

T009 makes the type-level and logic changes. **This task verifies those changes are complete and correct end-to-end**, then ensures the filter component tabs are correctly populated with display labels and the filter interaction is visually correct.

### Current state (before T009 or post-T009)

`src/app/projects/page.tsx`:
- `activeFilter` state typed as `ProjectCategory | "All"` → should now be `string`
- `filteredProjects` uses `p.category === activeFilter` → should now be `p.categories.includes(activeFilter)`
- Imports `ProjectCategory, projectCategories` from `@/types/project` → should now import from `@/data/categories`

`src/components/projects/project-filters.tsx`:
- `ALL_FILTERS: (ProjectCategory | "All")[]` → should now be `string[]` = `["All", ...CATEGORY_SLUGS]`
- Filter display renders the raw value (e.g., `"Brand Identity"` from old enum) → should now use `categoryLabel(filter)` for display while `filter` remains the slug for comparison

### What this task specifically does

1. Verify (and complete if T009 left gaps) all the changes described above
2. Ensure the filter UI correctly shows the label (e.g., "Brand Identity") while passing the slug (e.g., "brand-identity") to the filter function
3. Ensure the active filter indicator in the dropdown shows the current filter's display name on the trigger button
4. Confirm all 5 projects are reachable via the appropriate filter tab
5. Confirm projects with multiple categories appear under each applicable tab

### The 5 canonical slugs and their projects

After T005 populates project data:

| Slug | Display | Projects |
|------|---------|---------|
| `brand-identity` | Brand Identity | Iterra, BILTFOUR |
| `digital-design` | Digital Design | NEXT (Google Cloud) |
| `art-direction` | Art Direction | Infinite Nature, Universal Audio |
| `strategy` | Strategy | NEXT (Google Cloud) |
| `web-design` | Web Design | (TBD by T005 data — may include BILTFOUR) |

Exact category assignments come from the project data populated by T005. The filter must work by checking `project.categories.includes(activeFilterSlug)`.

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. `src/app/projects/page.tsx`

Ensure the following is correct:

```typescript
// Correct state type
const [activeFilter, setActiveFilter] = useState<string>("All");

// Correct filter function
const filteredProjects = useMemo(() => {
  if (activeFilter === "All") return projects;
  return projects.filter((p) => p.categories.includes(activeFilter));
}, [activeFilter]);

// Correct import — no longer from @/types/project
// Remove: import { ProjectCategory, ViewMode } from "@/types/project";
// Add:
import { ViewMode } from "@/types/project";
// ViewMode ("carousel" | "two-column" | "grid") stays in the types file
```

The `handleFilterChange` callback type changes from `(filter: ProjectCategory | "All")` to `(filter: string)`:
```typescript
const handleFilterChange = useCallback((filter: string) => {
  setActiveFilter(filter);
  setActiveIndex(0);
}, []);
```

### 2. `src/components/projects/project-filters.tsx`

Ensure the following:

```typescript
import { CATEGORY_SLUGS, categoryLabel } from "@/data/categories";
// Remove: import { ProjectCategory, projectCategories } from "@/types/project";

// Props type update
interface ProjectFiltersProps {
  activeFilter: string;  // was: ProjectCategory | "All"
  onFilterChange: (filter: string) => void;
}

const ALL_FILTERS: string[] = ["All", ...CATEGORY_SLUGS];

// In the dropdown render — show display label, not raw slug
<span className="font-accent text-xs uppercase tracking-wider">
  [{filter === "All" ? "ALL" : categoryLabel(filter).toUpperCase()}]
</span>
```

The trigger button currently shows the active filter value. Update it to show the display label:
```tsx
// Trigger button text (inside the FILTER button)
<span className="font-accent text-xs uppercase tracking-wider">
  FILTER{activeFilter !== "All" ? `: ${categoryLabel(activeFilter).toUpperCase()}` : ""}
</span>
```

Or simply show the current label without the "FILTER:" prefix if it feels cleaner. The current UI just shows "FILTER" with a chevron — adding the active filter label improves UX.

### 3. No changes needed to `project-card.tsx` or `project-carousel.tsx`

Those components receive individual `Project` objects and render them. T009 already updated category display in cards.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Selecting "All" tab shows all 5 projects
- [ ] Selecting each of the 5 category slugs shows only projects that include that slug in their `categories` array
- [ ] Projects with multiple categories (e.g., a project with both "brand-identity" and "web-design") appear under EACH matching filter tab
- [ ] Category tab labels use human-readable display names (e.g., "Brand Identity", not "brand-identity")
- [ ] No TypeScript errors related to old `ProjectCategory` enum
- [ ] No import of `ProjectCategory` or `projectCategories` remains in `projects/page.tsx` or `project-filters.tsx`
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/projects/page.tsx` | modify | Update state type, filter logic, and imports |
| `src/components/projects/project-filters.tsx` | modify | Use canonical slugs + display labels from categories.ts |

### File Ownership Notes

Both files were also touched by T009. If T009 is fully complete, this task may be mostly verification with minor display-label refinements. If T009 partially completed the changes, finish them here.

---

## Implementation Guidance

### Patterns to Follow

- The dropdown in `project-filters.tsx` already uses `AnimatePresence` + `motion` — keep the animation unchanged, only update data and label rendering
- All filter interactions are handled through `onFilterChange` callback — the parent (`projects/page.tsx`) owns the state, the filter component is controlled
- `cn()` from `@/lib/utils` is already imported for conditional classes

### What "Active Filter" Should Show

Current trigger button structure:
```tsx
<span className="font-accent text-xs uppercase tracking-wider">
  FILTER
</span>
```

When a category is active, showing the active filter label improves user clarity. Consider:
```tsx
<span className="font-accent text-xs uppercase tracking-wider">
  {activeFilter === "All" ? "FILTER" : categoryLabel(activeFilter).toUpperCase()}
</span>
```

This swaps "FILTER" text for the active category label when something is selected.

### Carousel Index Reset

`handleFilterChange` already resets `activeIndex` to 0. Verify this is in place — when the filter changes, the carousel should return to position 0.

### Edge Cases

- If `CATEGORY_SLUGS` is empty (shouldn't happen), `ALL_FILTERS` would just be `["All"]` — the component should handle this gracefully (renders only "All" option)
- If a project has an empty `categories: []` array, it appears under "All" but under no specific filter — this is correct behavior
- The `focusedIndex` keyboard navigation in `project-filters.tsx` uses `ALL_FILTERS.indexOf(activeFilter)` — this will still work correctly since `ALL_FILTERS` is now `string[]`

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/components/projects/project-card.tsx` — already updated by T009
- `src/components/projects/project-detail.tsx` — owned by T010
- `src/data/projects.ts` — owned by T005

### Files Requiring Review

- `package.json` — no changes needed
- `next.config.ts` — do not touch
- `tsconfig.json` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T009 | `src/data/categories.ts` with `CATEGORY_SLUGS` and `categoryLabel()`; removes `ProjectCategory` enum | Check `src/data/categories.ts` exists; check no `ProjectCategory` import remains in target files |
| T005 | Populates all 5 projects with `categories: string[]` arrays | Check `src/data/projects.ts` has `categories` field with canonical slugs |

### Downstream Impact

Tasks that depend on this one: None directly in Wave 3. T016 (Wave 4) touches `projects/page.tsx` for SEO metadata — no conflict since T016 only adds `generateMetadata()` to the route segment, not to the client page component.

**Before starting:** Verify dependencies:
```
cat /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/categories.ts
grep "categories:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/projects.ts | head -5
```

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T014`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
refactor(projects): update filter to use canonical category slugs and display labels

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No `ProjectCategory` imports remain in modified files
- [ ] No `p.category` (singular) filter comparisons remain
- [ ] Filter tabs show display names, not raw slugs
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T014 | Wave: 3_
