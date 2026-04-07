# Briefs Overview: framer-cms-migration (All Waves)

Generated after all task briefs are complete.

---

## All Briefed Tasks

| Task | Title | Wave | Complexity | Model | Status |
|------|-------|------|------------|-------|--------|
| [T001](T001_image-download-script.md) | Write image download script | 1 | 4 | sonnet | ready |
| [T002](T002_typescript-schemas.md) | Define enriched TypeScript schemas | 1 | 5 | opus | ready |
| [T003](T003_content-directory-structure.md) | Set up content directory structure | 1 | 2 | sonnet | ready |
| [T004](T004_next-config-image-optimization.md) | Update next.config.ts for image optimization | 1 | 2 | sonnet | ready |
| [T005](T005_framer-cms-migration.md) | Migrate all 5 project data records | 2 | 8 | opus | ready |
| [T006](T006_framer-cms-migration.md) | Convert 4 blog posts from HTML to MDX files | 2 | 6 | opus | ready |
| [T007](T007_framer-cms-migration.md) | Migrate free resources data and copy assets | 2 | 4 | sonnet | ready |
| [T008](T008_framer-cms-migration.md) | Migrate legal page content from CSV HTML | 2 | 4 | sonnet | ready |
| [T013](T013_framer-cms-migration.md) | Create playbook schema and empty content infrastructure | 2 | 3 | sonnet | ready |
| [T009](T009_category-system.md) | Update category system to multi-tag with canonical slugs | 3 | 3 | sonnet | ready |
| [T010](T010_project-detail-page.md) | Update project detail page to render enriched schema | 3 | 7 | opus | ready |
| [T011](T011_blog-mdx-renderer.md) | Update blog system to render MDX files | 3 | 6 | opus | ready |
| [T012](T012_free-resources-components.md) | Create free resources data structure and card component | 3 | 5 | opus | ready |
| [T014](T014_project-listing-filter.md) | Update project listing to use multi-tag filtering | 3 | 4 | sonnet | ready |
| [T019](T019_homepage-images.md) | Update homepage components with downloaded image paths | 3 | 4 | sonnet | ready |
| [T020](T020_about-images.md) | Update about page components with downloaded image paths | 3 | 4 | sonnet | ready |
| [T015](T015_lab-page.md) | Build Lab / View All page | 4 | 5 | opus | ready |
| [T016](T016_seo-metadata.md) | Add SEO metadata generation from content | 4 | 4 | sonnet | ready |
| [T017](T017_content-validation.md) | Write content validation script | 4 | 4 | sonnet | ready |
| [T018](T018_template-stripping.md) | Write template stripping script | 4 | 5 | opus | ready |

---

## Wave Breakdown

### Wave 1 — Foundation (no dependencies, all run in parallel)

- **T001** — Node.js script that downloads ~75 images from framerusercontent.com to `/public/images/` with correct subdirectory layout. Idempotent, resilient to failures. Output required by T005, T019, T020.
- **T002** — Enriches `src/types/project.ts` and `src/types/blog.ts`, adds new `src/types/playbook.ts` and `src/types/free-resources.ts`. Installs `next-mdx-remote`. Updates existing data stubs to match new schemas so the build stays green. Required by T005, T006, T007, T008, T013.
- **T003** — Creates `src/content/blog/`, `src/content/playbooks/`, and `src/content/legal/` with `.gitkeep` and `README.md` files. Verifies tsconfig path resolution. Required by T006, T008, T013.
- **T004** — Adds an `images` block to `next.config.ts`: empty `remotePatterns`, `deviceSizes`, `imageSizes`, `formats`. Documents the about-page hero size consideration. Required by T019, T020.

### Wave 2 — Content Migration (depends on Wave 1)

All Wave 2 tasks can run in **parallel** once their specific Wave 1 dependencies are met:

| Task | Specific Dependencies |
|------|-----------------------|
| T005 | T001 (images downloaded), T002 (Project type enriched) |
| T006 | T002 (BlogPost type with contentPath), T003 (src/content/blog/ exists) |
| T007 | T001 (public/images structure), T002 (FreeResource type) |
| T008 | T002 (next-mdx-remote installed), T003 (src/content/ structure) |
| T013 | T002 (Playbook type), T003 (src/content/playbooks/ exists) |

- **T005** — Populates `src/data/projects.ts` with all 5 enriched project records from Framer CSV. Full section content (Challenge/Solution/Impact), image arrays, categories as `string[]`, testimonials (Iterra), results (BILTFOUR/NEXT/UA). Also updates filter logic in the projects page.
- **T006** — Creates 4 MDX files in `src/content/blog/` (EP02, EP01, Democratizing, MCP for Designers). Replaces 3 stub posts in `src/data/blog.ts` with 4 real posts using `contentPath` field. Adds 4th post entirely missing from codebase.
- **T007** — Creates `src/data/free-resources.ts` with 5 resource records. Copies 10 media files (9 images + 1 MP4) from the `OS_our-links` repo to `public/images/resources/`.
- **T008** — Creates `/legal/terms` and `/legal/privacy` routes with shared layout. Converts Framer Legal.csv HTML to MDX. Updates footer navigation hrefs from `/terms` → `/legal/terms`.
- **T013** — Creates empty `src/data/playbooks.ts`, `src/app/playbooks/page.tsx` (empty state), and `src/app/playbooks/[slug]/page.tsx` (shell with graceful empty `generateStaticParams`).

### Wave 3 — Component Updates (depends on Wave 2)

- **T009** — Creates `src/data/categories.ts` with 5 canonical slugs and display labels. Removes old `ProjectCategory` enum. Updates filter components to use new data source. Required by T014.
- **T010** — Replaces placeholder layout in `project-detail.tsx` with full case study rendering: sections (Challenge/Solution/Impact), gallery images, testimonials (Iterra only), results metrics, services, CTA. Creates 4 new sub-components.
- **T011** — Adds `src/lib/mdx.ts` + `src/components/blog/mdx-components.tsx`. Updates blog detail page to read MDX files from disk and compile via `next-mdx-remote`. Replaces the primitive paragraph splitter in `blog-post.tsx`.
- **T012** — Creates `FreeResourceCard` and `FreeResourcesGrid` components in `src/components/resources/`. Handles image and video media types, hover crossfade, badge variants, and external CTA links.
- **T014** — Completes multi-tag filter integration: `project-filters.tsx` uses display labels from `categories.ts`; filter state uses slugs; multi-tag intersection works correctly.
- **T019** — Wires downloaded images into `OurExpertiseSection` (service images in accordion), `ProjectCard` (project thumbnails via next/image), and verifies blog thumbnail paths. Updates `what-we-do.ts` with optional `image` field.
- **T020** — Updates `TeamShowcase` team photos and `AboutHero` to render downloaded about-page images. Adds large hero image below the about page text.

### Wave 4 — Integration and Polish (depends on Waves 2 + 3)

- **T015** — Creates `/src/app/lab/page.tsx` as a unified content hub showing all 5 free resources, 4 blog posts, and a graceful empty state for playbooks. Updates navigation to `/lab`. Creates `LabHero` component.
- **T016** — Adds/improves `generateMetadata()` with og:image and canonical URLs on all dynamic pages. Adds static metadata to static pages that are missing it.
- **T017** — Node.js script `scripts/validate-content.js` that checks all image paths, MDX content paths, required fields, and HTTPS URLs across all data files. CI-ready: exits 0/1.
- **T018** — Node.js script `scripts/strip-for-template.js` that removes proprietary MDX content, replaces data files with template stubs, creates placeholder images, and verifies the build still passes.

---

## Wave 2 File Overlap Analysis

No file conflicts exist across Wave 2 tasks. All tasks touch disjoint files:

| File | Task | Notes |
|------|------|-------|
| `src/data/projects.ts` | T005 | Replaces stub records |
| `src/app/projects/page.tsx` | T005 | Updates filter logic only |
| `src/components/projects/project-filters.tsx` | T005 | Updates type from enum to string |
| `src/content/blog/*.mdx` | T006 (4 new files) | Net-new files |
| `src/data/blog.ts` | T006 | Replaces 3 stubs with 4 real records |
| `src/data/free-resources.ts` | T007 (creates) | Net-new file |
| `public/images/resources/` | T007 (10 asset files) | Net-new directory |
| `src/content/legal/*.mdx` | T008 (2 new files) | Net-new files |
| `src/app/legal/**` | T008 (3 new files) | Net-new routes |
| `src/data/navigation.ts` | T008 | Updates `/terms` → `/legal/terms` hrefs only |
| `src/data/playbooks.ts` | T013 (creates) | Net-new file |
| `src/app/playbooks/**` | T013 (2 new files) | Net-new routes |

---

## Wave 3 Execution Order

```
T009  ──────────────►  T014
T010  (independent of other Wave 3 tasks)
T011  (independent of other Wave 3 tasks)
T012  (independent of other Wave 3 tasks)
T019  (independent of other Wave 3 tasks)
T020  (independent of other Wave 3 tasks)
```

Only T014 has an intra-wave dependency (on T009). All other Wave 3 tasks can run in parallel.

---

## Full Dependency Graph (All Waves)

```
T001 ──────────────────────────────────────┐
                                           ├──► T005 ──► T009 ──► T014
T002 ──────────────────────────────────────┤     │
      │                                    │     └──────────────► T010 ──► T016
      │                                    ├──► T006 ──► T011 ──► T015 ──► T016
      │                                    ├──► T007 ──► T012 ──► T015
T003 ─┼────────────────────────────────────┤                               T016
      │                                    ├──► T008
      │                                    └──► T013 ──► T015
T004 ─┘
      └──► T019
      └──► T020

T005 + T006 + T007 ──► T017 ──► T018
```

---

## Quick Links

- [PRD](../PRD_framer-cms-migration.md)
- [Tasks](../tasks.yaml)
- [Research Findings](../research/findings.md)

---

_For full briefs, see individual `T0XX_*.md` files._
_PRD: framer-cms-migration | Waves: 1, 2, 3, 4 | Updated: 2026-04-07_
