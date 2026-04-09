# Best Practices: Framer CMS Migration to File-Based Next.js

> Research compiled April 2026 for the `framer-cms-migration` PRD.
> Stack: Next.js 16.2, React 19.2, TypeScript 5, Tailwind CSS 4, Framer Motion 12, next-mdx-remote 6.

---

## 1. Next.js 16 Static Site Generation (App Router)

### 1.1 `generateStaticParams` — the core SSG primitive

`generateStaticParams` replaces `getStaticPaths` from the Pages Router. It runs at build time and returns the list of route segments to pre-render. For a file-based CMS, this means reading your data arrays once at build time and emitting one HTML file per slug — exactly the pattern used in this project.

```ts
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
```

Key behaviors in Next.js 16:

- **Runs before Layouts and Pages are generated.** All `generateStaticParams` calls in a route tree are resolved first, then pages are rendered in parallel.
- **Does not auto-cache data for Server Components.** Even for statically generated pages, Server Component data is re-evaluated at request time unless `"use cache"` is applied. For a fully static portfolio with no dynamic data, this is a non-issue — all data lives in TypeScript modules that are tree-shaken at build time.
- **`dynamicParams = false`** should be set on any route where unlisted slugs should return 404, not trigger on-demand rendering. This is the correct posture for a portfolio where the content set is fixed at build time.

```ts
// Prevent unknown slugs from falling through to dynamic rendering
export const dynamicParams = false;
```

### 1.2 Next.js 16.2 performance numbers relevant to static sites

The 16.2 release (March 2026) delivered two improvements that benefit content-heavy static sites:

- **~87% faster `next dev` startup** compared to 16.1 on the default application template.
- **25–60% faster Server Component rendering** via a React RSC payload deserialization fix (eliminated the C++/JS V8 boundary overhead in `JSON.parse`).

For a site with ~75 images and ~10 project slugs, build times are already fast. The startup improvement matters more in development iteration.

### 1.3 Turbopack is now the default bundler

As of Next.js 16, Turbopack is the default bundler for both `next dev` and `next build`. If you have a Babel config (e.g., for `babel-plugin-react-compiler`), Turbopack now auto-detects and applies it rather than exiting with a hard error. To opt back to webpack explicitly:

```bash
next build --webpack
```

**Important for next-mdx-remote users:** there is an open Turbopack compatibility issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)). The workaround is:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
};
```

This project already avoids the issue because it uses `next-mdx-remote/rsc`'s `compileMDX` server-side, which does not require client transpilation.

### 1.4 Breaking changes that affect this project

| Change | Impact | Action taken |
|--------|--------|--------------|
| Async `params` in page props | `params` is now `Promise<{slug: string}>` — must be awaited | All `[slug]/page.tsx` files use `await params` |
| `images.minimumCacheTTL` default changed to 4 hours (14400s) | Previously 60s; reduces revalidation cost | Project explicitly sets `minimumCacheTTL: 60` — consider increasing to match new default |
| `images.imageSizes` default dropped `16` | Reduces srcset size | Project overrides with explicit array including 16 — acceptable but can be trimmed |
| `images.localPatterns` required for local src with query strings | Security restriction | Not applicable — no query strings on local image paths |
| Sync `cookies()`, `headers()` access removed | Must be async | Not used in static routes |
| `middleware.ts` deprecated in favor of `proxy.ts` | Rename required in future | Project has no middleware |
| `next lint` command removed from Next.js | ESLint must be run directly | `npm run lint` now uses `eslint` CLI directly — already correct |

### 1.5 Cache Components and "use cache"

Next.js 16 introduced **Cache Components** as the successor to `getStaticProps` / ISR. For a portfolio that is entirely static, this is opt-in and not required. However, if the site later adds dynamic sections (e.g., a contact form confirmation, a live resource count), `"use cache"` at the function level is the idiomatic way to cache individual data fetches rather than full-page ISR.

```ts
// Hypothetical future pattern — not required for current static build
import { unstable_cache } from 'next/cache';

const getProjects = unstable_cache(
  async () => projects,
  ['projects'],
  { revalidate: false } // never revalidate — data is static
);
```

---

## 2. MDX with Next.js — Patterns and Trade-offs

### 2.1 The two approaches: `next-mdx-remote/rsc` vs `@next/mdx`

| Dimension | `next-mdx-remote/rsc` | `@next/mdx` |
|-----------|----------------------|-------------|
| MDX files location | Anywhere — `fs.readFile` at runtime | Must be in `app/` as page files |
| Custom components | Passed at `compileMDX` call site | Configured globally in `mdx-components.tsx` |
| Frontmatter | Parsed by `compileMDX` via `vfile-matter` | Must use separate export or custom loader |
| Build-time vs runtime | MDX compiled in Server Component at request time | MDX compiled by bundler (Webpack/Turbopack) at build time |
| Turbopack compat | Requires `transpilePackages` workaround (v5/6) | First-class Turbopack support |
| Maintenance status | **Archived April 9, 2026** | Actively maintained by Vercel |
| Best for | File-backed content with metadata stored separately | When MDX files are the pages themselves |

**This project's choice (`next-mdx-remote/rsc` + external metadata in `data/blog.ts`) is the correct architecture for a CMS migration pattern**, where content metadata (slug, title, date, thumbnail) lives in a TypeScript registry and MDX files contain only the narrative body. The metadata-in-code pattern is intentional: it enables TypeScript type safety on post metadata without coupling it to MDX frontmatter parsing.

**Migration path:** Because `next-mdx-remote` was archived on April 9, 2026, the recommended migration path is `next-mdx-remote-client` (a maintained fork by ipikuka) or `@next/mdx`. For a blog with only 4–5 posts and content in `.mdx` files, the migration effort is low.

### 2.2 `compileMDX` usage pattern (current implementation)

```ts
// src/app/blog/[slug]/page.tsx
import { compileMDX } from 'next-mdx-remote/rsc';

const mdxSource = await getMdxContent(post.contentPath);
const { content } = await compileMDX({
  source: mdxSource,
  components: getMDXComponents(),
});
```

This pattern is correct for RSC. The `compileMDX` function is async and must run in a Server Component. It returns a React element (`content`) that can be passed as a child to the view component. Custom components (headings, callouts, code blocks) are injected at compile time, not via React Context — which is required in RSC since Context is not available.

### 2.3 MDX best practices for content-heavy static sites

**Content colocation:** Keep `.mdx` files in `src/content/` (not `app/`). This separates content from routing concerns and makes content searchable/portable.

**Metadata in TypeScript, body in MDX:** Do not rely on MDX frontmatter for metadata that drives routing or SEO. Parse frontmatter in `data/*.ts` files at import time for type safety and tree-shaking. This is the pattern used in this project.

**Custom components inject design system:** Provide `h1`, `h2`, `p`, `code`, `pre`, `blockquote` overrides through `getMDXComponents()` to ensure MDX content respects the design system's typography without requiring authors to know about Tailwind classes.

**Avoid client components in MDX:** All components passed to `compileMDX` run in an RSC context. Any component that uses hooks, event handlers, or browser APIs must be wrapped in `'use client'` and explicitly passed via the `components` map.

---

## 3. Image Optimization for Portfolio Sites

### 3.1 The migration rationale: local vs. remote

The core motivation for downloading ~75 images from `framerusercontent.com` to `/public/images/` is **decoupling the portfolio from Framer's CDN**. Framer's CDN URLs are not guaranteed to be permanent after a project is unpublished or a plan is downgraded. Serving from `/public/` gives full control over image availability and cache TTL.

The `next.config.ts` correctly reflects this:

```ts
images: {
  remotePatterns: [], // framerusercontent.com intentionally absent
}
```

### 3.2 Format strategy: AVIF first, WebP fallback

The project's config specifies `formats: ["image/avif", "image/webp"]`. This is optimal:

- **AVIF** is 40–50% smaller than JPEG at equivalent quality. Next.js will serve it to Chrome 85+, Firefox 93+, and Safari 16+.
- **WebP** is 25–35% smaller than JPEG and is the fallback for older browsers.
- Original formats (JPG, PNG, SVG, GIF) are served as-is if neither AVIF nor WebP is accepted.

**SVG optimization note:** `next/image` does not optimize SVGs — it serves them as-is, bypassing the optimization pipeline. This is correct behavior since SVGs are already vector. The project uses SVG for the Iterra hero (`vvl6xyIdUMskDBgstfyClKSxE8.svg`) which will be served directly.

**GIF optimization note:** Next.js does not convert animated GIFs to video. If any resource media files are animated GIFs, consider converting them to WebM/MP4 for significantly better file sizes. The project uses `.mp4` for the Design Directory resource media — good practice.

### 3.3 `priority` prop for above-the-fold images

For any image that is the Largest Contentful Paint (LCP) element — typically the hero or thumbnail on a project page — add `priority`:

```tsx
<Image
  src={project.thumbnail}
  alt={project.title}
  width={1200}
  height={630}
  priority // adds <link rel="preload"> and disables lazy loading
/>
```

Without `priority`, `next/image` lazy loads by default, which can hurt LCP scores on portfolio pages where the hero image is the primary visual.

### 3.4 `sizes` attribute for responsive images

Without `sizes`, Next.js assumes the image takes up 100% of the viewport and generates an oversized srcset. For thumbnail grids, provide accurate sizing:

```tsx
<Image
  src={project.thumbnail}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={project.title}
/>
```

### 3.5 `minimumCacheTTL` reconsideration

The project sets `minimumCacheTTL: 60` (60 seconds). The Next.js 16 default changed to 14400 seconds (4 hours). For a portfolio where images never change between deployments, increasing this to at least 3600 (1 hour) or the new default 14400 is advisable to reduce unnecessary revalidation load on Vercel's image optimization pipeline.

---

## 4. File-Based CMS Patterns in Next.js

### 4.1 The TypeScript registry pattern

This project uses a **TypeScript registry pattern**: content metadata lives in `src/data/*.ts` files that export typed arrays, while long-form narrative content lives in `src/content/blog/*.mdx`. This is the most ergonomic pattern for a developer-owned portfolio because:

- **Full type safety** — TypeScript catches missing fields, incorrect types, and stale references at compile time.
- **Tree-shaking** — unused project data is dropped from the bundle.
- **No build-time parsing overhead** — no Markdown parsing, no YAML frontmatter extraction, no filesystem scanning at build time (beyond what `generateStaticParams` needs).
- **Colocation of schema** — the `Project`, `BlogPost`, and `FreeResource` interfaces in `src/types/` serve as the CMS schema.

### 4.2 When to add a real file-based CMS layer

For a solo-developer portfolio, the TypeScript registry is appropriate. The threshold for upgrading to a tool like Contentlayer, TinaCMS, or Payload CMS is:

- Non-developer content editors who cannot edit TypeScript
- More than ~50 MDX files that require filesystem discovery (not manual registration)
- Need for live preview or visual editing

### 4.3 Slug management and redirects

One of the most common CMS migration pitfalls is slug drift — when the canonical slugs in the original CMS differ from the slugs you pick for the static site. This project correctly handles this with a permanent redirect in `next.config.ts`:

```ts
redirects() {
  return [
    {
      source: '/projects/gemini-infinite-nature',
      destination: '/projects/google-gemini-infinite-nature',
      permanent: true, // 308 — tells crawlers and browsers to update
    },
  ];
}
```

**Best practice:** Audit all published URLs from the Framer site before deployment. Use `permanent: true` (308) for slug changes where the new URL is the canonical destination.

### 4.4 Content path conventions

The `contentPath` field on `BlogPost` (e.g., `"blog/ep02-creative-ai-framework.mdx"`) stores a path relative to `src/content/`. This indirection layer (data → contentPath → MDX file) allows the blog post metadata to evolve independently of the MDX filename. If a file is renamed, only the `data/blog.ts` entry needs updating.

---

## 5. Content Migration Best Practices (CMS to Static)

### 5.1 Asset extraction strategy

Framer does not offer HTML export, but its CMS content can be exported via CSV plugins (e.g., CMS Export by Framer from the Framer Marketplace). The standard migration workflow is:

1. Export CMS collections as CSV or JSON via a Framer plugin.
2. Extract image URLs from the exported data (all from `framerusercontent.com`).
3. Download images programmatically (e.g., a Node.js script using `fetch` + `fs.writeFile`).
4. Map original URLs to new local paths in the TypeScript registry.
5. Verify all images render correctly before removing Framer origin from `remotePatterns`.

The project's `scripts/` directory is the appropriate home for such migration tooling.

### 5.2 HTML-to-MDX conversion

Blog posts in Framer CMS are stored as rich text / HTML. Converting to MDX involves:

- Stripping Framer-specific wrapper elements (`<div class="framer-*">`)
- Converting heading hierarchy to Markdown (`#`, `##`, `###`)
- Converting internal links to relative Next.js routes
- Preserving semantic structure (blockquotes, code blocks, lists)

The resulting MDX should contain only semantic content — no inline styles, no Framer class names.

### 5.3 Template-stripping for open-source release

When releasing a portfolio as an open-source template, all client-specific content must be replaced with placeholder content while preserving the structure and types. This project uses `// TEMPLATE: replace with your content` comments as markers. Best practice is to ensure:

- All image paths point to generic placeholder images included in the repo.
- All text content uses generic lorem-ipsum-style copy that demonstrates the schema.
- All external links (e.g., Figma file URLs) point to public resources or are left as `"#"`.

---

## 6. SEO for Portfolio and Agency Sites

### 6.1 `generateMetadata` — dynamic metadata per route

Next.js 16 App Router uses `generateMetadata` for per-page SEO metadata. The pattern used in this project is correct:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params; // Note: params is async in Next.js 16
  const post = blogPosts.find((p) => p.slug === slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: { /* ... */ },
  };
}
```

**Performance note:** For static pages, prefer exporting a static `metadata` object over `generateMetadata` — it avoids the async overhead. Use `generateMetadata` only when metadata depends on the slug.

### 6.2 Canonical URLs

Every page should declare a canonical URL via `alternates.canonical`. This is especially important after a CMS migration, as search engines may have indexed the old Framer domain (`*.framer.app` or a custom domain) and need to be redirected to the new canonical domain.

### 6.3 `sitemap.ts` — programmatic XML sitemap

The App Router supports a `sitemap.ts` file at `app/sitemap.ts` that exports a `MetadataRoute.Sitemap` array. This project correctly generates sitemap entries for:

- Static pages (home, about, projects, blog, templates, contact, legal)
- Dynamic project pages (one entry per project slug)
- Dynamic blog pages (one entry per post slug with `lastModified` from post date)

**Missing:** free-assets pages and playbook pages. Add these to the sitemap if they are indexable.

### 6.4 Open Graph images

For maximum social sharing preview quality:

- Provide `openGraph.images` with `width: 1200, height: 630` for all content pages.
- For project and blog pages, use the item's `thumbnail` field as the OG image.
- Consider generating OG images programmatically with `ImageResponse` from `next/og` for pages that don't have a dedicated thumbnail.

Next.js 16.2 improved `ImageResponse` performance by 2–20x, making dynamic OG image generation more viable at scale.

### 6.5 Structured data (JSON-LD)

For portfolio and agency sites, JSON-LD structured data can improve CTR by 20–30% by enabling rich results. Relevant schemas:

- `Organization` — for the agency homepage
- `Article` — for blog posts
- `CreativeWork` — for project case studies
- `BreadcrumbList` — for project and blog sub-pages

Implement via a `<script type="application/ld+json">` tag in the page `head`, injected through `generateMetadata` or a dedicated `JsonLd` Server Component.

### 6.6 `robots.ts`

The project's `robots.ts` correctly allows all crawlers and disallows `/api/` and `/_next/`. Ensure that any staging or preview deployments use a `ROBOTS_BLOCK=true` environment variable to inject `Disallow: /` for non-production origins.
