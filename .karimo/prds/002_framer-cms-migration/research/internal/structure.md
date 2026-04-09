# structure.md — Post-Migration Directory & Route Structure
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. src/data/ — Full Tree

```
src/data/
├── blog.ts            BlogPost[] (4 posts)
├── categories.ts      Category slugs + labels + categoryLabel()
├── clients.ts         Client[] (8 clients)
├── faq.ts             FAQItem[] (5 items)
├── free-resources.ts  FreeResource[] (5 resources)
├── navigation.ts      NavItem[], SocialLink[], contactEmails, statusLines
├── playbooks.ts       Playbook[] (empty — 0 items)
├── process.ts         ProcessStep[] (4 steps)
├── projects.ts        Project[] (5 projects) + featuredProjects
├── services.ts        Service[] (4 services)
├── stats.ts           Stat[] (4 stats)
├── team.ts            TeamMember[] (1 in team) + showcase[] (2) + storyImages[]
├── templates.ts       Template[] (4 templates — images missing)
├── tools.ts           Tool[] (16 tools)
├── values.ts          Value[] (4 values)
└── what-we-do.ts      WhatWeDoItem[] (5 items)
```

---

## 2. src/types/ — Full Tree

```
src/types/
├── index.ts           Barrel — re-exports all 4 type modules
├── blog.ts            BlogPost, BlogCategory, blogCategories[]
├── free-resources.ts  FreeResource, ResourceBadge, ResourceMedia
├── playbook.ts        Playbook
└── project.ts         Project, ProjectSection, ProjectImage, ProjectTestimonial, ViewMode
```

Note: 11 additional interfaces (TeamMember, NavItem, Client, Stat, etc.) are defined inline in their data files.

---

## 3. src/content/ — Full Tree

```
src/content/
├── blog/
│   ├── .gitkeep
│   ├── README.md
│   ├── democratizing-fortune-500-design.mdx
│   ├── ep01-creativity-over-compute.mdx
│   ├── ep02-creative-ai-framework.mdx
│   └── mcp-for-designers.mdx
├── legal/
│   ├── .gitkeep
│   ├── privacy.mdx
│   └── terms.mdx
└── playbooks/
    ├── .gitkeep
    └── README.md            (stub — no MDX content yet)
```

---

## 4. public/images/ — Full Tree

```
public/images/
├── about/
│   ├── HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg     (Karim team photo)
│   ├── Sj4TYZrc68BDHPXs5O5D19mVik.jpg       (hero — 7008x4672)
│   ├── TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg
│   ├── TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg
│   ├── Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp     (Morgan team photo)
│   ├── hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg
│   ├── qvzOeu5vdocdhOTq2yANNjMg0.jpg
│   └── wKJt8b9CgcZCyP5NKky2RDcdQ.jpg
├── blog/
│   ├── 6zZWCJwMNLKAwcShUSZbwsO7prA.jpg      (mcp-for-designers)
│   ├── KKSflaBzLhQtCCknGCHsQqbqU2s.jpg      (ep02)
│   ├── c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg      (fortune-500)
│   └── dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg       (ep01)
├── homepage/
│   ├── 5tYWjZYwckbQWoi9rQ9mkhAoLG8.png      (hero)
│   ├── CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg      (brand identity)
│   ├── Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg      (design systems)
│   ├── XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg      (content strategy)
│   ├── nQ5h9VMZNz5knXmzATISCBWqakc.jpg      (context optimization)
│   └── p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg       (creative AI)
├── projects/
│   ├── biltfour/              (8 files: 7×.jpg + 1×.svg hero)
│   ├── google-cloud-next/     (8 files: 7×.jpg + 1×.svg hero)
│   ├── google-gemini-infinite-nature/  (8 files: 7×.jpg + 1×.svg hero)
│   ├── iterra/                (8 files: 7×.jpg + 1×.svg hero)
│   └── universal-audio/       (8 files: 6×.jpg + 1×.svg + 1×.gif)
├── resources/
│   ├── brand-design-system-01.jpg
│   ├── brand-design-system-02.jpg
│   ├── design-directory-01.mp4
│   ├── design-directory-02.jpg
│   ├── karimo-01.jpg
│   ├── karimo-02.jpg
│   ├── linktree-template-01.jpg
│   ├── linktree-template-02.jpg
│   ├── portfolio-01.jpg
│   └── portfolio-02.jpg
└── team/
    ├── karim.webp
    └── morgan.webp
```

**Missing directory:** `public/images/templates/` does not exist (4 broken refs in `src/data/templates.ts`).

---

## 5. Route Structure Under src/app/

```
src/app/
├── favicon.ico
├── globals.css
├── layout.tsx             Root layout — ThemeProvider, Header, Footer, PageLoader, SkipLink
├── loading.tsx            Global loading UI
├── not-found.tsx          404 page
├── page.tsx               / (home)
├── template.tsx           Global page transition wrapper (framer-motion)
├── robots.ts              robots.txt generation
├── sitemap.ts             sitemap.xml generation
│
├── about/page.tsx
├── blog/
│   ├── loading.tsx
│   ├── page.tsx           /blog — BlogGrid with all posts
│   └── [slug]/page.tsx    /blog/:slug — MDX blog post
├── contact/page.tsx
├── free-assets/page.tsx   /free-assets — FreeResourcesGrid
├── lab/page.tsx           /lab — LabHero + resources + blog + playbooks
├── legal/
│   ├── layout.tsx         Legal layout (max-w-3xl, back link)
│   ├── privacy/page.tsx   /legal/privacy — MDX via MDXRemote
│   └── terms/page.tsx     /legal/terms — MDX via MDXRemote
├── playbooks/
│   ├── page.tsx           /playbooks — empty state
│   └── [slug]/page.tsx    /playbooks/:slug — stub
├── privacy/page.tsx       redirect → /legal/privacy
├── projects/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx           /projects — carousel + grid + filter
│   └── [slug]/page.tsx    /projects/:slug — scroll-driven ProjectDetail
├── templates/page.tsx
└── terms/page.tsx         redirect → /legal/terms
```

---

## 6. Overall src/ Organization Post-Migration

```
src/
├── app/           Next.js App Router pages + layouts (18 routes, 3 dynamic)
├── components/
│   ├── about/     AboutHero, TeamSection, TeamShowcase, ValuesSection
│   ├── backgrounds/ FaultyTerminal (WebGL glitch effect)
│   ├── blog/      BlogCard, BlogGrid, BlogPost, MDXComponents
│   ├── contact/   ContactHero
│   ├── home/      14 section components (Hero, ImpactSection, FeaturedWork, etc.)
│   ├── lab/       LabHero
│   ├── layout/    Footer, Header, Logo, OverlayMenu, PageTransition, ThemeToggle
│   ├── projects/  11 project components (Card, Carousel, Detail, Filters, Grid, etc.)
│   ├── providers/ ThemeProvider
│   ├── resources/ FreeResourceCard, FreeResourcesGrid
│   ├── shared/    14 reusable components (Button, ScrollReveal, SectionLabel, etc.)
│   ├── three/     CRTScreenMaterial, CRTTVModel, CRTTVScene
│   ├── ui/        DotPattern
│   └── uui/       Full Untitled UI component library
├── content/       MDX content (blog, legal, playbooks)
├── data/          16 TypeScript data files (the migrated CMS content)
├── hooks/         10 custom hooks
├── lib/           mdx.ts, motion.ts, tv-channels.ts, utils.ts
├── styles/        theme.css
├── types/         4 type definition files + barrel index
└── utils/         cx.ts, dev-props.ts, is-react-component.ts
```
