# Task Brief: T016

**Title:** Add SEO metadata generation from content
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 4/10
**Model:** Sonnet
**Wave:** 4
**Feature Issue:** (see execution_plan.yaml)

---

## Objective

Add or improve `generateMetadata()` exports on all dynamic route pages and ensure all static pages have appropriate metadata. The root layout already defines a solid baseline — this task fills the gaps on content-specific pages so each URL gets a meaningful, unique title, description, og:image, and canonical URL derived from the actual content.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The codebase already has partial metadata coverage:
- `src/app/layout.tsx` exports a root `metadata` object with a title template (`"%s | Open Session"`), description, og, and twitter cards
- `src/app/projects/[slug]/page.tsx` already exports `generateMetadata()` — but the og:image is not set and the title pattern uses "Projects" not "Open Session"
- `src/app/blog/[slug]/page.tsx` already exports `generateMetadata()` — og:image missing, no canonical URL
- `src/app/playbooks/[slug]/page.tsx` will exist after T013 — needs `generateMetadata()` added
- `src/app/lab/page.tsx` will exist after T015 — needs static `metadata` export
- Static pages (`/`, `/projects`, `/blog`, `/about`, `/contact`) need review for static metadata

This task is part of **Wave 4** — integration and polish. The dynamic page routes must be operational before this task finalizes their metadata.

---

## Requirements

### Dynamic Pages — generateMetadata()

**1. `/projects/[slug]` (`src/app/projects/[slug]/page.tsx`)**
- Already has `generateMetadata()` — update it:
  - Title: `"${project.title} | Open Session"` (currently says "| Projects")
  - Add `openGraph.images`: use `project.thumbnail` as og:image (it will be a local path like `/images/projects/iterra/hero.svg`)
  - Add `alternates.canonical`: `https://opensession.co/projects/${slug}`

**2. `/blog/[slug]` (`src/app/blog/[slug]/page.tsx`)**
- Already has `generateMetadata()` — update it:
  - Title: uses root template so `post.title` alone resolves to `"Post Title | Open Session"` — confirm this is correct
  - Add `openGraph.images`: use `post.thumbnail`
  - Add `alternates.canonical`: `https://opensession.co/blog/${slug}`

**3. `/playbooks/[slug]` (`src/app/playbooks/[slug]/page.tsx`)**
- Add `generateMetadata()` that handles both found and not-found cases
- Title: `playbook.title` (uses root template)
- og:image: `playbook.thumbnail` if available
- Canonical: `https://opensession.co/playbooks/${slug}`
- Graceful not-found return: `{ title: "Playbook Not Found" }`

### Static Pages — static metadata export

**4. `/lab` (`src/app/lab/page.tsx`)**
- Add/verify `export const metadata: Metadata = { title: "The Lab", description: "..." }`
- (T015 may have already added this — verify and improve if needed)

**5. `/projects` (`src/app/projects/page.tsx`)**
- Currently a `"use client"` component — static metadata cannot be exported from client components
- **Approach:** Extract metadata to a separate server wrapper. Create `src/app/projects/_metadata.ts` exporting the metadata object, OR move the metadata export to `src/app/projects/layout.tsx` (create if it doesn't exist)
- Metadata: `title: "Projects"`, `description: "15+ brand, digital design, and creative direction projects."`

**6. `/blog` (`src/app/blog/page.tsx`)**
- Already has `export const metadata` — verify title and description are accurate
- Add `alternates.canonical`: `https://opensession.co/blog`

**7. `/about` (`src/app/about/page.tsx`)**
- Check for existing metadata export; add if missing
- Title: "About", description about the Open Session team and mission

**8. `/contact` (`src/app/contact/page.tsx`)**
- Check for existing metadata export; add if missing
- Title: "Contact", description: "Get in touch with Open Session."

### Root Layout Metadata (`src/app/layout.tsx`)
- Review the existing metadata — it is already well-formed
- No changes required unless you identify a gap

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/projects/[slug]` `generateMetadata()` returns og:image from `project.thumbnail` and canonical URL
- [ ] `/blog/[slug]` `generateMetadata()` returns og:image from `post.thumbnail` and canonical URL
- [ ] `/playbooks/[slug]` exports `generateMetadata()` (handles empty array gracefully — no runtime error)
- [ ] `/lab` has static `metadata` export with title and description
- [ ] `/projects` has metadata accessible at build time (via layout.tsx or similar — NOT from a client component)
- [ ] `/blog` metadata has canonical URL
- [ ] `/about` and `/contact` both have static `metadata` exports
- [ ] All page titles follow the pattern: content title alone (root layout template appends "| Open Session")
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/projects/[slug]/page.tsx` | modify | Update existing generateMetadata — add og:image and canonical |
| `src/app/blog/[slug]/page.tsx` | modify | Update existing generateMetadata — add og:image and canonical |
| `src/app/playbooks/[slug]/page.tsx` | modify | Add generateMetadata() |
| `src/app/lab/page.tsx` | modify | Verify/improve metadata export (T015 creates this file) |
| `src/app/projects/layout.tsx` | create | Add static metadata for /projects (client page workaround) |
| `src/app/blog/page.tsx` | modify | Add canonical URL to existing metadata |
| `src/app/about/page.tsx` | modify | Add metadata export if missing |
| `src/app/contact/page.tsx` | modify | Add metadata export if missing |

### File Ownership Notes

`src/app/lab/page.tsx` is created by T015. Coordinate: if T015 and T016 run in sequence, T016 modifies the file T015 created. If running in parallel (not recommended for Wave 4), merge carefully.

`src/app/projects/page.tsx` is a `"use client"` component — you cannot add `export const metadata` to it directly. Next.js will throw a build error. Use `src/app/projects/layout.tsx` instead.

---

## Implementation Guidance

### Root Layout Metadata (Already in Place)

`src/app/layout.tsx` has this title template:
```typescript
title: {
  default: "Open Session | Design Company",
  template: "%s | Open Session",
},
```

This means any page that exports `title: "Projects"` will render as `"Projects | Open Session"` in `<title>`. You do NOT need to manually append "| Open Session" in each page's metadata.

### Existing generateMetadata Pattern

The pattern used in `src/app/projects/[slug]/page.tsx` is correct — follow it for playbooks. Key detail: `params` is a `Promise` in Next.js 16+ App Router:

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // ...
}
```

### Adding og:image

For local image paths (e.g. `/images/projects/iterra/hero.svg`), the og:image format is:

```typescript
openGraph: {
  images: [
    {
      url: project.thumbnail,  // "/images/projects/iterra/hero.svg"
      width: 1200,
      height: 630,
      alt: project.title,
    },
  ],
},
```

Note: og:image ideally should be an absolute URL. For production correctness, prepend the base URL:
```typescript
const baseUrl = "https://opensession.co";
images: [{ url: `${baseUrl}${project.thumbnail}` }]
```

### Canonical URLs

```typescript
alternates: {
  canonical: `https://opensession.co/projects/${slug}`,
},
```

### Client Component Metadata Workaround

`src/app/projects/page.tsx` is a client component (`"use client"`). Metadata cannot be exported from client components. The cleanest fix is a layout file:

```typescript
// src/app/projects/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "15+ brand, digital design, and creative direction projects.",
  alternates: {
    canonical: "https://opensession.co/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Playbooks Page — Empty generateStaticParams

The playbooks page has an empty array for `generateStaticParams()`. `generateMetadata()` should still be added — it just won't be called during the build (no slugs to generate). It will be called on-demand if a slug is ever hit, so make sure it handles a not-found case:

```typescript
export async function generateMetadata({ params }: PlaybookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);
  if (!playbook) return { title: "Playbook Not Found" };
  return {
    title: playbook.title,
    description: playbook.excerpt,
    alternates: { canonical: `https://opensession.co/playbooks/${slug}` },
  };
}
```

### Code Style

- Import `Metadata` from `"next"` not `"next/dist/..."` 
- Use `async function generateMetadata` (not arrow function) for consistency with existing code
- Mapped Tailwind classes for any UI elements (none expected in this task)
- No new npm packages needed

### Edge Cases

- If `project.thumbnail` is an empty string or undefined (data not yet populated by T005), the og:image will be broken — wrap in a conditional: `...(project.thumbnail ? { images: [{ url: ... }] } : {})`
- The `/playbooks` listing page (`src/app/playbooks/page.tsx`) may also need metadata — add a static export if it's missing

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T010 | Enriched project detail page exists with updated data schema | Check `src/app/projects/[slug]/page.tsx` renders project data |
| T011 | Blog MDX system complete; `blogPosts` have `contentPath` | Check `src/data/blog.ts` has 4 posts |
| T015 | `/lab` page created at `src/app/lab/page.tsx` | Check file exists before modifying it |

### Downstream Impact

Tasks that depend on this one: None — T016 is a leaf in Wave 4.

**Before starting:** Verify dependencies are complete by checking:
- `src/app/lab/page.tsx` exists (T015 complete)
- `src/app/playbooks/[slug]/page.tsx` exists (T013 complete)
- `src/app/projects/[slug]/page.tsx` has the enriched project rendering (T010 complete)

---

## GitHub Context

**Issue:** T016
**Branch:** `worktree/framer-cms-migration-T016`
**Target:** `main` (or active feature branch if in use)

---

## Commit Guidelines

```
feat(seo): add og:image and canonical URLs to dynamic route pages

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
feat(seo): add static metadata to projects, blog, about, contact, lab pages

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified
- [ ] `next.config.ts` not modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T016 | Wave: 4_
