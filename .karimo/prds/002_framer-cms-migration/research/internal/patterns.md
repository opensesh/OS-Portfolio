# patterns.md — Post-Migration Code Patterns
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Data Storage Patterns

All content is stored as **typed TypeScript arrays** in `src/data/*.ts` files. There is no database, no CMS API call at runtime, and no remote fetch. Every data file begins with a `// TEMPLATE: replace with your content` comment, indicating it was scaffolded during migration from Framer CMS.

### Pattern: Static TypeScript Arrays

**File:** `src/data/projects.ts`
```ts
// TEMPLATE: replace with your content
import { Project } from "@/types/project";

export const projects: Project[] = [ ... ];
export const featuredProjects = projects.filter((p) => p.featured);
```

Every data module follows the same structure:
- Import the relevant interface from `src/types/`
- Export a named const array (e.g. `projects`, `blogPosts`, `freeResources`, `playbooks`)
- Optionally export derived filtered arrays (`featuredProjects`, `featuredBlogPosts`)

### Inventory of Data Files

| File | Export | Type |
|---|---|---|
| `src/data/projects.ts` | `projects`, `featuredProjects` | `Project[]` |
| `src/data/blog.ts` | `blogPosts`, `featuredBlogPosts` | `BlogPost[]` |
| `src/data/playbooks.ts` | `playbooks`, `featuredPlaybooks` | `Playbook[]` (empty) |
| `src/data/free-resources.ts` | `freeResources` | `FreeResource[]` |
| `src/data/categories.ts` | `CATEGORY_SLUGS`, `CATEGORY_LABELS`, `categoryLabel()` | `Category` const |
| `src/data/clients.ts` | `clients` | `Client[]` |
| `src/data/faq.ts` | `faqItems` | `FAQItem[]` |
| `src/data/navigation.ts` | `mainNavItems`, `footerNavItems`, `overlayNavItems`, `socialLinks`, `contactEmails`, `statusLines` | `NavItem[]` etc. |
| `src/data/process.ts` | `processSteps` | `ProcessStep[]` |
| `src/data/services.ts` | `services` | `Service[]` |
| `src/data/stats.ts` | `stats` | `Stat[]` |
| `src/data/team.ts` | `team`, `showcase`, `storyImages` | `TeamMember[]` |
| `src/data/templates.ts` | `templates` | `Template[]` |
| `src/data/tools.ts` | `tools` | `Tool[]` |
| `src/data/values.ts` | `values` | `Value[]` |
| `src/data/what-we-do.ts` | `whatWeDoItems` | `WhatWeDoItem[]` |

---

## 2. Type Definition Patterns

All types live in `src/types/` and are re-exported via a barrel file.

**Barrel:** `src/types/index.ts`
```ts
export * from './project';
export * from './blog';
export * from './playbook';
export * from './free-resources';
```

### Project types (`src/types/project.ts`)
```ts
export interface ProjectSection {
  heading: string;     // e.g. "The Challenge"
  headline: string;    // Bold intro sentence
  body: string;        // Full paragraph
}

export interface ProjectImage {
  src: string;         // e.g. /images/projects/iterra/filename.jpg
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  categories: string[];   // replaces single category enum from Framer
  services: string[];
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}

export type ViewMode = "carousel" | "two-column" | "grid";
```

### Blog types (`src/types/blog.ts`)
`BlogPost` interface + `BlogCategory` union + `blogCategories` const array.

### Free resource types (`src/types/free-resources.ts`)
```ts
export type ResourceBadge = 'live' | 'coming-soon';
export interface ResourceMedia { type: 'image' | 'video'; src: string; }
export interface FreeResource { id, badge, media, hoverImage?, title, description, href, buttonLabel }
```

### Supporting types defined inline in data files
- `TeamMember` — in `src/data/team.ts`
- `NavItem`, `SocialLink` — in `src/data/navigation.ts`
- `Client`, `Stat`, `Service`, `FAQItem`, `ProcessStep`, `Value`, `WhatWeDoItem`, `Tool`, `Template` — each defined in their respective data file (no matching `src/types/` file)

---

## 3. Image Handling Patterns

### next/image usage
All images use Next.js `<Image>` with `fill` layout and `sizes` for responsive optimization:

**`src/components/projects/project-detail.tsx`:**
```tsx
<Image src={images[0].src} alt={images[0].alt} fill className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw" />
```

**`src/components/resources/free-resource-card.tsx`** (with `AnimatePresence` hover crossfade):
```tsx
<Image src={resource.media.src} alt={resource.title} fill
  className="object-cover transition-transform duration-700 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
```

### next.config.ts image settings
```ts
images: {
  remotePatterns: [],  // no remote domains — all images local
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
}
```
The comment in `next.config.ts` explicitly notes: `framerusercontent.com is intentionally absent`.

### public/images/ directory structure
```
public/images/
  about/         8 files (.jpg, .webp, .svg)
  blog/          4 files (.jpg)
  homepage/      6 files (.png, .jpg)
  projects/
    biltfour/    8 files (.jpg, .svg)
    google-cloud-next/    8 files (.jpg, .svg)
    google-gemini-infinite-nature/  8 files (.jpg, .svg)
    iterra/      8 files (.jpg, .svg)
    universal-audio/  8 files (.jpg, .svg, .gif)
  resources/     10 files (.jpg, .mp4)
  team/          2 files (.webp)
```

---

## 4. Routing Patterns

Next.js 16.2.1 App Router.

### Static routes
```
/                  → src/app/page.tsx
/about             → src/app/about/page.tsx
/blog              → src/app/blog/page.tsx
/contact           → src/app/contact/page.tsx
/free-assets       → src/app/free-assets/page.tsx
/lab               → src/app/lab/page.tsx
/playbooks         → src/app/playbooks/page.tsx
/projects          → src/app/projects/page.tsx
/templates         → src/app/templates/page.tsx
/legal/privacy     → src/app/legal/privacy/page.tsx
/legal/terms       → src/app/legal/terms/page.tsx
```

### Dynamic routes with generateStaticParams
```
/projects/[slug]   → src/app/projects/[slug]/page.tsx
/blog/[slug]       → src/app/blog/[slug]/page.tsx
/playbooks/[slug]  → src/app/playbooks/[slug]/page.tsx
```

**Pattern:** `generateStaticParams` reads from the data arrays at build time:
```ts
export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
```

### Redirect in next.config.ts
```ts
{ source: "/projects/gemini-infinite-nature",
  destination: "/projects/google-gemini-infinite-nature", permanent: true }
```

### Global template for page transitions
`src/app/template.tsx` wraps every page in `<PageTransition>` using framer-motion `pageVariants`.

---

## 5. MDX/Content Patterns

### MDX pipeline for blog
1. `src/data/blog.ts` stores metadata (title, date, author, `contentPath: "blog/ep02.mdx"`)
2. `src/lib/mdx.ts` — `getMdxContent(contentPath)` reads the file from `src/content/`
3. `src/app/blog/[slug]/page.tsx` calls both then passes `content` as children to `BlogPostView`
4. `src/components/blog/mdx-components.tsx` supplies styled React replacements for h1-h3, p, ul, ol, li, blockquote, code, pre, hr, strong, em, a

```ts
// src/lib/mdx.ts
const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
export async function getMdxContent(contentPath: string): Promise<string> {
  const fullPath = path.join(CONTENT_ROOT, contentPath);
  return readFile(fullPath, "utf8");
}
```

**Key design decision:** MDX files contain **only body content** — no frontmatter. All metadata lives in `src/data/blog.ts`.

### MDX for legal pages
Legal pages use `next-mdx-remote/rsc`'s `MDXRemote` directly with `readFileSync`:
```ts
const source = readFileSync(join(process.cwd(), "src/content/legal/privacy.mdx"), "utf8");
return <MDXRemote source={source} />;
```

### Content directory
```
src/content/
  blog/          4 MDX files + README + .gitkeep
  legal/         2 MDX files + .gitkeep
  playbooks/     README + .gitkeep (no content yet)
```

---

## 6. Component Patterns

### Project card (dual-variant)
`src/components/projects/project-card.tsx` — `variant="grid"` (default) and `variant="carousel"`. Carousel variant uses `MotionValue<number>` parallax prop.

### Project detail (scroll-driven two-column)
`src/components/projects/project-detail.tsx` — JS-pinned left panel with scroll-driven section fades via `useScroll` + `useTransform`. On mobile: interleaved text/image blocks.

### Free resource card (hover crossfade + video)
`src/components/resources/free-resource-card.tsx` — handles `media.type === "video"` with `<video autoPlay muted loop>` and `media.type === "image"` with `<Image>`. Hover state triggers `AnimatePresence`-wrapped overlay.

### devProps utility
All components use `src/utils/dev-props.ts` for dev-only `data-component` attributes.

---

## 7. Animation Patterns

All animation primitives centralized in `src/lib/motion.ts`.

### Shared transitions
```ts
export const springTransition: Transition = { type: "spring", stiffness: 300, damping: 30 };
export const smoothTransition: Transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };
export const fastTransition: Transition = { duration: 0.2, ease: "easeOut" };
```

The custom easing `[0.16, 1, 0.3, 1]` (ease-out expo) is the signature easing used throughout.

### Exported variant sets (20+)
- `pageVariants` — page transitions
- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight` — directional reveals
- `staggerContainer`, `staggerContainerFast` — container stagger
- `scaleIn`, `scaleOnHover`, `imageHover` — scale interactions
- `wordContainer`, `wordReveal` — per-word stagger for hero headlines
- `menuOverlay`, `menuContent`, `menuItem` — mobile menu
- `overlayFullscreen`, `overlayColumn`, `overlayNavItem` — fullscreen overlay menu
- `accordionContent` — FAQ accordion

### Scroll-driven animations
- `project-detail.tsx` — `useScroll` + `useTransform` for section fades and parallax
- `project-carousel.tsx` — `useMotionValue` + `useSpring` for physics-based drag carousel
