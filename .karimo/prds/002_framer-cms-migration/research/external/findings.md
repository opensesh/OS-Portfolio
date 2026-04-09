# External Research Findings — Framer CMS Migration
# Project: OS-Portfolio | Date: 2026-04-09

---

## Executive Summary

External research validated the migration's architectural decisions (file-based CMS, TypeScript registries, no-frontmatter MDX) as aligned with Next.js 16 best practices. One critical finding: `next-mdx-remote` was archived by HashiCorp on April 9, 2026 — migration to `next-mdx-remote-client` (a maintained fork) should be planned. Ten actionable optimization opportunities were identified across performance, SEO, and maintainability.

---

## Critical Finding: `next-mdx-remote` Archived

`next-mdx-remote` v6.0.0 was **archived by HashiCorp** — no further maintenance or security patches. The project functions correctly today, but migration should be planned before the next major Next.js version.

**Recommended path:** Replace with [`next-mdx-remote-client`](https://github.com/ipikuka/next-mdx-remote-client) — maintained fork with near-identical API. The change is a find-and-replace of import paths from `next-mdx-remote/rsc` to `next-mdx-remote-client/rsc`.

---

## Top 10 Actionable Takeaways

1. **Add `dynamicParams = false` to all slug routes** — Any route using `generateStaticParams` for a fixed content set should export this to return 404 for unknown slugs.

2. **Add `transpilePackages: ['next-mdx-remote']` to `next.config.ts`** — Turbopack compatibility issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)).

3. **Add `priority` prop to LCP hero images** — Project and blog page hero images are likely LCP. Without `priority`, they are lazy-loaded, hurting Core Web Vitals.

4. **Increase `minimumCacheTTL`** — Project uses 60s; Next.js 16 default is 14400s (4 hours). For a portfolio where images don't change between deploys, 60s causes unnecessary revalidation.

5. **Plan `framer-motion` → `motion/react` import migration** — The canonical package is now `motion`. The `framer-motion` alias remains but will likely be deprecated.

6. **Use `LazyMotion` for Core Web Vitals** — Full Framer Motion bundle is ~55 kB gzipped. `LazyMotion` with `domAnimation` reduces initial JS by ~30 kB.

7. **Add JSON-LD structured data** — `Article` (blog), `CreativeWork` (projects), `Organization` (homepage) schemas are absent; can improve CTR by 20-30% via rich results.

8. **Expand `sitemap.ts`** — `/free-assets` and `/playbooks` routes are currently omitted.

9. **Migrate `next-mdx-remote` before Next.js 17** — Archived package won't receive compatibility fixes.

10. **Add `blurDataURL` to about page hero** — The 7008×4672px hero benefits most from a low-res blur placeholder.

---

## Architecture Assessment

### Well-Designed

- TypeScript registry pattern (`data/*.ts`) — full type safety, tree-shakeable, no runtime parsing
- Metadata in TypeScript + body in MDX — clean separation, no frontmatter parsing at runtime
- `compileMDX` in Server Components — zero MDX runtime shipped to browser
- `remotePatterns: []` — fully decoupled from Framer CDN
- AVIF → WebP format chain — optimal format selection
- Programmatic sitemap + canonical URLs — correct SEO hygiene
- Permanent redirect for slug drift (`gemini-infinite-nature`)

### Needs Attention

| Issue | Priority |
|---|---|
| `next-mdx-remote` archived | High |
| Missing `dynamicParams = false` | Medium |
| Missing `priority` on hero images | Medium |
| No JSON-LD structured data | Medium |
| `minimumCacheTTL: 60` too low | Low |
| Incomplete sitemap | Low |
| No `blurDataURL` on large images | Low |

---

## Evidence Files

- [best-practices.md](./best-practices.md) — Next.js 16 SSG, MDX patterns, image optimization, file-based CMS, content migration, SEO
- [libraries.md](./libraries.md) — Deep evaluations of next-mdx-remote, framer-motion v12, next/image, Tailwind v4, and supporting libraries
- [references.md](./references.md) — 60+ curated links organized by topic
- [sources.yaml](./sources.yaml) — Full attribution with publisher, date, type, and topic tags
