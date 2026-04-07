# Task Brief: T015

**Title:** Build Lab / View All page aggregating blog, playbooks, and free resources
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 5/10
**Model:** Opus
**Wave:** 4
**Feature Issue:** (see execution_plan.yaml)

---

## Objective

Create `/src/app/lab/page.tsx` as a unified content hub that aggregates free resources, blog posts, and playbooks into a single "Lab" page. The current `/templates` route serves this role but only shows templates — the new `/lab` page supersedes it with richer, structured sections. Update site navigation to point to `/lab`.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The Open Session site currently has a `/templates` page at `src/app/templates/page.tsx` that renders a simple grid using `src/data/templates.ts`. The nav item labeled "The Lab" in `src/data/navigation.ts` already points to `/templates` — this is the placeholder for the full Lab page.

Wave 4 consolidates content from three upstream waves:
- **T011** (Wave 3) delivered blog MDX rendering — `blogPosts` array in `src/data/blog.ts` now has 4 posts with `contentPath`
- **T012** (Wave 3) delivered `FreeResourceCard` and `FreeResourcesGrid` components in `src/components/resources/`
- **T013** (Wave 3) delivered `src/data/playbooks.ts` (empty `Playbook[]` array) and `src/app/playbooks/page.tsx`

The Lab page must handle the fact that playbooks have no content yet — it should display a graceful empty state for that section, not an error or blank space.

This task is part of **Wave 4** — integration and polish. All content infrastructure is in place; this task assembles it into the public-facing hub.

---

## Requirements

1. Create `src/app/lab/page.tsx` as a Next.js App Router page (no `"use client"` — server component is fine since no interactive state needed at the page level)
2. The page renders three named sections in order:
   - **Free Resources** — uses `FreeResourcesGrid` from `src/components/resources/free-resources-grid.tsx`
   - **Blog Posts** — renders all posts from `src/data/blog.ts` using `BlogCard` from `src/components/blog/blog-card.tsx`
   - **Playbooks** — renders an empty state when `playbooks` array is empty
3. Create `src/components/lab/LabHero.tsx` — a hero/header component for the page with a title, section label, and short description copy
4. Update `src/data/navigation.ts`:
   - Change `mainNavItems` entry for "The Lab" `href` from `/templates` to `/lab`
   - Change `footerNavItems.theLab` "View All" `href` from `/templates` to `/lab`
   - Change `overlayNavItems` entry for "The Lab" `href` from `/templates` to `/lab`
5. Static metadata export on the page (`export const metadata`)
6. All Tailwind classes must use semantic mapped classes: `bg-bg-primary`, `text-fg-primary`, `text-fg-secondary`, `border-border-secondary`, etc. Never use raw CSS variable syntax

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/lab` page renders without errors in `npm run build`
- [ ] Free resources section renders all 5 resource cards via `FreeResourcesGrid`
- [ ] Blog section renders all 4 posts (linking to `/blog/[slug]`) using `BlogCard`
- [ ] Playbooks section shows a meaningful empty state (headline + short message like "Coming soon — playbooks are in production") rather than nothing or an error
- [ ] `LabHero.tsx` component created in `src/components/lab/`
- [ ] Navigation updated: "The Lab" href points to `/lab` in all three navigation arrays in `src/data/navigation.ts`
- [ ] `export const metadata` present on the lab page with title and description
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No ESLint errors (`npm run lint` passes)
- [ ] No Framer Motion imports directly on a server component (either make client components or import motion only in sub-components)

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/lab/page.tsx` | create | New Lab unified hub page |
| `src/components/lab/LabHero.tsx` | create | Hero/header component for Lab page |
| `src/data/navigation.ts` | modify | Update all three nav arrays to point to `/lab` |

### File Ownership Notes

`src/data/navigation.ts` is also referenced by T016 (SEO metadata) but T016 only reads navigation — no conflict. The header component (`src/components/layout/header.tsx`) consumes `mainNavItems` and `overlayNavItems` — your navigation changes will automatically reflect there without touching the header file.

---

## Implementation Guidance

### Existing Navigation Structure

`src/data/navigation.ts` currently has three arrays that need updating. Read the file before editing to verify line numbers — the exact current structure (confirmed from codebase) is:

```typescript
// mainNavItems — line 18
{ label: "The Lab", href: "/templates" }  // change href to "/lab"

// footerNavItems.theLab — lines 27-31 (4 items, not 3)
theLab: [
  { label: "Blog", href: "/blog" },
  { label: "Playbooks", href: "/playbooks" },
  { label: "Free Assets", href: "/free-assets" },   // NOTE: "Free Assets" entry exists with href /free-assets
  { label: "View All", href: "/templates" },         // change href to "/lab"
],

// overlayNavItems — lines 44-53
{
  label: "The Lab",
  href: "/templates",    // change href to "/lab"
  children: [
    { label: "Blog", href: "/blog" },
    { label: "Playbooks", href: "/playbooks" },
    { label: "Resources", href: "/resources" },     // NOTE: label is "Resources" (not "Free Assets") and href is "/resources"
    { label: "View All", href: "/templates" },      // change href to "/lab"
  ],
},
```

**Key differences from what the brief originally described:**
- `footerNavItems.theLab` has **4 entries** (not 3) — includes `Free Assets` as a separate entry
- `overlayNavItems` children uses `{ label: "Resources", href: "/resources" }` — NOT `{ label: "Free Assets", href: "/free-assets" }`
- The `Free Assets` entry in `footerNavItems.theLab` links to `/free-assets` — this route does not yet exist. Do NOT change this href in T015 (leave it as-is for now; it's an orphaned link that will be resolved in a future task)

**Changes required in T015:**
1. `mainNavItems`: Change `The Lab` href from `/templates` to `/lab`
2. `footerNavItems.theLab`: Change `View All` href from `/templates` to `/lab`
3. `overlayNavItems`: Change `The Lab` parent href from `/templates` to `/lab`; also change the `View All` child href from `/templates` to `/lab`

### Lab Page Structure

```tsx
// src/app/lab/page.tsx — server component
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { playbooks } from "@/data/playbooks";
// Note: do NOT import freeResources here — FreeResourcesGrid handles its own data import
import { LabHero } from "@/components/lab/LabHero";
import { FreeResourcesGrid } from "@/components/resources/free-resources-grid";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "The Lab",
  description: "Free resources, articles, and playbooks from Open Session.",
};

export default function LabPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container-main">
        <LabHero />

        {/* Free Resources section */}
        <section> ... <FreeResourcesGrid /> </section>
        {/* NOTE: FreeResourcesGrid (from T012) imports freeResources internally — it takes NO props.
            Do not pass a resources prop; check the actual component signature before writing the call. */}

        {/* Blog section */}
        <section> ... {blogPosts.map(post => <BlogCard key={post.id} post={post} />)} </section>

        {/* Playbooks section — empty state */}
        <section>
          {playbooks.length === 0 ? (
            <div> ... empty state ... </div>
          ) : (
            // future: render playbook cards
          )}
        </section>
      </div>
    </div>
  );
}
```

### Empty State for Playbooks

The playbooks empty state should feel intentional, not broken. A recommended treatment:

```tsx
<div className="border border-border-secondary p-12 text-center">
  <p className="section-label mb-3">Coming Soon</p>
  <h3 className="text-heading text-xl mb-2">Playbooks in Production</h3>
  <p className="text-fg-secondary text-sm max-w-sm mx-auto">
    Step-by-step guides on brand strategy, design systems, and creative AI.
    Check back soon.
  </p>
</div>
```

### Existing Patterns to Follow

- Page layout: See `src/app/blog/page.tsx` for the standard `py-20 md:py-32` + `container-main` pattern
- Section labels: Use `<p className="section-label mb-4">` above section headings (see blog page)
- Blog cards: `BlogCard` from `src/components/blog/blog-card.tsx` takes `{ post: BlogPost }` — no need to build a new one
- `FreeResourcesGrid`: Will be available from T012 at `src/components/resources/free-resources-grid.tsx` — import it directly

### Code Style

- Mapped Tailwind classes only: `bg-bg-primary`, `text-fg-secondary`, `border-border-secondary`
- No raw `bg-[var(--bg-primary)]` or opacity modifiers on CSS vars
- Server component at page level — keep `"use client"` inside sub-components only
- No `Sparkles` icon (hard ban)
- No icons before section headers

### Edge Cases

- If `freeResources` import doesn't exist yet (T007/T012 not complete), add a comment and leave the section as a placeholder — but do not let it block build
- If `FreeResourcesGrid` doesn't accept a `resources` prop (T012 may have a different API), check the actual component signature before writing the import call
- The page must render even if `playbooks` array is empty — never use `.map()` without a conditional length check

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T011 | Blog MDX rendering complete; `blogPosts` in `src/data/blog.ts` has 4 posts with `contentPath` | Check that `src/data/blog.ts` exports 4 posts |
| T012 | `FreeResourceCard` and `FreeResourcesGrid` in `src/components/resources/` | Check that both component files exist |
| T013 | `src/data/playbooks.ts` exports empty `Playbook[]`; `src/app/playbooks/page.tsx` exists | Check that `src/data/playbooks.ts` exists |

### Downstream Impact

Tasks that depend on this one: **T016** (SEO metadata generation depends on this page existing to add `generateMetadata`)

**Before starting:** Verify dependencies are complete by checking:
- `ls src/data/playbooks.ts` exists
- `ls src/components/resources/free-resources-grid.tsx` exists
- `src/data/blog.ts` has at least 4 posts

---

## GitHub Context

**Issue:** T015
**Branch:** `worktree/framer-cms-migration-T015`
**Target:** `main` (or active feature branch if in use)

---

## Commit Guidelines

```
feat(lab): create unified Lab page with resources, blog, and playbooks

Co-Authored-By: Claude <noreply@anthropic.com>
```

Commit navigation change separately:

```
feat(nav): update The Lab href to /lab route

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified (`node_modules/`, `.git/`, `.next/`, `package-lock.json`)
- [ ] `package.json` not modified (no new dependencies needed)
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T015 | Wave: 4_
