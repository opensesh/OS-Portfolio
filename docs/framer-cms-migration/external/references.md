# References: Framer CMS Migration PRD

> All links verified or sourced in April 2026. Organized by topic.

---

## Next.js 16 Official Documentation

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js 16 Release Blog | https://nextjs.org/blog/next-16 | Cache Components, Turbopack stable, proxy.ts, React 19.2 |
| Next.js 16.1 Release Blog | https://nextjs.org/blog/next-16-1 | `next upgrade` CLI, Turbopack filesystem caching stable |
| Next.js 16.2 Release Blog | https://nextjs.org/blog/next-16-2 | 87% faster dev startup, 25-60% faster rendering, Adapters stable |
| Upgrading to Version 16 | https://nextjs.org/docs/app/guides/upgrading/version-16 | Breaking changes, codemods, migration steps |
| generateStaticParams | https://nextjs.org/docs/app/api-reference/functions/generate-static-params | SSG in App Router |
| generateMetadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Per-page SEO metadata |
| Image Component | https://nextjs.org/docs/app/api-reference/components/image | next/image API reference |
| Image Optimization Guide | https://nextjs.org/docs/app/getting-started/images | Getting started with image optimization |
| MDX Guide | https://nextjs.org/docs/app/guides/mdx | @next/mdx and next-mdx-remote patterns |
| Metadata & OG Images | https://nextjs.org/docs/app/getting-started/metadata-and-og-images | generateMetadata, openGraph, sitemap |
| Sitemap | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | MetadataRoute.Sitemap |
| Robots.txt | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots | MetadataRoute.Robots |
| Redirects | https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects | Permanent and temporary redirects |
| Dynamic Routes | https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes | [slug] file convention |
| Cache Components | https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents | "use cache" directive |
| ImageResponse | https://nextjs.org/docs/app/api-reference/functions/image-response | OG image generation |
| ISR Guide | https://nextjs.org/docs/app/guides/incremental-static-regeneration | Incremental Static Regeneration in App Router |
| DevTools MCP | https://nextjs.org/docs/app/guides/mcp | MCP integration for AI debugging |
| proxy.ts | https://nextjs.org/docs/app/getting-started/proxy | Replacement for middleware.ts |

---

## MDX Ecosystem

| Resource | URL | Notes |
|----------|-----|-------|
| next-mdx-remote GitHub | https://github.com/hashicorp/next-mdx-remote | **Archived April 9, 2026** — read-only |
| next-mdx-remote npm | https://www.npmjs.com/package/next-mdx-remote | Version history |
| next-mdx-remote-client GitHub | https://github.com/ipikuka/next-mdx-remote-client | Maintained fork — recommended migration target |
| next-mdx-remote-client npm | https://www.npmjs.com/package/next-mdx-remote-client | |
| next-mdx-remote/rsc vs @next/mdx | https://blixamo.com/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15 | When to use each (Next.js 15 context, still applicable) |
| MDX Alternatives Discussion | https://github.com/hashicorp/next-mdx-remote/discussions/438 | Community consensus on alternatives |
| MDX Comparison (dev.to) | https://dev.to/tylerlwsmith/quick-comparison-of-mdx-integration-strategies-with-next-js-1kcm | Comparison of integration strategies |
| Next.js 15 MDX Setup | https://dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k | Step-by-step guide |
| MDX Official Docs | https://mdxjs.com/docs/ | MDX spec, remark/rehype plugins |
| Turbopack + next-mdx-remote issue | https://github.com/vercel/next.js/issues/64525 | Open issue — workaround: transpilePackages |
| next-mdx-remote RSC issue #488 | https://github.com/hashicorp/next-mdx-remote/issues/488 | RSC mode issues with latest Next.js |

---

## Framer CMS and Migration

| Resource | URL | Notes |
|----------|-----|-------|
| Framer: Porting your data | https://www.framer.com/help/articles/porting-your-data-from-framer/ | Official Framer data export guide |
| CMS Export Plugin (Framer Marketplace) | https://www.framer.com/marketplace/plugins/cms-export/ | CSV/JSON export plugin for Framer CMS |
| Migrate Framer to Static Site (BrowserCat) | https://www.browsercat.com/post/migrate-framer-to-static | AI-assisted migration workflow |
| Framer Community: Export CMS | https://www.framer.community/c/support/export-cms | Community thread on CMS export options |
| Framer Community: Migrating CMS content | https://www.framer.community/c/support/migrating-cms-content-from-one-project-to-another | Migrating between Framer projects |
| CMS Migration Guide (Storyblok) | https://www.storyblok.com/mp/cms-migration-guide | General CMS migration checklist |
| CMS Migration Guide (flow.ninja) | https://www.flow.ninja/blog/cms-migration-guide | Comprehensive guide with checklist |

---

## Tailwind CSS v4

| Resource | URL | Notes |
|----------|-----|-------|
| Tailwind CSS v4 Upgrade Guide | https://tailwindcss.com/docs/upgrade-guide | Official migration from v3 to v4 |
| Tailwind CSS v4 Docs | https://tailwindcss.com/docs | Full v4 documentation |
| Tailwind v4 Migration Guide (DEV) | https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4 | 2026 community guide |
| Tailwind v4 Breaking Changes | https://designrevision.com/blog/tailwind-4-migration | CSS-first config, PostCSS changes |
| JavaScript to CSS Config Migration | https://medium.com/better-dev-nextjs-react/tailwind-v4-migration-from-javascript-config-to-css-first-in-2025-ff3f59b215ca | Detailed migration walkthrough |

---

## Framer Motion / Motion

| Resource | URL | Notes |
|----------|-----|-------|
| Framer Motion GitHub | https://github.com/framer/motion | Source, issues, releases |
| Motion npm (canonical) | https://www.npmjs.com/package/motion | Primary package as of v11+ |
| framer-motion npm (alias) | https://www.npmjs.com/package/framer-motion | Alias — still published |
| Framer Motion v12 vs React Spring (Hooked On UI) | https://hookedonui.com/animating-react-uis-in-2025-framer-motion-12-vs-react-spring-10/ | Bundle size comparison, feature matrix |
| Advanced Framer Motion 2025 | https://www.luxisdesign.io/blog/advanced-framer-motion-animation-techniques-for-2025 | Advanced techniques |
| useReducedMotion | https://www.framer.com/motion/use-reduced-motion/ | Accessibility hook |
| LazyMotion | https://www.framer.com/motion/lazy-motion/ | Bundle size optimization |

---

## Image Optimization

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js Image Optimization (DebugBear) | https://www.debugbear.com/blog/nextjs-image-optimization | Performance deep-dive |
| Next.js Performance Guide 2025 | https://justinmalinow.com/blog/nextjs-performance-optimization-guide | Comprehensive 2025 guide |
| Modern Image Formats (FrontendTools) | https://www.frontendtools.tech/blog/modern-image-optimization-techniques-2025 | AVIF vs WebP guide |
| Next.js Image Optimization (Strapi) | https://strapi.io/blog/nextjs-image-optimization-developers-guide | Developer guide |

---

## SEO in Next.js

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js SEO Guide (Digital Applied) | https://www.digitalapplied.com/blog/nextjs-seo-guide | Next.js 15/16 SEO complete guide |
| Maximizing SEO with Next.js 15 (DEV) | https://dev.to/joodi/maximizing-seo-with-meta-data-in-nextjs-15-a-comprehensive-guide-4pa7 | Metadata API walkthrough |
| Complete Next.js SEO Guide (Adeel Imran) | https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero | Zero-to-hero |
| Next.js SEO 2025 (SlateByes) | https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings | Best practices and performance |
| Next.js SEO (Strapi) | https://strapi.io/blog/nextjs-seo | Comprehensive crawlability guide |
| Structured Data Guide (eastondev) | https://eastondev.com/blog/en/posts/dev/20251219-nextjs-seo-guide/ | JSON-LD and structured data |
| SEO Optimization Guide (Medium) | https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7 | Next.js 15 SEO guide |

---

## File-Based CMS and Content Architecture

| Resource | URL | Notes |
|----------|-----|-------|
| Best CMS for Next.js 2026 (Hygraph) | https://hygraph.com/blog/nextjs-cms | Headless CMS landscape |
| Best Headless CMS for App Router (Infontic) | https://infontic.com/best-headless-cms-nextjs-app-router/ | App Router specific |
| Headless CMS Guide (Naturaily) | https://naturaily.com/blog/next-js-cms | Migration checklist |
| CMS Migration Tips (Contentful) | https://www.contentful.com/blog/cms-migration-tips/ | Content migration best practices |
| CMS for Static Sites 2026 (SimplyStatic) | https://simplystatic.com/tutorials/cms-for-static-site/ | Static site CMS options |
| Next.js searchParams static generation fix | https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix | searchParams + SSG workaround |
| Next.js App Router SSG Guide | https://www.buttercups.tech/blog/react/nextjs-app-router-ssg-guide-static-site-generation-tips | SSG tips |
| SSG with Next.js (MDN) | https://developer.mozilla.org/en-US/blog/static-site-generation-with-nextjs/ | MDN walkthrough |
