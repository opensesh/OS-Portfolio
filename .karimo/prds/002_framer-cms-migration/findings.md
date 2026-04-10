# Cross-Task Execution Findings
# PRD: framer-cms-migration (002)
# Maintained by: PM Agent during /karimo:run

---

## Overview

This document tracks cross-task discoveries, shared issues, and emergent patterns found by the PM agent during execution of all 4 waves (20 tasks).

---

## Wave 1: Foundation (T001–T004)

### Discovery: Framer CDN URL stability
- **Task:** T001 (image download script)
- **Finding:** All ~75 framerusercontent.com URLs were valid at download time. No 404s encountered. CDN uses content-addressed hashing, so URLs are stable as long as the Framer project exists.
- **Impact:** No fallback image handling needed in downstream tasks.

### Discovery: next-mdx-remote compatibility
- **Task:** T002 (TypeScript schemas)
- **Finding:** `next-mdx-remote@6.0.0` installed cleanly with Next.js 16.2.1 and React 19. No peer dependency conflicts. Both `compileMDX` (RSC) and `MDXRemote` (RSC) patterns work.
- **Impact:** Unblocked T011 (blog MDX renderer) and legal page migration.

### Discovery: About page hero image dimensions
- **Task:** T004 (next.config image optimization)
- **Finding:** The about page hero (`Sj4TYZrc68BDHPXs5O5D19mVik.jpg`) is 7008x4672px — significantly larger than any other image. Next.js Image optimization handles it at build time, but it adds ~2s to first build.
- **Impact:** No code changes needed, but noted for future optimization (blurDataURL, manual resize).

---

## Wave 2: Content Migration (T005–T008, T013)

### Discovery: Framer HTML-to-MDX conversion quality
- **Task:** T005–T006 (project data, blog MDX)
- **Finding:** Framer's HTML export includes nested `<div>` wrappers and inline styles that don't map cleanly to MDX. Manual cleanup was required for all 4 blog posts. The `<em>` and `<strong>` tags converted cleanly; `<div>` containers were stripped.
- **Impact:** Future blog post imports from Framer will need the same manual cleanup pass.

### Discovery: Project slug mismatch
- **Task:** T005 (project data population)
- **Finding:** The codebase used `gemini-infinite-nature` as the project slug, but the Framer CMS and canonical URL used `google-gemini-infinite-nature`. A permanent redirect was added in `next.config.ts` to preserve SEO.
- **Impact:** T004 updated to add the redirect. No broken links in production.

### Discovery: Free resource video assets
- **Task:** T007 (free resources migration)
- **Finding:** One resource (Design Directory) uses a `.mp4` video instead of a static image. The `FreeResource` type's `ResourceMedia` union (`type: 'image' | 'video'`) handles this, and `FreeResourceCard` renders `<video>` for video media.
- **Impact:** Component pattern established for mixed media resource cards.

---

## Wave 3: Component Updates (T009–T012, T014, T019–T020)

### Discovery: Category filter multi-select complexity
- **Task:** T009 (category system) + T014 (project listing filter)
- **Finding:** Migrating from single `ProjectCategory` enum to multi-tag `string[]` required updating the filter logic from exact match to array intersection. The URL query param encoding also changed (comma-separated slugs).
- **Impact:** Filter component rewritten. No backward compatibility issues since the old filter wasn't deployed.

### Discovery: Blog images intentionally deferred
- **Task:** T011 (blog MDX renderer)
- **Finding:** Blog card and blog post hero `<Image>` tags were left commented out pending design review. The thumbnail images exist in `/public/images/blog/` but aren't rendered yet. This was a deliberate decision — the image treatment needs design direction before enabling.
- **Impact:** Blog pages render without images. Tracked as a known gap, not a bug.

### Discovery: Scroll-driven project detail performance
- **Task:** T010 (project detail page)
- **Finding:** The scroll-driven two-column layout with `useScroll` + `useTransform` performs well on desktop but required a mobile fallback. On mobile, the layout flattens to interleaved text/image blocks without scroll pinning.
- **Impact:** Mobile-specific CSS and conditional animation logic added.

---

## Wave 4: Integration & Polish (T015–T018)

### Discovery: Lab page aggregation pattern
- **Task:** T015 (lab page)
- **Finding:** The `/lab` page aggregates blog posts, playbooks, and free resources into a single feed. Since playbooks array is empty, the section renders but shows no items. The component handles empty state gracefully.
- **Impact:** No changes needed — playbook content will appear automatically when data is added.

### Discovery: Template stripping scope
- **Task:** T018 (template strip script)
- **Finding:** The template strip script removes `src/content/*` and replaces `src/data/*.ts` with stub versions. However, it does not touch `public/images/` — that directory must be manually cleared or replaced with placeholder assets.
- **Impact:** Documented in script output. Future improvement: generate placeholder gradient images.

### Discovery: SEO metadata completeness
- **Task:** T016 (SEO metadata)
- **Finding:** `generateMetadata` was added to all route pages. However, JSON-LD structured data (Article, CreativeWork, Organization schemas) was not implemented — identified as a future optimization opportunity in external research.
- **Impact:** Basic SEO is complete. Rich results require separate implementation.

---

## Cross-Cutting Observations

1. **Commit discipline held:** All 20 tasks produced individual commits. No bundled changes across tasks.
2. **No type regressions:** `npm run build` passed after every wave merge.
3. **devProps pattern adopted:** All new components followed the existing `devProps()` pattern for debug attributes.
4. **Animation consistency:** All new components used variants from `src/lib/motion.ts` rather than defining inline animations.
