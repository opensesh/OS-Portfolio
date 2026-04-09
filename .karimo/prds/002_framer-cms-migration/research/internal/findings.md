# Internal Research Findings — Framer CMS Migration
# Project: OS-Portfolio | Date: 2026-04-09

---

## Executive Summary

The framer-cms-migration PRD successfully migrated all content from Framer CMS into the Next.js 16.2.1 codebase. All 20 tasks are complete. Content is stored in 16 TypeScript data files (`src/data/*.ts`), images are served locally from `public/images/`, and MDX powers blog + legal pages via `next-mdx-remote`. The migration established clear patterns: typed arrays for structured data, no-frontmatter MDX for long-form content, centralized animation variants in `src/lib/motion.ts`, and `generateStaticParams` for all dynamic routes.

---

## Patterns Discovered

- **16 data files** following a consistent pattern: typed array export + optional filtered derivative
- **4 formalized type modules** in `src/types/` with barrel re-export; 11 additional types inline in data files
- **MDX pipeline** using `next-mdx-remote/rsc` `compileMDX` — metadata in TypeScript, body in MDX, no frontmatter
- **Image handling** via `next/image` fill layout with local-only images (no remote patterns configured)
- **20+ animation variant sets** centralized in `src/lib/motion.ts`, used across 47 components
- **Scroll-driven animations** in project detail via `useScroll` + `useTransform`
- **devProps utility** for dev-only `data-component` attributes on all components

## Dependencies Mapped

- **Core:** next 16.2.1, react 19.2.4, framer-motion ^12.38.0, next-mdx-remote ^6.0.0
- **3D:** three ^0.183.2, @react-three/fiber ^9.5.0, @react-three/drei ^10.7.7
- **UI:** @untitledui/icons, react-aria, react-aria-components, tailwind-merge, clsx
- **Cross-file:** 4 type modules → 16 data files → ~30 components → 18 route pages

## Critical Issues Identified

| # | Issue | Severity |
|---|---|---|
| 1 | Missing `public/images/templates/` — 4 broken image refs | High |
| 2 | Blog card/post images commented out despite files existing | Medium |
| 3 | `/resources` nav link → 404 (should be `/free-assets`) | Medium |
| 4 | Contact + newsletter forms are stubs (no submission) | Medium |

## Minor Issues Identified

| # | Issue |
|---|---|
| 5 | Playbooks array empty + slug page renders stub |
| 6 | 11 interfaces not in `src/types/` (inconsistent co-location) |
| 7 | `blogCategories` runtime array in types file |
| 8 | Unused `motion` import in Server Component (`blog/page.tsx`) |
| 9 | `slugify`, `truncate`, `getReadingTime` unused in utils |
| 10 | Redirect-only pages (`/privacy`, `/terms`) in sitemap |

---

## Evidence Files

- [patterns.md](./patterns.md) — 7 pattern categories with code samples
- [errors.md](./errors.md) — 7 error/gap categories
- [dependencies.md](./dependencies.md) — NPM deps, type graph, utility map, content→component map
- [structure.md](./structure.md) — Full directory trees for data, types, content, images, routes
