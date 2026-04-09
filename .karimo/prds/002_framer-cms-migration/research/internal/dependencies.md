# dependencies.md — Dependency Map
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Key NPM Dependencies

### Production

| Package | Version | Role |
|---|---|---|
| `next` | 16.2.1 | Framework — App Router, ISR, Image optimization |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `framer-motion` | ^12.38.0 | Animations — variants, scroll, spring, layout |
| `next-mdx-remote` | ^6.0.0 | MDX compilation for blog + legal pages |
| `gsap` | ^3.14.2 | Available but used only in specific components (text scramble, faulty terminal) |
| `three` | ^0.183.2 | 3D CRT TV scene on home/lab pages |
| `@react-three/fiber` | ^9.5.0 | React bindings for Three.js |
| `@react-three/drei` | ^10.7.7 | Three.js helpers (OrbitControls, environment maps) |
| `ogl` | ^1.0.11 | Lightweight WebGL (lab/backgrounds) |
| `clsx` | ^2.1.1 | Conditional class names |
| `tailwind-merge` | ^3.5.0 | Tailwind class deduplication |
| `@untitledui/icons` | ^0.0.22 | Icon set (line icons) |
| `@untitledui-pro/icons` | ^0.0.3 | Pro icon set (ArrowLeft, ArrowRight, ArrowUpRight) |
| `react-aria` / `react-aria-components` | ^3.47.0 / ^1.16.0 | Accessible form primitives |
| `react-powerglitch` | ^1.1.0 | Glitch effect (faulty terminal background) |
| `input-otp` | ^1.4.2 | OTP input (uui component library) |
| `@react-stately/utils` | ^3.11.0 | React Aria state management |

### Dev

| Package | Version | Role |
|---|---|---|
| `tailwindcss` | ^4 | CSS framework (v4) |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for TW v4 |
| `typescript` | ^5 | Type checking |
| `eslint` / `eslint-config-next` | ^9 / 16.2.1 | Linting |

---

## 2. Cross-File Type Dependencies

### Types imported from `src/types/`

```
src/types/project.ts
  ← src/data/projects.ts
  ← src/components/projects/project-detail.tsx
  ← src/components/projects/project-card.tsx
  ← src/components/projects/project-carousel.tsx
  ← src/components/projects/project-grid.tsx
  ← src/components/home/featured-work.tsx
  ← src/app/projects/[slug]/page.tsx

src/types/blog.ts
  ← src/data/blog.ts
  ← src/components/blog/blog-card.tsx
  ← src/components/blog/blog-post.tsx
  ← src/components/blog/blog-grid.tsx
  ← src/app/blog/[slug]/page.tsx
  ← src/app/blog/page.tsx

src/types/playbook.ts
  ← src/data/playbooks.ts
  ← src/app/playbooks/[slug]/page.tsx
  ← src/app/playbooks/page.tsx

src/types/free-resources.ts
  ← src/data/free-resources.ts
  ← src/components/resources/free-resource-card.tsx
  ← src/components/resources/free-resources-grid.tsx
```

### Types imported from data files (not re-exported via index.ts)

```
src/data/categories.ts  (Category, CATEGORY_SLUGS, categoryLabel)
  ← src/components/projects/project-card.tsx
  ← src/components/projects/project-filters.tsx
```

---

## 3. Shared Utilities

### `src/lib/motion.ts`
Imported by ~47 components. Key exports:
- `fadeInUp`, `staggerContainer` — most common pair
- `imageHover` — blog-card.tsx
- `pageVariants` — page-transition.tsx (global via template.tsx)
- `smoothTransition`, `springTransition` — carousel, accordion
- `accordionContent` — faq-accordion.tsx
- `overlayFullscreen`, `overlayColumn`, `overlayNavItem`, `menuTriggerText` — overlay-menu.tsx

### `src/lib/utils.ts`
```ts
cn()            // clsx + tailwind-merge — ~30+ components
formatDate()    // blog-card.tsx, blog-post.tsx
formatNumber()  // stats-counter.tsx
slugify()       // available but unused
truncate()      // available but unused
getReadingTime() // available but unused
```

### `src/lib/mdx.ts`
```ts
getMdxContent()  // blog/[slug]/page.tsx only
```
(Legal pages use `readFileSync` directly, bypassing this utility.)

### `src/utils/dev-props.ts`
Used by every main UI component for `data-component` debug attributes.

### `src/utils/cx.ts`
Separate cx utility used within `src/components/uui/` component library only.

---

## 4. Content File → Component Dependencies

```
src/data/projects.ts
  → src/components/projects/project-card.tsx
  → src/components/projects/project-detail.tsx
  → src/components/home/featured-work.tsx
  → src/app/projects/page.tsx
  → src/app/projects/[slug]/page.tsx
  → src/app/sitemap.ts

src/data/blog.ts
  → src/components/blog/blog-card.tsx
  → src/components/blog/blog-post.tsx
  → src/components/blog/blog-grid.tsx
  → src/app/blog/page.tsx
  → src/app/blog/[slug]/page.tsx
  → src/app/lab/page.tsx
  → src/app/sitemap.ts

src/data/free-resources.ts
  → src/components/resources/free-resource-card.tsx
  → src/components/resources/free-resources-grid.tsx
  → src/app/free-assets/page.tsx
  → src/app/lab/page.tsx

src/data/playbooks.ts
  → src/app/playbooks/page.tsx
  → src/app/playbooks/[slug]/page.tsx
  → src/app/lab/page.tsx

src/data/navigation.ts
  → src/components/layout/header.tsx
  → src/components/layout/footer.tsx
  → src/components/layout/overlay-menu.tsx

src/data/clients.ts → src/components/home/logo-marquee.tsx
src/data/what-we-do.ts → src/components/home/what-we-do-section.tsx
src/data/stats.ts → src/components/home/stats-counter.tsx
src/data/team.ts → src/components/about/team-showcase.tsx, team-section.tsx
src/data/faq.ts → src/components/home/faq-section.tsx
src/data/services.ts → src/components/home/services-section.tsx
src/data/values.ts → src/components/about/values-section.tsx
src/data/process.ts → src/components/home/process-section.tsx
src/data/tools.ts → src/components/home/impact-section.tsx

src/content/blog/*.mdx → src/lib/mdx.ts → src/app/blog/[slug]/page.tsx
src/content/legal/*.mdx → src/app/legal/*/page.tsx (readFileSync)
```
