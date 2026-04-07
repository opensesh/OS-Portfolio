# PRD: Framer CMS Migration
## Created: 2026-04-07
## Status: approved
## Slug: framer-cms-migration

---

## Executive Summary

Migrate all content from opensession.co (hosted on Framer) into the existing Next.js 16+ codebase at OS-Portfolio. The migration is content-first: get all data, images, and structured content into the codebase with correct TypeScript schemas before any visual polish. The codebase will also be released as a free template, so all proprietary content must be strippable via a clean directory structure.

**Scope:** 5 projects, 4 blog posts, 5 free resources, 2 legal pages, ~75 images.
**Approach:** Static download of assets, file-based CMS (MDX + TypeScript data files), no external CMS dependency.
**Timeline:** Phased waves. Get it right over ship fast.

---

## Goals & Non-Goals

### Goals

- Download all ~75 images from framerusercontent.com to `/public/images/`
- Define enriched TypeScript schemas for all 4 content types (projects, blog, playbooks, free resources)
- Populate all project data with full structured sections (Challenge / Solution / Impact), gallery images, testimonials, and results
- Convert 4 blog posts from Framer HTML to MDX files in `/src/content/blog/`
- Migrate 5 free resources from the OS_our-links repo into the portfolio codebase
- Migrate legal pages (Terms & Privacy) from CSV HTML into usable form
- Update components to render the enriched data (project detail, blog MDX, free resource cards)
- Create a `/lab` or view-all page aggregating blog posts, playbooks, and free resources
- Implement a template-stripping script so proprietary content is cleanly separable
- Add SEO metadata generation from all content types

### Non-Goals

- Visual redesign or UI polish (that is a separate phase)
- External CMS integration (Contentful, Sanity, etc.)
- Live sync with Framer CMS
- New service pages (services remain category filters on the projects listing)
- Playbook content authoring (schema only — content is future work)
- A/B testing or analytics beyond existing setup

---

## Research Findings (Summary)

Full findings at: `/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/.karimo/prds/framer-cms-migration/research/findings.md`

### Content Inventory

| Type | Count | Source |
|------|-------|--------|
| Projects | 5 | Framer CSV + scraped detail pages |
| Blog posts | 4 | Framer CSV (HTML content) |
| Free resources | 5 | OS_our-links repo |
| Legal pages | 2 | Legal.csv |
| Team members | 2 | Already partially in codebase |
| Client logos | 8 SVGs | Already in `/public/logos/clients/` |

### Key Gaps Identified

- Project type lacks: `sections`, `gallery images`, `testimonials`, `results`, `services`, `duration`, `button link`
- Blog type has embedded markdown content — needs to change to MDX file references
- Blog categories missing: "Creative Philosophy", "About Us", "Digital Design"
- Project categories use a single enum — need to migrate to multi-tag system
- 4th blog post (MCP for Designers) exists in Framer but not in the codebase
- ~75 images exist on framerusercontent.com CDN but are not downloaded locally
- No MDX pipeline exists yet (`@next/mdx` or `next-mdx-remote` not installed)
- `next.config.ts` has no image domain allowlisting

### Image Catalog Summary

- **Project images (40):** 5 hero SVGs + ~30 gallery JPGs + 1 GIF (Universal Audio)
- **Homepage (8):** 1 hero PNG, 4 service JPGs, 3 blog thumbnail JPGs (team photo is separate)
- **About page (9):** 1 hero JPG (7008x4672), 2 team photos, 4 story images, 1 new logo SVG
- **Blog thumbnails (4 JPGs):** One per post (EP02, EP01, Democratizing, MCP Guide)

All source URLs follow the pattern: `https://framerusercontent.com/images/{hash}.{ext}` — strip query params to get originals.

---

## Architecture Decisions

### CMS: File-Based Only

- **Blog / Playbooks:** MDX files in `/src/content/blog/{slug}.mdx` and `/src/content/playbooks/{slug}.mdx`
- **Structured content (projects, resources, team):** TypeScript data files in `/src/data/`
- **Rationale:** No external dependency, works with static generation, content is strippable, aligns with existing codebase pattern

### Image Handling

- Download all images to `/public/images/` at migration time
- Subdirectory structure: `/public/images/projects/`, `/public/images/blog/`, `/public/images/about/`, `/public/images/homepage/`
- Use `next/image` with existing fill-based layout — no changes needed to component image rendering logic
- The large about hero (7008x4672) should be downloaded as-is and served via Next.js Image optimization

### Category System

- Migrate from single `ProjectCategory` enum to multi-tag `string[]`
- Canonical tag slugs from Framer CSV: `art-direction`, `strategy`, `digital-design`, `brand-identity`, `web-design`
- Project listing filter updated to handle array intersection

### Blog MDX Pipeline

- Use `next-mdx-remote` (or `@next/mdx`) for rendering MDX at build time
- Blog data file (`/src/data/blog.ts`) changes from embedded `content: string` to `contentPath: string` (relative MDX file path)
- `generateStaticParams()` reads slugs from MDX filenames

### Free Resources

- New data file: `/src/data/free-resources.ts`
- New type: `FreeResource` with fields: `id`, `badge`, `media`, `hoverImage`, `title`, `description`, `href`, `buttonLabel`
- Assets (images/videos) copied from `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/` into `/public/images/resources/`

### Template Stripping Design

Content directory structure is designed so proprietary content can be removed with:

```bash
rm -rf src/content/*          # Remove all MDX files
# Replace src/data/*.ts with example/stub versions
# Replace public/images/ with placeholder assets
```

All content data files should contain a clear `// TEMPLATE: replace with your content` comment at the top.

### Git Workflow

Feature branch (`feat/framer-cms-migration`) → individual task branches as worktrees → merge to main via PR per wave.

---

## Content Types

### 1. Projects

**Schema additions (on top of existing fields):**

```typescript
interface ProjectSection {
  heading: string;       // "The Challenge" / "The Solution" / "The Impact"
  headline: string;      // Bold intro sentence
  body: string;          // Full paragraph (may contain HTML from Framer)
}

interface ProjectImage {
  src: string;           // /images/projects/{project-slug}/{filename}
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

// Enriched Project (extends current)
interface Project {
  // --- existing ---
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  // --- new ---
  categories: string[];          // replaces single category enum
  services: string[];            // e.g. ["Brand Identity", "Guidelines"]
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];    // [challenge, solution, impact]
  images: ProjectImage[];        // hero + gallery grouped
  testimonials?: ProjectTestimonial[];
  results?: string[];            // bullet metrics
}
```

**Data source:** Framer CSV (`Projects.csv`) + scraped detail pages.
**Files to enrich:** 5 projects — Iterra, BILTFOUR, NEXT, Infinite Nature, Universal Audio.

### 2. Blog Posts

**Schema change:**

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;    // replaces embedded content string — e.g. "blog/ep02-creative-ai.mdx"
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory; // union expanded to include new categories
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';
```

**MDX files location:** `/src/content/blog/{slug}.mdx`
**4 posts to create:** EP02 Creative AI Framework, EP01 Creativity over Compute, Democratizing Fortune 500 Design, MCP for Designers.
**Source:** Framer CSV HTML → convert to MDX.

### 3. Playbooks

**Schema defined, content empty (future work):**

```typescript
interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // /src/content/playbooks/{slug}.mdx
  author: { name: string; image?: string };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
}
```

**Files:** `/src/data/playbooks.ts` (empty array), `/src/content/playbooks/` (empty directory with `.gitkeep`).

### 4. Free Resources

**New type and data file:**

```typescript
type ResourceBadge = 'live' | 'coming-soon';

interface ResourceMedia {
  type: 'image' | 'video';
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

**5 resources:** Portfolio Template, Design Directory, Brand Design System, Linktree Template, KARIMO.
**Asset source:** `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/` → copy to `/public/images/resources/`.

---

## Task Summary

Tasks are organized in 4 waves. Full detail in `tasks.yaml`.

| Wave | Focus | Tasks | Key Outputs |
|------|-------|-------|-------------|
| 1 | Foundation | T001–T004 | Image download script, enriched schemas, content directories, next.config update |
| 2 | Content Migration | T005–T008, T013 | All project/blog/resource/legal data populated, playbook scaffolding |
| 3 | Component Updates | T009–T012, T014, T019–T020 | Project detail, blog MDX, resource cards, filter update, homepage + about images |
| 4 | Integration & Polish | T015–T018 | Lab page, SEO, validation script, template strip script |

**Total tasks:** 20
**Estimated complexity sum:** 89 points

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| framerusercontent.com URLs change or expire | Medium | High | Download immediately as Wave 1 priority |
| HTML-to-MDX conversion produces broken markup | Medium | Medium | Manual review each post; keep original HTML as fallback comment |
| About page hero (7008x4672) causes build issues | Low | Medium | Let Next.js Image handle optimization; set `quality: 85` |
| `next-mdx-remote` version conflicts with Next.js 16 | Low | High | Pin compatible version; test in Wave 1 as part of schema task |
| OS_our-links asset paths differ from expected structure | Low | Low | Audit repo structure before T007 |
| Multi-tag filter breaks existing project listing | Medium | Medium | Update filter logic in same task as schema change (T005) |

---

## Success Criteria

- [ ] All ~75 images downloaded to `/public/images/` with no 404s at build time
- [ ] `npm run build` passes cleanly with zero TypeScript errors after each wave
- [ ] All 5 project detail pages render Challenge / Solution / Impact sections with gallery images
- [ ] All 4 blog posts render as MDX with correct metadata (author, date, reading time, category)
- [ ] Multi-tag project filtering works on `/projects` listing page
- [ ] Free resources section renders 5 cards with correct media and links
- [ ] Legal pages are accessible at `/legal/terms` and `/legal/privacy`
- [ ] Template strip command removes all proprietary content without breaking build
- [ ] `npm run lint` passes with zero errors after all waves complete
- [ ] No images reference external CDN domains in production build
