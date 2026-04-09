# errors.md — Errors, Gaps & Dead Code
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Missing Images (Broken References)

### Missing: /public/images/templates/ directory
**File:** `src/data/templates.ts` lines 18, 27, 36, 45
```ts
thumbnail: "/images/templates/brand-guidelines.jpg",
thumbnail: "/images/templates/pitch-deck.jpg",
thumbnail: "/images/templates/design-system.jpg",
thumbnail: "/images/templates/portfolio.jpg",
```
**Status:** The directory `public/images/templates/` does not exist. All four template thumbnails are broken. The `/templates` route and page are live, but images will 404.

### Blog card images commented out (intentional placeholder)
**File:** `src/components/blog/blog-card.tsx` lines 35-42:
```tsx
{/* Uncomment when images are available
<Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
*/}
```
**File:** `src/components/blog/blog-post.tsx` lines 101-109:
```tsx
{/* Uncomment when images are available
<Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
*/}
```
**Status:** Blog thumbnails exist in `public/images/blog/` (4 images confirmed) but the `<Image>` tags are commented out. All 4 `BlogPost.thumbnail` values in `src/data/blog.ts` are unreachable.

---

## 2. Dead / Placeholder Code

### Playbooks: empty arrays + stub rendering
**File:** `src/data/playbooks.ts`:
```ts
export const playbooks: Playbook[] = [];
export const featuredPlaybooks: Playbook[] = [];
```
**File:** `src/app/playbooks/[slug]/page.tsx`:
```tsx
{/* MDX rendering will be added in a future task */}
<p className="text-fg-tertiary text-sm">Content rendering coming soon.</p>
```
**Status:** The playbooks route exists and `generateStaticParams` returns an empty array. No MDX rendering implemented.

### Free resources grid coming-soon message
**File:** `src/components/resources/free-resources-grid.tsx`:
```tsx
Resources are coming soon. Check back later.
```
This appears when `resources.length === 0` — since `freeResources` has 5 items, this branch is currently unreachable dead code.

---

## 3. TODO Comments (Migration-Related)

### Form submission not implemented
**File:** `src/components/shared/contact-form.tsx` line 140:
```ts
// TODO: Implement actual form submission
```
**File:** `src/components/shared/newsletter-form.tsx` line 43:
```ts
// TODO: Implement actual newsletter signup
```
Both forms exist in the UI but silently do nothing on submit.

---

## 4. Type Inconsistencies

### Supporting types not in src/types/
The `src/types/` directory contains only 4 files: `project.ts`, `blog.ts`, `playbook.ts`, `free-resources.ts`. However, 11 other interfaces are defined inline in their respective data files:

| Interface | Defined in |
|---|---|
| `TeamMember` | `src/data/team.ts` |
| `NavItem`, `SocialLink` | `src/data/navigation.ts` |
| `Client` | `src/data/clients.ts` |
| `Stat` | `src/data/stats.ts` |
| `Service` | `src/data/services.ts` |
| `FAQItem` | `src/data/faq.ts` |
| `ProcessStep` | `src/data/process.ts` |
| `Value` | `src/data/values.ts` |
| `WhatWeDoItem` | `src/data/what-we-do.ts` |
| `Tool` | `src/data/tools.ts` |
| `Template` | `src/data/templates.ts` |

These are not re-exported via `src/types/index.ts`. The four "CMS-migrated" types were formalized but the supporting UI types were left in-file.

### blogCategories runtime value in a type file
**File:** `src/types/blog.ts`:
```ts
export const blogCategories: BlogCategory[] = [
  'Creative Philosophy', 'About Us', 'Digital Design', 'Design Strategy', 'Brand Identity',
];
```
A runtime const array exported from a types file. Convention is to keep runtime values in `src/data/`.

### team.ts co-mingling
`src/data/team.ts` exports `team` (1 member, placeholder comment) and `showcase` (Karim + Morgan, with images). The `team` array was not fully populated during migration.

---

## 5. Navigation Link to Non-Existent Route

**File:** `src/data/navigation.ts`:
```ts
{ label: "Resources", href: "/resources" },
```
There is no `src/app/resources/page.tsx`. The `/resources` route would 404. The correct route is `/free-assets`. This is a dead link in `overlayNavItems`.

---

## 6. Sitemap Includes Redirect-Only Pages

**File:** `src/app/sitemap.ts`:
```ts
{ url: `${baseUrl}/privacy`, ... },
{ url: `${baseUrl}/terms`, ... },
```
These routes only contain `redirect()` calls. Minor SEO issue.

---

## 7. Unused Import in Server Component

**File:** `src/app/blog/page.tsx`:
```ts
import { motion } from "framer-motion";
```
`motion` is imported but never used in the component's JSX. This is a Server Component (no `"use client"` directive), so the import should be removed.
