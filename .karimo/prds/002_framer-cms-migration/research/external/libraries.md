# Library Evaluation: Framer CMS Migration Stack

> Research compiled April 2026. All version numbers reflect `package.json` at commit `b871c41`.

---

## 1. next-mdx-remote

| Field | Value |
|-------|-------|
| **Version in use** | `^6.0.0` |
| **Latest stable** | `6.0.0` |
| **GitHub** | [hashicorp/next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) |
| **Stars** | 3.1k |
| **Status** | **ARCHIVED — April 9, 2026. Read-only. No further support.** |
| **License** | MPL-2.0 |

### Purpose

Loads MDX content from any source (filesystem, API, database) and renders it inside a Next.js application. The `/rsc` import path (`next-mdx-remote/rsc`) provides a React Server Component-compatible `compileMDX` function that compiles MDX on the server without shipping the MDX compiler to the client.

### How this project uses it

```ts
import { compileMDX } from 'next-mdx-remote/rsc';

const { content } = await compileMDX({
  source: mdxSource,             // raw MDX string from fs.readFile
  components: getMDXComponents(), // design-system overrides for h1, p, code, etc.
});
```

The `compileMDX` call runs in a Server Component (`app/blog/[slug]/page.tsx`). The resulting `content` is a React element tree passed as children to `<BlogPostView>`.

### Why this pattern works

- MDX is compiled server-side — zero MDX runtime in the browser bundle.
- Custom components are injected at compile time, not via React Context (required for RSC compatibility since Context is unavailable in Server Components).
- Content metadata (slug, title, date, thumbnail) lives in `data/blog.ts` as typed TypeScript — not parsed from MDX frontmatter at runtime.

### Known issues

1. **Turbopack compatibility:** There is an open issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)) where Turbopack cannot resolve `next-mdx-remote` without `transpilePackages: ['next-mdx-remote']` in `next.config.ts`. This project uses the RSC import path, which mitigates client-side transpilation issues, but the config option should be added as a precaution once upgrading to Next.js 16's default Turbopack build.

2. **Archived status:** No bug fixes or security patches will be issued. The library remains functional for current use cases but should be migrated before the next major Next.js version.

### Trade-offs

| Pro | Con |
|-----|-----|
| Mature RSC support via `/rsc` subpath | Archived; no future maintenance |
| Separates content metadata from MDX body | Requires manual `contentPath` registry |
| No client bundle overhead (server-only compilation) | Turbopack workaround needed |
| Familiar API for teams with Pages Router history | |

### Alternatives considered

#### `next-mdx-remote-client` (recommended migration target)
- **Repo:** [ipikuka/next-mdx-remote-client](https://github.com/ipikuka/next-mdx-remote-client)
- A maintained fork of `next-mdx-remote`, created in early 2024 when the original went unmaintained.
- Supports MDX v3, App Router RSC, and Pages Router.
- API is nearly identical — migration is a find-and-replace of import paths.
- **Recommended migration:** Replace `next-mdx-remote/rsc` with `next-mdx-remote-client/rsc`.

#### `@next/mdx`
- **Purpose:** Processes `.mdx` files as first-class Next.js page files at build time.
- **Best for:** When MDX files *are* the pages (e.g., docs sites, content-as-routing).
- **Not suitable for this project:** This project stores metadata in TypeScript and uses MDX only for body content. With `@next/mdx`, frontmatter must be manually managed or handled via a custom loader, and MDX files must live in `app/` to be treated as routes.
- First-class Turbopack support — no workaround needed.

#### `mdx-bundler`
- **Purpose:** Bundles MDX content with imports from arbitrary sources.
- **Trade-off:** Output bundle is 400%+ larger than `next-mdx-remote` for basic content. Suitable for complex MDX that imports third-party components, but overkill for a narrative-only blog.

#### Plain `@mdx-js/mdx`
- Requires building custom serialization/deserialization plumbing. Not advisable unless you need direct control over the remark/rehype plugin chain.

---

## 2. framer-motion (Motion)

| Field | Value |
|-------|-------|
| **Package name** | `framer-motion` (published as `motion` on npm since v11) |
| **Version in use** | `^12.38.0` |
| **GitHub** | [framer/motion](https://github.com/framer/motion) |
| **Stars** | ~26k |
| **License** | MIT |
| **React 19 compatible** | Yes — full concurrent rendering support |

### Purpose

Animation library for React. Provides declarative `motion.*` components with spring physics, shared layout animations (`layoutId`), gesture support (drag, pan, tap), and scroll-linked animations.

### Package name clarification

In 2025, Framer Motion became an independent project and the canonical package on npm shifted to `motion`. The `framer-motion` package is kept as an alias and re-exports from `motion`. Both import paths work:

```ts
// Both are equivalent in v12
import { motion } from 'framer-motion';
import { motion } from 'motion/react';
```

For new code, prefer `motion/react`. The `framer-motion` alias will likely be deprecated in a future major.

### v12 notable additions

- `oklch`, `oklab`, `lab`, `lch`, and `color-mix()` color type support
- Hardware-accelerated scroll animations
- `layoutAnchor` prop for layout animations
- Axis-locked layout animations: `layout="x"` and `layout="y"`
- `skipInitialAnimation` in `useSpring`

### Usage patterns for portfolio animations

**Staggered entrance animations** (most common portfolio use case):

```tsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {projects.map((p) => (
    <motion.li key={p.id} variants={item} />
  ))}
</motion.ul>
```

**Reduced motion (accessibility requirement):**

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      animate={{ opacity: 1, y: prefersReduced ? 0 : -10 }}
    />
  );
}
```

**Performance:** Framer Motion animates `transform` and `opacity` by default, which are GPU-composited properties that don't trigger layout reflow. For scroll-linked effects, use the `useScroll` + `useTransform` hooks to map scroll position to CSS transform values.

### Bundle size

- **Full bundle:** ~55 kB gzipped
- **With `LazyMotion` + `domAnimation`:** ~18 kB gzipped
- **React Spring 10 (alternative):** ~20 kB gzipped

For a portfolio site where animation richness matters more than bundle size, the full bundle is acceptable. If Core Web Vitals are a priority, use `LazyMotion` to defer loading until after the critical path:

```tsx
import { LazyMotion, domAnimation } from 'framer-motion';

<LazyMotion features={domAnimation}>
  {/* motion.* components work normally inside */}
</LazyMotion>
```

### Trade-offs

| Pro | Con |
|-----|-----|
| Declarative variant system — designer-friendly | ~55 kB full bundle |
| Built-in `useReducedMotion` hook | Over-engineered for simple fade-ins |
| `layoutId` shared layout animations | LazyMotion required for bundle optimization |
| React 19 concurrent rendering support | React Spring better for pure physics |
| Scroll-linked animations with `useScroll` | |

### Alternatives considered

| Library | Bundle | Best for | Gap vs. Motion |
|---------|--------|----------|----------------|
| React Spring | ~20 kB | Physics-heavy UI | No shared layout, no variants |
| CSS Transitions/Animations | 0 kB | Simple fades | No sequence control |
| GSAP (already in project) | ~27 kB | Timeline-based, complex sequences | React integration requires wrapper |

**Note:** This project also includes `gsap: ^3.14.2`. GSAP and Framer Motion are both present. This is a valid strategy — use Framer Motion for React-idiomatic component animations and GSAP for canvas/Three.js/timeline animations (which align with `@react-three/fiber` usage).

---

## 3. next/image

| Field | Value |
|-------|-------|
| **Package** | Built into `next` |
| **Version** | `next@16.2.1` |
| **Docs** | [nextjs.org/docs/app/api-reference/components/image](https://nextjs.org/docs/app/api-reference/components/image) |

### Purpose

Wraps `<img>` with automatic format conversion (AVIF/WebP), lazy loading, responsive srcsets, layout-shift prevention, and optional blurred placeholder. Images are optimized on-demand at request time by Next.js's image optimization pipeline and cached according to `minimumCacheTTL`.

### Configuration in this project

```ts
// next.config.ts
images: {
  remotePatterns: [],                    // local-only — framer CDN intentionally removed
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/avif", "image/webp"], // AVIF first (smaller), WebP fallback
  minimumCacheTTL: 60,
}
```

### Breaking changes in Next.js 16 affecting image config

| Change | Old default | New default | Action |
|--------|-------------|-------------|--------|
| `minimumCacheTTL` | 60s | 14400s (4h) | Consider adopting new default |
| `imageSizes` | Included `16` | Dropped `16` | Project overrides — acceptable |
| `images.qualities` | `[1..100]` | `[75]` | Quality prop coerced to nearest value in array |
| `images.maximumRedirects` | Unlimited | 3 | Not applicable — no remote patterns |
| `images.dangerouslyAllowLocalIP` | Allowed | Blocked | Not applicable |

### Mixed asset type handling

This project serves SVG, JPG, PNG, GIF, and MP4 assets. Behavior per type:

| Format | `next/image` behavior |
|--------|-----------------------|
| JPG/PNG | Converted to AVIF/WebP, lazy loaded, responsive srcset |
| SVG | Served as-is (no optimization) — requires `unoptimized` prop or is fine as-is |
| GIF | Served as-is — Next.js does not convert animated GIFs |
| MP4 | Not a valid `next/image` source — use `<video>` directly |

**Recommendation:** The Design Directory resource uses an `.mp4` file as `media.src`. This is correctly rendered via `<video>` (not `<Image>`), which is the right approach.

### Trade-offs

| Pro | Con |
|-----|-----|
| Zero-config AVIF/WebP conversion | SVGs bypass optimization |
| Prevents CLS via reserved dimensions | `priority` must be set manually for LCP images |
| Built-in lazy loading | `minimumCacheTTL: 60` may cause unnecessary revalidation |
| Responsive srcsets via `sizes` prop | |

---

## 4. Tailwind CSS v4

| Field | Value |
|-------|-------|
| **Version in use** | `^4` (devDependency) |
| **PostCSS plugin** | `@tailwindcss/postcss: ^4` |
| **Docs** | [tailwindcss.com/docs](https://tailwindcss.com/docs) |

### Purpose

Utility-first CSS framework. In v4, configuration moved from `tailwind.config.js` (JavaScript) to `@theme` directives in CSS — a "CSS-first" architecture.

### Key v4 changes from v3

| Change | v3 | v4 |
|--------|----|----|
| Config file | `tailwind.config.js` | `@theme` in CSS |
| PostCSS plugin | `tailwindcss` package | `@tailwindcss/postcss` package |
| `@tailwind` directives | `@tailwind base; @tailwind components; @tailwind utilities` | `@import "tailwindcss"` |
| Performance | Baseline | 3–10x faster full builds, up to 100x faster incremental |
| CSS variable syntax | `bg-[var(--color)]` | `bg-(--color)` shorthand (still supports bracket) |

### This project's CSS convention

The project uses a **mapped Tailwind class** convention where CSS variables are exposed as semantic utility classes:

```css
/* src/styles/globals.css — @theme block */
--bg-primary: ...; /* exposed as bg-bg-primary */
--fg-primary: ...; /* exposed as text-fg-primary */
```

This avoids the `bg-[var(--bg-primary)]` bracket syntax, which does not support opacity modifiers (`/30`, `/50`). The mapped class approach is the correct v4 pattern and aligns with the project's CLAUDE.md conventions.

### Trade-offs

| Pro | Con |
|-----|-----|
| CSS-first config is version-controllable alongside styles | Migration from v3 requires config rewrite |
| 3–10x faster builds | Automated upgrade tool requires manual fixes |
| Native CSS variables as first-class citizens | Breaking changes break PostCSS v3 configs |
| No more `tailwind.config.js` maintenance | |

---

## 5. Supporting Libraries

### `@react-three/fiber` + `@react-three/drei` + `three`

| Package | Version |
|---------|---------|
| `@react-three/fiber` | `^9.5.0` |
| `@react-three/drei` | `^10.7.7` |
| `three` | `^0.183.2` |

Used for the `/lab` route's interactive 3D experiments. Three.js/R3F is client-only and should be wrapped in dynamic imports with `ssr: false` to prevent server-side rendering errors and avoid shipping WebGL code in the initial HTML.

```tsx
import dynamic from 'next/dynamic';
const Scene = dynamic(() => import('@/components/lab/Scene'), { ssr: false });
```

### `ogl` + `react-powerglitch` + `gsap`

| Package | Version | Purpose |
|---------|---------|---------|
| `ogl` | `^1.0.11` | Lightweight WebGL renderer for shader effects |
| `react-powerglitch` | `^1.1.0` | CSS glitch effect component |
| `gsap` | `^3.14.2` | Timeline-based animation for complex sequences |

These are visual effect libraries. All should be dynamically imported or wrapped in `useEffect` to ensure they only run in browser contexts.

### `react-aria` + `react-aria-components`

| Package | Version |
|---------|---------|
| `react-aria` | `^3.47.0` |
| `react-aria-components` | `^1.16.0` |

Adobe's accessible React component primitives. Used for interactive UI elements (likely filtering, dropdown, and OTP input). These are client components by nature — ensure they are used in `'use client'` boundaries.

### `clsx` + `tailwind-merge`

Standard utility combination for conditional class merging:

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`tailwind-merge` is at `^3.5.0`, which supports Tailwind v4 class resolution.
