# Task Brief: T011

**Title:** Update blog system to render MDX files
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 6/10
**Model:** opus
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace the current inline markdown renderer in the blog detail page with a proper MDX pipeline using `next-mdx-remote`. Wave 2 task T006 has converted all 4 blog posts into MDX files and updated `BlogPost.contentPath` — this task wires the file reading, MDX compilation, and rendering so all 4 posts display correctly at `/blog/{slug}`.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Current state

`src/app/blog/[slug]/page.tsx` derives slugs from `blogPosts` array, finds the post by slug, then passes it to `<BlogPostView>`. The view component renders content from `post.content` (an embedded markdown string) with a basic paragraph splitter:

```typescript
// In blog-post.tsx — current (to be replaced)
{post.content.split("\n\n").map((paragraph, index) => {
  if (trimmed.startsWith("## ")) {
    return <h2 key={index} ...>{trimmed.replace("## ", "")}</h2>;
  }
  return <p key={index} ...>{trimmed}</p>;
})}
```

This approach:
- Doesn't handle lists, code blocks, or nested elements
- Won't work once `post.content` no longer exists (T006 replaces it with `post.contentPath`)

### After Wave 2 (T006)

- `BlogPost.contentPath` is present as a string like `"blog/ep02-creative-ai-framework.mdx"`
- `BlogPost.content` is kept as a temporary bridge field with value `""` (empty string) — T006 added this to prevent blog-post.tsx from crashing before this task replaces the renderer. **This task must remove the `content: ""` entries from all 4 posts in `src/data/blog.ts` after updating the renderer**, OR T002 must have made `content` optional so the type still compiles after T011 removes the field.
- 4 MDX files exist at `src/content/blog/{slug}.mdx`
- `next-mdx-remote` is installed (T002 installed it as part of Wave 1)
- `src/data/blog.ts` has 4 posts with correct `contentPath` values

### What this task does

1. Create `src/lib/mdx.ts` — utility to read MDX files from disk and compile them
2. Update `src/app/blog/[slug]/page.tsx` — load MDX source at build time, pass compiled content to view
3. Update `src/components/blog/blog-post.tsx` — replace the paragraph splitter with an MDX renderer
4. Create `src/components/blog/mdx-components.tsx` — custom component map for consistent heading/paragraph/link styling

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. Create `src/lib/mdx.ts`

This module handles reading MDX files from the filesystem.

```typescript
import { readFile } from "fs/promises";
import path from "path";

/**
 * Reads an MDX file from src/content/ and returns its string content.
 * @param contentPath - e.g. "blog/ep02-creative-ai-framework.mdx"
 */
export async function getMdxContent(contentPath: string): Promise<string> {
  const filePath = path.join(process.cwd(), "src", "content", contentPath);
  return readFile(filePath, "utf-8");
}
```

### 2. Update `src/app/blog/[slug]/page.tsx`

- `generateStaticParams()`: change from iterating `blogPosts` to discovering slugs from MDX filenames in `src/content/blog/`. Use `fs.readdirSync` or keep using `blogPosts` array (either is fine since they must match). The simplest approach: keep `blogPosts.map(p => ({ slug: p.slug }))` — T006 ensures blog.ts and MDX files are in sync.
- `BlogPostPage` component: make it async, read MDX source from disk using `getMdxContent(post.contentPath)`, compile it using `next-mdx-remote/rsc` or `compileMDX`, pass the compiled content to the view.
- If using `next-mdx-remote` RSC API (`compileMDX`), the page can be a server component and pass `content` (the rendered React tree) directly to `BlogPostView`.

### 3. Update `src/components/blog/blog-post.tsx`

Replace the current content renderer section:

```tsx
// REMOVE this block:
{post.content.split("\n\n").map((paragraph, index) => { ... })}

// REPLACE with:
{children}  // passed from the page as compiled MDX content
```

Update the `BlogPostViewProps` interface:
```typescript
interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  children: React.ReactNode;  // compiled MDX content
}
```

The hero image section is currently a placeholder. Uncomment the `<Image>` tag and use `post.thumbnail` once images are available (T006 sets correct thumbnail paths). The image may not exist yet on disk — wrap in a try/catch or check existence, or render the placeholder if path doesn't resolve. Simplest: just uncomment the Image tag; if the file doesn't exist the build will error, so only do this if T001 has run and images are confirmed downloaded.

**Safe approach:** keep the hero image placeholder for now, add a TODO comment. The brief writer does not know if T001 has been run before T011 in practice.

### 4. Create `src/components/blog/mdx-components.tsx`

This provides custom HTML element overrides for MDX rendering, applying the project's Tailwind design system.

```typescript
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-display text-3xl md:text-4xl mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-heading text-2xl md:text-3xl mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-heading text-xl mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-fg-secondary text-lg leading-relaxed mb-6">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-fg-secondary text-lg mb-6 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-fg-secondary text-lg mb-6 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => (
      <strong className="text-fg-primary font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-bg-secondary px-1.5 py-0.5 text-fg-brand">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-bg-secondary p-6 overflow-x-auto mb-6 text-sm font-mono">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-bg-brand-solid pl-8 my-8 text-fg-secondary italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <Link
        href={href ?? "#"}
        className="text-fg-brand underline underline-offset-2 hover:opacity-80 transition-opacity"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  };
}
```

### 5. Page-level wiring (using `next-mdx-remote/rsc`)

In `src/app/blog/[slug]/page.tsx`:

```typescript
import { compileMDX } from "next-mdx-remote/rsc";
import { getMdxContent } from "@/lib/mdx";
import { getMDXComponents } from "@/components/blog/mdx-components";

// In BlogPostPage:
const source = await getMdxContent(post.contentPath);
const { content } = await compileMDX({
  source,
  components: getMDXComponents(),
});

return <BlogPostView post={post} relatedPosts={relatedPosts}>{content}</BlogPostView>;
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 4 blog post detail pages render MDX content without errors
- [ ] `generateStaticParams()` returns all 4 slugs (ep02-creative-ai-framework, ep01-creativity-over-compute, democratizing-fortune-500-design, mcp-for-designers)
- [ ] MDX headings (h2, h3) render with project design system styling (not browser default)
- [ ] MDX paragraphs render as styled `<p>` elements
- [ ] MDX lists (ul/ol) render correctly
- [ ] Blog listing page at `/blog` shows all 4 posts with correct metadata (title, date, category, readingTime)
- [ ] `npm run build` passes with static generation including all 4 posts
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/mdx.ts` | create | Filesystem reader for MDX content files |
| `src/components/blog/mdx-components.tsx` | create | Custom MDX component map with design system styles |
| `src/app/blog/[slug]/page.tsx` | modify | Load + compile MDX at build time, pass to view |
| `src/components/blog/blog-post.tsx` | modify | Replace paragraph splitter with `{children}` MDX renderer |

### File Ownership Notes

`src/app/blog/[slug]/page.tsx` is also the target for T016 (SEO metadata). T011 updates content rendering; T016 adds `generateMetadata()`. The current page already has `generateMetadata()` — T011 must not break it.

---

## Implementation Guidance

### next-mdx-remote Version

`next-mdx-remote` must be installed by T002 (Wave 1). Verify it is present:
```
grep "next-mdx-remote" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/package.json
```

If not installed, install it:
```bash
npm install next-mdx-remote
```

For Next.js 16 + React 19, use `next-mdx-remote` v5.x. The RSC API (`compileMDX` from `next-mdx-remote/rsc`) is the correct import for server components in the App Router.

### File Read Strategy

`src/app/blog/[slug]/page.tsx` is an async server component (App Router). It can use `fs` directly. The `getMdxContent` utility in `src/lib/mdx.ts` handles the path resolution: `path.join(process.cwd(), "src", "content", contentPath)`.

### BlogPostView becomes a server component receiver

After the change, `blog-post.tsx` receives `children: React.ReactNode`. The component already uses `"use client"` because it imports `framer-motion`. This is fine — compiled MDX content passed as `children` from a server component renders correctly inside a client component in the App Router.

### Edge Cases

- If the MDX file does not exist at the `contentPath`, `getMdxContent` will throw. This will surface at build time as a proper error rather than a silent empty page — acceptable behavior.
- `src/app/blog/[slug]/page.tsx` line 53 uses `p.category === post.category` to derive related posts. This filter requires that all 4 blog posts use the new `BlogCategory` values from T002 (e.g., `"Creative Philosophy"`, `"About Us"`, `"Digital Design"`). T006 ensures this — verify before considering the related-posts filter broken. The filter itself works correctly; it is a data dependency, not a code bug.
- The `compileMDX` call should not need frontmatter parsing since all post metadata lives in `src/data/blog.ts`, not in MDX frontmatter. Pass `{ source, components }` without a `parseFrontmatter: true` option.
- Code blocks in the MDX posts may contain language hints (```typescript, ```bash) — the `pre`/`code` component map handles basic styling. Syntax highlighting is out of scope for this task.

### Testing Each Post

After build, verify these 4 routes generate:
- `/blog/ep02-creative-ai-framework`
- `/blog/ep01-creativity-over-compute`
- `/blog/democratizing-fortune-500-design`
- `/blog/mcp-for-designers`

The build output will list all statically generated routes — check that all 4 appear.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `package.json` — only modify if `next-mdx-remote` needs to be added (T002 should have done this)
- `tsconfig.json` — do not touch (T003 set up content path aliases)
- `next.config.ts` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | Installs `next-mdx-remote`, updates `BlogPost` type with `contentPath` field, removes `content` field | Check `package.json` for `next-mdx-remote`; check `src/types/blog.ts` for `contentPath: string` |
| T003 | Creates `src/content/blog/` directory | Check `src/content/blog/` exists |
| T006 | Creates 4 MDX files in `src/content/blog/`, updates `src/data/blog.ts` with `contentPath` fields | Check that 4 `.mdx` files exist in `src/content/blog/` |

### Downstream Impact

Tasks that depend on this one:
- **T015** (Wave 4) — Lab page aggregates blog posts
- **T016** (Wave 4) — SEO metadata for blog detail pages

**Before starting:** Verify dependencies:
```
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/content/blog/
grep "contentPath" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/blog.ts
grep "next-mdx-remote" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/package.json
```
All three should return results.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** `worktree/framer-cms-migration-T011`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

```
feat(blog): render MDX content via next-mdx-remote with custom component map

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] All 4 blog slugs appear in build output as static routes
- [ ] Lint passes: `npm run lint`
- [ ] No `never_touch` files modified
- [ ] `post.content` references removed from `blog-post.tsx` (no more paragraph splitter)
- [ ] `content: ""` bridge entries removed from all 4 posts in `src/data/blog.ts` (or confirmed that `content` is declared optional in `BlogPost` type so omitting it does not cause TypeScript errors)
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T011 | Wave: 3_
