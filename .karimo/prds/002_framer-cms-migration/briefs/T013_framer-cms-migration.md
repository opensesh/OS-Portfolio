# Task Brief: T013

**Title:** Create playbook schema and empty content infrastructure
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 2

---

## Objective

Set up the playbook content type as empty infrastructure so it is ready for future content without blocking any other task. Create `/src/data/playbooks.ts` with a typed empty array, create `/src/app/playbooks/page.tsx` with an empty state, and create `/src/app/playbooks/[slug]/page.tsx` with a `generateStaticParams()` that handles an empty array gracefully. The build must pass with zero playbook content.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The portfolio site's navigation already references `Playbooks` in two places:
- `footerNavItems.theLab` in `src/data/navigation.ts` links to `/playbooks`
- `overlayNavItems` in `src/data/navigation.ts` has a "Playbooks" child linking to `/playbooks`

Neither `/playbooks` nor `/playbooks/[slug]` routes exist. The site currently has no 404 for these because they aren't linked visibly in the main nav, but they will be needed for the Lab page (T015) and future content.

There are no playbook entries in the Framer CMS yet. This task creates the structural foundation only.

Wave 1 dependencies:
- **T002** — Creates `/src/types/playbook.ts` with the `Playbook` type
- **T003** — Creates `/src/content/playbooks/` directory

This task is part of **Wave 2** — content migration (infrastructure only).

---

## Expected Playbook Type (from T002)

After T002 completes, `/src/types/playbook.ts` will export:

```typescript
export interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;
  author: { name: string; image?: string };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}
```

The `Playbook` type mirrors `BlogPost` with the same fields. Verify the exact shape from T002 before writing the data file.

---

## Files to Create

### 1. `/src/data/playbooks.ts`

```typescript
import { Playbook } from "@/types/playbook";

// TEMPLATE: replace with your content
export const playbooks: Playbook[] = [];

export const featuredPlaybooks = playbooks.filter((p) => p.featured);
```

Follow the same pattern as `src/data/blog.ts` which exports `blogPosts` and `featuredBlogPosts`. Keep the `// TEMPLATE: replace with your content` comment — this is required for T018's strip-for-template script.

---

### 2. `/src/app/playbooks/page.tsx`

A listing page that gracefully handles an empty array:

```tsx
import { Metadata } from "next";
import { playbooks } from "@/data/playbooks";

export const metadata: Metadata = {
  title: "Playbooks | Open Session",
  description: "Step-by-step design playbooks for founders and creative teams.",
};

export default function PlaybooksPage() {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">Playbooks</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Design Playbooks
          </h1>
          <p className="text-fg-secondary text-lg max-w-2xl">
            Step-by-step playbooks for building brands, products, and systems
            that scale.
          </p>
        </div>

        {/* Content */}
        {playbooks.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-fg-secondary text-lg">
              Playbooks are coming soon. Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((playbook) => (
              <div key={playbook.id}>
                {/* PlaybookCard component (to be built in future) */}
                <p>{playbook.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Note on styling:** Follow the same visual pattern as `src/app/blog/page.tsx` — use `container-main`, `section-label`, and `text-display` classes which are defined in the project's Tailwind config. Do not use raw Tailwind colors or spacing that differs from the blog page layout.

---

### 3. `/src/app/playbooks/[slug]/page.tsx`

A detail page that handles an empty `generateStaticParams()` gracefully:

```tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { playbooks } from "@/data/playbooks";

interface PlaybookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return playbooks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PlaybookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);

  if (!playbook) {
    return { title: "Playbook Not Found" };
  }

  return {
    title: `${playbook.title} | Open Session`,
    description: playbook.excerpt,
  };
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);

  if (!playbook) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main max-w-3xl">
        <h1 className="text-display text-4xl md:text-5xl mb-6">
          {playbook.title}
        </h1>
        <p className="text-fg-secondary text-lg mb-8">{playbook.excerpt}</p>
        {/* MDX rendering will be added in a future task */}
        <p className="text-fg-tertiary text-sm">
          Content rendering coming soon.
        </p>
      </div>
    </div>
  );
}
```

**Key points:**
- `generateStaticParams()` returns an empty array when `playbooks` is empty — Next.js handles this correctly (generates no static pages but doesn't error)
- The `notFound()` call handles direct URL access to `/playbooks/any-slug` while the array is empty
- Use `params: Promise<{ slug: string }>` (not `params: { slug: string }`) — this is the Next.js 15/16 async params API. Match the pattern in `src/app/blog/[slug]/page.tsx`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/src/data/playbooks.ts` exports an empty `Playbook[]` array
- [ ] `/src/data/playbooks.ts` has `// TEMPLATE: replace with your content` comment
- [ ] `/src/app/playbooks/page.tsx` renders without errors and shows empty state when no playbooks exist
- [ ] `/src/app/playbooks/[slug]/page.tsx` has `generateStaticParams()` that returns empty array without errors
- [ ] `npm run build` passes with no TypeScript errors and no static generation errors
- [ ] `npm run lint` passes

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/playbooks.ts` | create | Empty typed `Playbook[]` array |
| `src/app/playbooks/page.tsx` | create | Listing page with empty state |
| `src/app/playbooks/[slug]/page.tsx` | create | Detail page shell with graceful empty `generateStaticParams` |

### File Ownership Notes

- `src/types/playbook.ts` is owned by T002. Do NOT create or modify it here.
- `src/content/playbooks/` directory is owned by T003. Do NOT create it here — T003 handles it.
- There are no existing `/src/app/playbooks/` directories to conflict with.

---

## Implementation Guidance

### Pattern to Follow

Follow the exact patterns from the blog system:

| Playbooks file | Mirror of |
|---------------|-----------|
| `src/data/playbooks.ts` | `src/data/blog.ts` |
| `src/app/playbooks/page.tsx` | `src/app/blog/page.tsx` |
| `src/app/playbooks/[slug]/page.tsx` | `src/app/blog/[slug]/page.tsx` |

Read `src/app/blog/[slug]/page.tsx` before writing the slug page — it shows the correct async params pattern for Next.js 16+.

### Empty State Text

The empty state message for the listing page should be human-readable. The example above ("Playbooks are coming soon. Check back later.") is acceptable. Alternatively:

```
"We're working on our first playbooks. Stay tuned."
```

Keep it simple — no complex empty state UI. The Lab page (T015) may display a more designed empty state.

### TypeScript Strictness

- The `Playbook[]` array in `playbooks.ts` must be explicitly typed — do not rely on inference
- The `generateStaticParams` return type is `{ slug: string }[]` — TypeScript should infer this correctly from the `.map()` call
- No `any` types

### Next.js 16 Async Params

In Next.js 16+, the `params` object in page components is a `Promise`. The existing `blog/[slug]/page.tsx` demonstrates the correct pattern:

```typescript
interface PlaybookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;
  ...
}
```

Do not use the older synchronous `params: { slug: string }` pattern — it will cause TypeScript errors.

### Edge Cases

- An empty `generateStaticParams()` is valid Next.js behavior — no static pages are pre-generated, but the dynamic route still exists for runtime rendering. The build should pass cleanly.
- The `/playbooks` listing page should not crash when the `playbooks` array is empty. The conditional rendering handles this.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/types/playbook.ts` (owned by T002)
- `src/content/playbooks/` (owned by T003)

### Files Requiring Review

- `package.json` — do not modify
- `next.config.ts` — do not modify

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | `Playbook` type in `src/types/playbook.ts` | Check that `src/types/playbook.ts` exists and exports a `Playbook` interface |
| T003 | `src/content/playbooks/` directory exists | Check `ls src/content/playbooks/` — should exist but be empty or have `.gitkeep` |

### Downstream Impact

Tasks that depend on this one:
- **T015** — Lab page imports and renders `playbooks` from the data file (will show empty state)
- **T016** — SEO metadata for `/playbooks/[slug]` route

**Before starting:** Verify T002 has created `src/types/playbook.ts`. If it doesn't exist, you cannot import `Playbook` in the data file.

---

## GitHub Context

**Issue:** T013 (to be created)
**Branch:** `worktree/framer-cms-migration-T013`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

```
feat(playbooks): create empty playbook content infrastructure

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] `npm run lint` passes
- [ ] `/playbooks` route accessible (returns 200, not 404)
- [ ] Empty state visible on `/playbooks` page
- [ ] No TypeScript errors related to `Playbook` type
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T013 | Wave: 2_
