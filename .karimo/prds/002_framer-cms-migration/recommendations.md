# Brief Review: framer-cms-migration

**Reviewed:** 2026-04-07
**Briefs reviewed:** T001–T020 (20 tasks)
**Codebase verified against:** `main` branch at `/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio`

---

## Critical Issues (must fix before execution)

### C1 — T006/T011 Build Break: `post.content` removed but blog detail page reads it at runtime

**Affected briefs:** T006 (line 293–355), T011 (line 25–42)
**Codebase evidence:** `src/app/blog/[slug]/page.tsx` line 53 calls `p.category === post.category`; `src/components/blog/blog-post.tsx` line 117 calls `post.content.split("\n\n")`.

T006 instructs removing `content: string` from blog.ts records and replacing with `contentPath`. However, `blog-post.tsx` directly renders `post.content.split("\n\n")` — this will throw at runtime the moment T006 removes the field, causing all 4 blog post pages to crash. T006's guidance acknowledges this (the "bridge" options) but leaves the resolution ambiguous, which will cause a broken build in Wave 2 before T011 arrives in Wave 3.

**Fix:** Update T006 to explicitly require adding a temporary `content: ""` stub alongside `contentPath` in blog.ts records, OR explicitly require updating the blog detail page to guard against undefined `post.content` before the MDX renderer is ready. Also note that `src/app/blog/[slug]/page.tsx` line 53 uses `p.category === post.category` for related posts filtering — after T002 changes BlogCategory values, old category strings will produce no matches (not a crash, but silently broken related posts).

---

### C2 — T007/T002/T012 Schema Conflict: `badge` field type is inconsistent across three tasks

**Affected briefs:** T002 (line 263–272), T007 (lines 40, 162–178, 202+), T012 (line 62, 138, 143)
**Detail:**

- T002 defines: `export type ResourceBadge = 'live' | 'coming-soon'` and `badge: ResourceBadge` on `FreeResource` — meaning `badge` is a plain string union.
- T007 defines in its own "Expected FreeResource Type" section: `badge: ResourceBadge` where `ResourceBadge = { text: string; variant: BadgeVariant }` — meaning badge is an **object**.
- T007's actual data records use: `badge: { text: "Live", variant: "live" }` — the object shape.
- T012's `ResourceBadgeChip` component renders: `badge === "live"` and `badge === "coming-soon"` — treating badge as a **plain string**.

The type is incompatible between T002 (string) → T007 (object) → T012 (string comparison). Whichever shape T002 ships will break either T007's data or T012's rendering.

**Fix:** Decide on one canonical shape and propagate it consistently. The PRD (research/findings section 6) uses the object shape `{ quote, author }` but the PRD type definition uses the simple string union. The most practical fix is to align on T002's simple string union (`badge: 'live' | 'coming-soon'`) and update T007 data records to use `badge: "live"` not `badge: { text: "Live", variant: "live" }`. T012 badge rendering is already written for the string shape and won't need changes.

---

### C3 — T005 Slug Conflict: `google-gemini-infinite-nature` vs existing `gemini-infinite-nature`

**Affected brief:** T005 (lines 247, 266+, 410)
**Codebase evidence:** `src/data/projects.ts` line 47–48: `id: "gemini-infinite-nature"`, `slug: "gemini-infinite-nature"`.

T005 instructs using slug `google-gemini-infinite-nature` (matching the Framer CSV and T001 image download paths). The existing codebase record uses `gemini-infinite-nature`. T001 downloads images to `/public/images/projects/google-gemini-infinite-nature/`. If T005 changes the slug to `google-gemini-infinite-nature`, the existing `/projects/gemini-infinite-nature` URL will 404 and any hardcoded references will break. T005 acknowledges the discrepancy but doesn't mandate a redirect.

**Fix:** Add a redirect rule to `next.config.ts` for `/projects/gemini-infinite-nature` → `/projects/google-gemini-infinite-nature`, OR instruct T001 to use `/public/images/projects/gemini-infinite-nature/` to match the existing slug. The brief currently says "Use the Framer CSV slug" but that breaks existing URL. Document the chosen approach explicitly.

---

### C4 — T008 Incorrect Assumption: `/terms` and `/privacy` routes already exist

**Affected brief:** T008 (lines 662–664)
**Codebase evidence:** `src/app/terms/` and `src/app/privacy/` both exist (`page.tsx` confirmed in each directory).

T008 says: "There are no existing `/src/app/terms/` or `/src/app/privacy/` directories (confirmed via codebase check). No redirect needed — the old hrefs simply didn't have corresponding pages." This is factually wrong — both directories exist. T008 will need to either remove or redirect these existing routes, not just create new `/legal/` pages.

**Fix:** Update T008 to require removing or redirecting the existing `/src/app/terms/page.tsx` and `/src/app/privacy/page.tsx` routes. Add a step to verify the existing routes and decide: delete them (simplest) or add `redirect()` calls to the new `/legal/terms` and `/legal/privacy` routes.

---

### C5 — T018 Stub Schema Mismatch: `ProjectSection` stub has `type` field that doesn't exist in T002's schema

**Affected brief:** T018 (lines 116–128)
**T002 schema:** `ProjectSection` has `{ heading: string; headline: string; body: string }` — no `type` field.

The T018 `projects.ts` stub includes `type: "challenge"` on each section object:
```
{ type: "challenge", heading: "...", headline: "...", body: "..." }
```
This extra `type` field doesn't exist in the `ProjectSection` interface defined by T002. TypeScript strict mode will reject this, causing `npm run build` to fail after the strip script runs.

**Fix:** Remove the `type` field from all three section objects in the T018 `PROJECTS_STUB` constant. The stub sections should match T002's interface exactly: `{ heading, headline, body }`.

---

### C6 — T018 Stub Schema Mismatch: `FreeResource` badge field

**Affected brief:** T018 (lines 183–191)
**T002 schema:** `badge: ResourceBadge = 'live' | 'coming-soon'` (simple string) OR per T007's object shape — see C2.

T018's free-resources stub uses `badge: "live"` which matches T002's simple string union. However if T007's object shape wins (badge as `{ text, variant }`), the T018 stub will also break TypeScript.

**Fix:** Resolve C2 first, then ensure T018 stub matches the settled schema.

---

### C7 — T005/T009 Filter Logic Duplication with Conflicting Scope

**Affected briefs:** T005 (lines 83–101, 335–336), T009 (lines 63–99)
**Detail:** T005 instructs updating the filter logic in `src/app/projects/page.tsx` (change `p.category ===` to `p.categories.includes()`). T009 also instructs the same change to the same file (lines 63–70). Both tasks are in different waves (Wave 2 and Wave 3) and both claim ownership of this change in `projects/page.tsx`.

If T005 makes the change in Wave 2, T009 will find nothing to do (or will apply a redundant change). If T005 doesn't fully complete it, T009 won't know what state the file is in. The execution plan assigns them to different waves with T009 depending on T005 — but both briefs list `projects/page.tsx` as a file to modify for the same filter logic change.

**Fix:** Explicitly scope T005 to **only** populating project data records in `projects.ts`, and move the filter logic update entirely to T009. T005's current brief has a filter logic section (Implementation Guidance, lines 380–405) that should be removed and owned solely by T009. This prevents conflicting edits.

---

### C8 — T015 Navigation Assumption: `footerNavItems.theLab` structure differs from brief

**Affected brief:** T015 (lines 87–98)
**Codebase evidence:** `src/data/navigation.ts` lines 27–31: `footerNavItems.theLab` contains `[Blog, Playbooks, Free Assets, View All]`. T015 says it should change `"View All" href /templates → /lab`. The actual "View All" entry exists and does point to `/templates` — this part is correct.

However, T015 also says the `overlayNavItems` "The Lab" href should change from `/templates` to `/lab`. The actual `overlayNavItems` array has `The Lab` children including `{ label: "Resources", href: "/resources" }` — not `{ label: "Free Assets", href: "/free-assets" }` as described. This is a minor discrepancy but could cause the agent to update the wrong entry or miss an entry.

Additionally, `footerNavItems.theLab` has a `{ label: "Free Assets", href: "/free-assets" }` entry that does not have a corresponding route — the brief doesn't address this orphaned link.

**Fix:** Update T015 to reflect the actual `footerNavItems.theLab` array (4 items, not 3). Remove the navigation description that doesn't match what's in the file. The agent should be told to check the file before editing rather than given a simplified description.

---

## Warnings (should address)

### W1 — T002 Instructs Removing Old BlogCategory Values But They May Still Be Used

**Affected briefs:** T002 (line 94), T006 (line 321–323)
**Detail:** T002 replaces BlogCategory with `'Creative Philosophy' | 'About Us' | 'Digital Design' | 'Design Strategy' | 'Brand Identity'`, removing `"Design" | "AI" | "Process" | "Insights"`. The existing 3 blog posts in `blog.ts` use `"Design"`, `"AI"`, and `"Process"`. T002 also instructs replacing the posts in `blog.ts` with the 4 real posts — but T006 shows the expected type still includes the old values `"Design" | "AI" | "Process" | "Insights"` in the "Expected BlogPost Type After T002" section (line 321–323). This suggests T006 thinks T002 keeps the old values, but T002 removes them entirely.

**Fix:** T006's "Expected BlogPost Type After T002" section should be updated to show only the new BlogCategory values from T002. The old values should not appear in T006's documentation.

---

### W2 — T019 Component Name Mismatch in Files-to-Modify Table

**Affected brief:** T019 (line 197)
**Detail:** T019's "Files to Modify" table lists `src/components/home/what-we-do-section.tsx`. The component function inside that file is `OurExpertiseSection` (renamed in a recent commit per the git log: "rename WhatWeDoSection to OurExpertiseSection"). The file path is correct but any instructions that refer to the export name should say `OurExpertiseSection`, not `WhatWeDoSection`. The brief's body text correctly says `(now named OurExpertiseSection)` but the component is imported elsewhere — the agent should verify import sites are correct.

---

### W3 — T015 `FreeResourcesGrid` API Assumption May Conflict with T012

**Affected briefs:** T015 (line 125), T012 (lines 107–123)
**Detail:** T015's implementation example shows `<FreeResourcesGrid resources={freeResources} />` — passing a `resources` prop. T012 defines `FreeResourcesGrid` with no props (it imports `freeResources` directly from `@/data/free-resources`). If T012 ships without a `resources` prop, T015's usage will cause a TypeScript error.

T015 does acknowledge this in the edge cases section ("If FreeResourcesGrid doesn't accept a resources prop, check the actual component signature") — but the example code will mislead the agent.

**Fix:** Update T015's example code to match T012's no-prop design: `<FreeResourcesGrid />`. The note in edge cases is not sufficient when the primary example is wrong.

---

### W4 — T009 and T010 Both Modify `project-detail.tsx` with Overlapping Category Logic

**Affected briefs:** T009 (line 75–79), T010 (line 52–53)
**Detail:** T009 modifies `project-detail.tsx` line 54 to change `{project.category}` → joined category labels. T010 also modifies `project-detail.tsx` extensively. Both are Wave 3 tasks and both list `project-detail.tsx` as a file they touch. T009 makes the category display change, T010 makes the full enriched layout change. If run in parallel (both are Wave 3, run_order: 1), there will be a merge conflict on this file.

**Fix:** T010 should note that `project-detail.tsx` also requires the category rendering change from T009, and include T009 as a blocking dependency (run T009 first, then T010). The current execution plan doesn't sequence them — add `run_order: 1` for T009 and `run_order: 2` for T010 in Wave 3.

---

### W5 — T019 Accesses `src/data/blog.ts` Already Claimed by T006

**Affected briefs:** T019 (lines 158–166, 197), T006 (lines 283–287)
**Detail:** T019 says "Update `src/data/blog.ts` thumbnail paths — verify or update". T006 already claims ownership of blog.ts and sets thumbnail paths as part of populating the 4 real posts. T019's modification is a verification/correction step but is listed as a file modification, which could create confusion about ownership.

**Fix:** Change T019's action for `src/data/blog.ts` from "modify" to "verify only". If paths don't match, the fix should be applied in T006 not T019. This prevents T019 from accidentally overwriting T006's work.

---

### W6 — T001 Missing 4 Blog Thumbnails from Total Count

**Affected brief:** T001 (line 151–166, overall count)
**Detail:** T001's brief claims to download ~75 images. Counting the catalog: 40 project images + 6 homepage images (hero + 4 service + 1 team) + 7 about images + 4 blog thumbnails = 57 unique downloads. The 75 figure from the PRD includes the about BILTFOUR logo SVG and client logos already in `/public/logos/`. The script's catalog in T001 only lists 57 images, not 75. The MCP thumbnail (`6zZWCJwMNLKAwcShUSZbwsO7prA.jpg`) is listed correctly.

The discrepancy is ~18 images. The success criteria say "~75 images downloaded" but the script will only produce ~57. The PRD count likely includes client logos already present locally.

**Fix:** Clarify in T001 that the ~75 figure includes assets already locally present. The script only needs to download the ~57 framerusercontent.com images. Update the success criteria summary line to say "~57 new images downloaded" to prevent the executing agent from thinking the script failed.

---

### W7 — T011 Doesn't Instruct Updating `p.category === post.category` Related Posts Filter

**Affected brief:** T011 (reviewing blog detail page)
**Codebase evidence:** `src/app/blog/[slug]/page.tsx` line 53: `(p) => p.id !== post.id && p.category === post.category`.

After T002 changes BlogCategory values (removing old values, adding new ones), this filter will still work syntactically but all 3 existing posts with old category values will produce empty related posts arrays until T006 updates their category values. T011 doesn't instruct fixing this filter logic to use the new BlogCategory values.

This is not a crash but a silent functional regression (no related posts shown). T011 should note that this filter requires the T002/T006 BlogCategory migration to be complete before it works correctly.

---

## Observations (nice to know)

### O1 — External Data Source Confirmed: `OS_our-links` assets exist at flat path, not subdirectory

**Detail:** The `OS_our-links` repo stores images at `/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/` (confirmed). T007 correctly identifies this path and notes the alternative subdirectory possibility. All 10 required asset files (9 JPGs + 1 MP4) are present at that flat path. T007's implementation guidance is accurate.

---

### O2 — `src/lib/` exists but has no `mdx.ts` yet

**Detail:** T011 creates `src/lib/mdx.ts`. The directory exists (`motion.ts`, `utils.ts`, `tv-channels.ts` confirmed). No conflict — `mdx.ts` is a net-new file.

---

### O3 — `src/types/index.ts` Does Not Yet Exist

**Detail:** T002 instructs creating `src/types/index.ts` as a barrel export. The current `src/types/` directory only has `blog.ts` and `project.ts`. This is as expected for Wave 1 — no issue.

---

### O4 — `src/data/` Has No `categories.ts`, `free-resources.ts`, or `playbooks.ts` Yet

**Detail:** These files don't exist in the codebase (confirmed via directory listing). They are all net-new files created by T009, T007, and T013 respectively. No conflicts.

---

### O5 — `next.config.ts` Is Clean (Matches T004's Expected Starting State)

**Detail:** The current `next.config.ts` has an empty config object and no `remotePatterns`. This exactly matches what T004 describes as the current state. T004's implementation is straightforward.

---

### O6 — `BlogCard` Component Exists and Has Correct Props Interface

**Detail:** `src/components/blog/blog-card.tsx` exports a `BlogCard` component taking `{ post: BlogPost }` — matches exactly what T015 expects when building the Lab page. No prop interface mismatch.

---

### O7 — T013 References `Playbook.featured` Field But T002 Doesn't Define It

**Detail:** T013's `playbooks.ts` data file calls `playbooks.filter((p) => p.featured)` but the `Playbook` interface in T002 doesn't include a `featured?: boolean` field (unlike `BlogPost` which has it). This means `featuredPlaybooks` will always be empty and TypeScript may warn. Since the array is empty anyway, it won't cause a build failure — but it's worth fixing for consistency.

---

### O8 — `PixelTransition` in `what-we-do-section.tsx` Uses GSAP

**Detail:** T019 says the component uses `PixelTransition` with GSAP crossfade. This is a custom component. The agent will need to read the actual component to understand the `firstContent`/`secondContent` API. T019's implementation guidance is prescriptive about this pattern — the agent should verify it against the actual component rather than following the brief blindly.

---

## Summary

**Total findings:** 8 Critical, 7 Warnings, 8 Observations

### Critical issues requiring brief corrections before execution:

| ID | Task(s) | Issue | Risk |
|----|---------|-------|------|
| C1 | T006, T011 | `post.content` removed by T006 but blog detail page reads it — Wave 2 build break | Build fails |
| C2 | T002, T007, T012 | `badge` field type is string in T002, object in T007, string comparison in T012 | TypeScript errors |
| C3 | T001, T005 | Slug `google-gemini-infinite-nature` vs existing `gemini-infinite-nature` | 404 on existing URL |
| C4 | T008 | Claims `/terms` and `/privacy` routes don't exist — they do | Missing cleanup step |
| C5 | T018 | Stub `ProjectSection` has `type` field not in T002 interface | Build fails after strip |
| C6 | T018 | FreeResource stub `badge` shape depends on resolution of C2 | Build fails after strip |
| C7 | T005, T009 | Both briefs claim filter logic change in `projects/page.tsx` | Double-edit conflict |
| C8 | T015 | `footerNavItems.theLab` structure description doesn't match actual nav file | Agent edits wrong entries |

### Priority order for corrections:
1. **C2** (badge schema) — affects T002, T007, T012, T018 in a chain; must be resolved first
2. **C1** (post.content bridge) — affects Wave 2 build stability
3. **C5/C6** (T018 stub fields) — quick fix once C2 is resolved
4. **C4** (T008 `/terms` assumption) — adds a missing step
5. **C3** (slug conflict) — needs a product decision on URL strategy
6. **C7** (filter logic ownership) — clarify task scope boundary
7. **C8** (nav description) — update T015 to match actual file

