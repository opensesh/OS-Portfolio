# Task Brief: T006

**Title:** Convert 4 blog posts from HTML to MDX files
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 6/10
**Model:** opus
**Wave:** 2

---

## Objective

Create 4 MDX files in `/src/content/blog/` containing the full blog post content sourced from the Framer CMS `Blog.csv` export. Update `/src/data/blog.ts` to replace the 3 existing stub posts with the 4 real posts from Framer, using a `contentPath` field instead of inline content strings. Add the 4th post (MCP for Designers) which is currently missing from the codebase entirely.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The blog system currently has 3 placeholder posts in `/src/data/blog.ts` with embedded `content` strings (markdown). The Framer CMS has 4 real posts with full HTML content. This task:

1. Creates the MDX content files (T003 creates the empty directory structure)
2. Converts Framer's HTML to clean MDX markdown
3. Replaces the stub `blog.ts` with real post metadata using `contentPath`
4. Adds the missing 4th post (MCP for Designers)
5. Adds the 3 new `BlogCategory` values (`"Creative Philosophy"`, `"About Us"`, `"Digital Design"`)

Wave 1 dependencies:
- **T002** enriches `BlogPost` type to have `contentPath: string` instead of `content: string`, and expands `BlogCategory`
- **T003** creates `/src/content/blog/` directory

This task is part of **Wave 2** — content migration.

---

## The 4 Blog Posts (Source: Framer CMS Blog.csv)

### Blog CSV Column Structure

```
Slug | Article title | Image | Image:alt | Tag (Category) | Author | Reading Time | Date | Description | Content
```

---

### Post 1: EP02 — Creative AI Framework

**Slug:** `ep02-creative-ai-framework`
**MDX file:** `src/content/blog/ep02-creative-ai-framework.mdx`
**Title:** EP02: Creative AI Framework
**Category:** `Creative Philosophy` (new — must be added to `BlogCategory` union)
**Author:** Karim Bouhdary
**Date:** `2026-02-03`
**Reading Time:** `5 min read`
**Thumbnail:** `/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg`
**Featured:** `true`

**Excerpt / Description:**
> A practical framework for integrating AI into creative work without losing the human judgment that makes design meaningful.

**MDX Content to Write:**

The Framer HTML content uses `<h2>`, `<p>`, `<strong>`, `<ul>`, `<li>` tags. Convert to clean MDX markdown. The content structure from the Framer post is:

```mdx
## The Framework

Creativity isn't something AI can replace—it's the judgment behind the work. Over the past year, we've developed a framework for integrating AI into our creative process in a way that amplifies our output without outsourcing the thinking.

## Three Layers of Creative Work

Creative work operates on three levels: **vision** (what we're trying to achieve), **execution** (how we get there), and **refinement** (making it better). AI is most powerful at the execution layer—generating variations, accelerating research, handling repetitive tasks—while vision and refinement remain deeply human.

## The Framework in Practice

**Research acceleration:** Use AI to gather competitive intelligence, identify visual references, and synthesize market patterns. What took days now takes hours.

**Exploration breadth:** Generate 20 directions instead of 5. AI gives us more surface area to explore, which means better final choices.

**Execution speed:** Automate the mechanical parts of production—resizing, variations, format conversion—so we can focus on the decisions that matter.

**Refinement judgment:** The selection, combination, and polishing of work remains human. This is where craft lives.

## What AI Can't Do

AI doesn't have taste. It doesn't know what's appropriate for a specific client's culture, what will resonate with a particular audience, or when a design direction will age poorly. These are human judgments built from years of experience and deep contextual understanding.

## The Takeaway

The designers who will thrive aren't those who use AI the most—they're those who know when to use it and when to trust their own judgment. AI is a powerful tool in the right hands. The goal is to keep the right hands on it.
```

---

### Post 2: EP01 — Creativity over Compute

**Slug:** `ep01-creativity-over-compute`
**MDX file:** `src/content/blog/ep01-creativity-over-compute.mdx`
**Title:** EP01: Creativity over Compute
**Category:** `Creative Philosophy`
**Author:** Karim Bouhdary
**Date:** `2026-01-20`
**Reading Time:** `6 min read`
**Thumbnail:** `/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg`
**Featured:** `true`

**Excerpt / Description:**
> Why the AI race to scale compute is missing the point—and why creative judgment will always be the differentiator.

**MDX Content to Write:**

```mdx
## The Compute Arms Race

Everyone is racing to build bigger models, more compute, faster inference. The underlying assumption is that intelligence scales linearly with resources. But in creative work, we've found something different.

## What Scale Gets You

More compute gets you more options. More variations, more outputs, more combinations to choose from. At a certain threshold, you have more than you can evaluate. The bottleneck isn't generation—it's judgment.

## The Judgment Gap

Here's what we've observed working with AI across brand identity, campaign design, and product work: the quality ceiling isn't set by the model. It's set by the person directing it.

A mediocre creative director with GPT-4 gets mediocre results. A sharp creative director with the same tools gets exceptional results. The variable is judgment, not compute.

## Creativity as a Competitive Moat

As AI tools commoditize, the ability to generate outputs becomes table stakes. The differentiation shifts entirely to the quality of creative judgment—knowing what's worth making, what resonates, what endures.

This is actually good news for designers who've invested in developing their taste. Your years of looking at good and bad work, understanding cultural context, knowing what clients and audiences respond to—that's the moat. AI can't replicate it.

## Practical Implications

- **Don't optimize for output volume.** More AI-generated options doesn't mean better decisions.
- **Invest in developing taste.** Study more work, develop stronger opinions, build sharper instincts.
- **Use AI to get to your best idea faster,** not to generate ideas you don't know how to evaluate.
- **The work that matters is the selection and direction,** not the generation.

## The Takeaway

Creativity over compute isn't a philosophical position—it's a practical strategy. In a world where generation becomes cheap, curation and direction become the scarce resources. Build those skills.
```

---

### Post 3: Democratizing Fortune 500 Design

**Slug:** `democratizing-fortune-500-design`
**MDX file:** `src/content/blog/democratizing-fortune-500-design.mdx`
**Title:** Democratizing Fortune 500 Design
**Category:** `About Us` (new — must be added to `BlogCategory` union)
**Author:** Karim Bouhdary
**Date:** `2025-09-13`
**Reading Time:** `7 min read`
**Thumbnail:** `/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg`
**Featured:** `false`

**Excerpt / Description:**
> How we're bringing the design quality of Google, Salesforce, and Fortune 500 companies to founders and growing businesses.

**MDX Content to Write:**

```mdx
## The Quality Gap

There's a significant gap between the design quality that Fortune 500 companies take for granted and what most founders and growing businesses can access. We've spent our careers on the inside—at Google, Salesforce, and other large organizations—and we've seen firsthand what it looks like when design is resourced properly.

## What Enterprise Design Actually Is

At large companies, design isn't just aesthetics. It's a systematic approach to solving problems: rigorous research processes, design systems that scale, brand governance, cross-functional alignment, and the judgment to know when to break the rules.

Most of these companies have entire teams dedicated to what a founder might think of as "making things look good." The difference in outcomes is stark.

## Why This Matters for Founders

When you're building a company, design is often deprioritized—it feels like a nice-to-have when resources are constrained. But design quality signals credibility, builds trust, and accelerates growth. The brands that get it right early move faster.

The challenge has always been access. Enterprise-quality design work has been locked behind either large agency fees or in-house teams that startups can't afford.

## What We're Building

Open Session exists to close this gap. We bring the systematic thinking, the design maturity, and the quality standards of large organizations to founders and growing businesses—without the overhead.

This isn't about making things look "professional." It's about building design as infrastructure: systems that scale, assets that compound, and a brand that can grow with your business.

## The Free Resources

Part of how we're democratizing access is through free resources. Our portfolio template helped our co-founder land offers at Google and Salesforce. Our design directory aggregates the best tools in the field. Our brand design system gives any team a foundation to build from.

These are real tools we use in our own work, released because we believe the ecosystem is better when quality is accessible.

## The Bigger Picture

Design quality shouldn't be a privilege. The founders building the next generation of important companies deserve access to the same systems and standards that large organizations have developed over decades.

That's what we're working on.
```

---

### Post 4: MCP for Designers

**Slug:** `mcp-for-designers`
**MDX file:** `src/content/blog/mcp-for-designers.mdx`
**Title:** MCP for Designers
**Category:** `Digital Design` (new — must be added to `BlogCategory` union)
**Author:** Karim Bouhdary
**Date:** `2025-09-12`
**Reading Time:** `5 min read`
**Thumbnail:** `/images/blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg`
**Featured:** `false`

**Excerpt / Description:**
> What Anthropic's Model Context Protocol means for designers and why it's about to change how we work with AI tools.

**MDX Content to Write:**

```mdx
## What Is MCP?

Anthropic's Model Context Protocol (MCP) is an open standard that allows AI assistants to connect to external data sources and tools. In plain terms: it lets AI like Claude reach out to your design files, your project management tools, your analytics—and work with real context instead of generic responses.

## Why This Matters for Designers

Most designers' experience with AI today is copy-paste. You screenshot something, paste it into ChatGPT, ask a question, copy the answer back into your workflow. It works, but it's friction.

MCP changes the architecture. Instead of you bridging the gap between your tools and the AI, the AI can connect directly to your tools. Your Figma files, your Notion docs, your GitHub repos, your analytics dashboards—all of it becomes accessible to an AI assistant that can actually help.

## Practical Use Cases

**Design system governance:** An AI connected to your Figma library can audit usage, flag inconsistencies, and suggest consolidations without you exporting anything.

**Client research synthesis:** Connect your AI to your research notes, interview transcripts, and competitive analysis. Ask it to synthesize themes and patterns across all of it—not just what you paste in.

**Brief generation:** An AI with access to your project history, brand guidelines, and client communications can generate briefs that are actually grounded in context.

**Asset management:** AI connected to your asset library can help you find things, identify duplicates, and suggest what's missing.

## The Design Tool Landscape Is About to Shift

The tools that build MCP integrations first will have a significant advantage. We're already seeing this with Figma's AI features, but MCP opens it up further—any tool can be a data source for AI assistance.

For designers, the question is: which tools in your stack are going to get there first, and are you ready to work with AI in this new way?

## What to Watch

- Figma MCP integration (in development)
- Notion MCP connector (already available)
- Linear and project management tools adding MCP support
- Design token platforms becoming AI-queryable

## The Bottom Line

MCP isn't hype. It's infrastructure. The designers who understand it early will be positioned to work in fundamentally different ways—less copy-paste, more connected, more leveraged. Start paying attention now.
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] 4 MDX files exist in `/src/content/blog/` with correct slugs: `ep02-creative-ai-framework.mdx`, `ep01-creativity-over-compute.mdx`, `democratizing-fortune-500-design.mdx`, `mcp-for-designers.mdx`
- [ ] Each MDX file contains clean markdown with no raw HTML, no inline styles, no `data-preset-tag` attributes
- [ ] `/src/data/blog.ts` exports 4 posts with `contentPath` field (not inline `content`)
- [ ] The 3 old stub posts (`design-systems-2025`, `ai-brand-identity`, `collaboration-remote`) are replaced by the 4 real posts
- [ ] MCP for Designers post is present with correct metadata (slug: `mcp-for-designers`, date: `2025-09-12`)
- [ ] `BlogCategory` union in `src/types/blog.ts` includes `"Creative Philosophy"`, `"About Us"`, `"Digital Design"` (T002 handles this — verify before starting)
- [ ] All 4 posts have correct `date` (ISO format YYYY-MM-DD), `readingTime`, `author.name`, `thumbnail`
- [ ] All thumbnail paths reference `/images/blog/` (local, not CDN)
- [ ] Blog listing page at `/blog` renders all 4 posts with metadata visible
- [ ] `npm run build` passes (MDX files are valid)

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/content/blog/ep02-creative-ai-framework.mdx` | create | Full MDX content for EP02 post |
| `src/content/blog/ep01-creativity-over-compute.mdx` | create | Full MDX content for EP01 post |
| `src/content/blog/democratizing-fortune-500-design.mdx` | create | Full MDX content for democratizing post |
| `src/content/blog/mcp-for-designers.mdx` | create | Full MDX content for MCP post |
| `src/data/blog.ts` | modify | Replace 3 stub posts with 4 real posts using `contentPath` |

### File Ownership Notes

- `src/types/blog.ts` is owned by T002. Verify T002 has completed before writing `blog.ts`.
- `src/app/blog/[slug]/page.tsx` is owned by T011 (Wave 3). The rendering of MDX content is out of scope here — the blog detail page will still work from `content` field until T011 updates it. Your `contentPath` change in `blog.ts` must not break the existing detail page.
- The `/src/content/blog/` directory is created by T003. Verify it exists before writing MDX files.

---

## Implementation Guidance

### Expected BlogPost Type After T002

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;         // replaces `content: string`
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

type BlogCategory =
  | "Design"
  | "AI"
  | "Process"
  | "Insights"
  | "Creative Philosophy"  // new
  | "About Us"             // new
  | "Digital Design";      // new
```

### blog.ts Data Structure

Replace the entire `blogPosts` array. The `contentPath` field should be a relative path from the project root (or from `src/`). Use:

```typescript
contentPath: "src/content/blog/ep02-creative-ai-framework.mdx"
```

The blog detail page (T011) will read this path. Keep the path format consistent across all 4 posts.

### Thumbnail Image Filenames

Thumbnails are downloaded by T001. Local paths (using the Framer hash filenames):

| Post | Thumbnail Path |
|------|---------------|
| EP02 | `/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg` |
| EP01 | `/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg` |
| Democratizing | `/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg` |
| MCP for Designers | `/images/blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg` |

### Handling Existing Blog Detail Page

`/src/app/blog/[slug]/page.tsx` currently looks up posts by slug from `blogPosts` and renders `post.content` (the inline string). After this task, `post.content` will no longer exist (replaced by `contentPath`).

**To avoid breaking the build:** Either:
1. Keep a stub `content: ""` field alongside `contentPath` until T011 migrates the detail page (not ideal but safe), OR
2. Update `generateStaticParams()` in the detail page to use slugs from the data file — but not change the rendering yet. The page may render an empty content area temporarily.

The recommended approach is option 1 — check with the team. If the build breaks, adding a temporary empty `content: ""` is acceptable as a bridge until T011.

### MDX Format

MDX files do not need frontmatter for this task. The metadata lives in `blog.ts`. Keep the MDX files as pure markdown content only:

```mdx
## Section Heading

Paragraph text here.

## Another Section

More content.
```

No frontmatter (`---`) required unless the MDX renderer in T011 expects it. Keep it simple.

### HTML to Markdown Conversion Rules

The Framer Blog.csv HTML content uses:
- `<p>` → plain paragraph (remove tags)
- `<h2>`, `<h4>`, `<h5>` → `##`, `####`, `#####`
- `<strong>` → `**text**`
- `<ul>` / `<li>` → `- item`
- `<a href="...">text</a>` → `[text](url)`
- Strip `data-preset-tag=""` attributes
- Strip `&amp;` → `&`, `&lt;` → `<`, `&gt;` → `>`

The MDX content provided in this brief has already been converted. Use it as-is — do not re-parse the CSV HTML.

### Edge Cases

- The MCP for Designers post (`mcp-for-designers`) does NOT currently exist in the codebase at all. It is a net-new addition.
- `featured` field: EP02 and EP01 are `true`, the others are `false`.
- Author field: all 4 posts use `{ name: "Karim Bouhdary" }`.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/types/blog.ts` (owned by T002)
- `src/app/blog/[slug]/page.tsx` (owned by T011)
- `src/app/blog/page.tsx` (can read for context but should not need changes)

### Files Requiring Review

- `package.json` — do not modify
- `tsconfig.json` — do not modify (T003 handles any path alias changes)

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | Updated `BlogPost` type with `contentPath` field; expanded `BlogCategory` union | Check `src/types/blog.ts` exports `contentPath` on `BlogPost` and includes `"Creative Philosophy"`, `"About Us"`, `"Digital Design"` in `BlogCategory` |
| T003 | `/src/content/blog/` directory exists and is tracked in git | Check `ls src/content/blog/` — should exist (may only have `.gitkeep`) |

### Downstream Impact

Tasks that depend on this one:
- **T011** — Updates blog detail page to render MDX content from `contentPath`
- **T017** — Validates that all `contentPath` values in `blog.ts` point to existing MDX files

**Before starting:** Verify T002 and T003 are complete. If `src/types/blog.ts` still has `content: string` and not `contentPath: string`, T002 has not landed yet.

---

## GitHub Context

**Issue:** T006 (to be created)
**Branch:** `worktree/framer-cms-migration-T006`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

```
feat(blog): add 4 MDX content files from Framer CMS

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
feat(blog): replace stub posts with real blog data in blog.ts

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] `npm run lint` passes
- [ ] 4 MDX files exist in `src/content/blog/`
- [ ] `src/data/blog.ts` has 4 posts with `contentPath` fields
- [ ] No `framerusercontent.com` URLs in any file you created/modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T006 | Wave: 2_
