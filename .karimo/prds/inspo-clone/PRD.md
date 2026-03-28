# PRD: Inspo Clone - Good Fella → Open Session

**PRD ID:** inspo-clone
**Created:** 2026-03-27
**Status:** Ready for Execution

---

## Overview

Build a custom Next.js website that clones Good Fella's award-winning structure, animations, and UX patterns while injecting Open Session's brand identity and content. This replaces the current Framer-based opensession.co site.

### Goals
1. Replicate Good Fella's motion design and interaction patterns
2. Apply Open Session branding (colors, typography, content)
3. Implement dark/light mode toggle
4. Build 9 pages with reusable components
5. Optimize for performance and SEO

### Non-Goals
- CMS integration (content is static for v1)
- E-commerce functionality
- User authentication
- Analytics dashboard

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + BOS design tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Neue Haas Grotesk, Offbit |

---

## Design System

### Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| bg-primary | #faf8f5 | #191919 | Page backgrounds |
| bg-secondary | #f5f3f0 | #262626 | Cards, elevated surfaces |
| fg-primary | #1c1a17 | #fffaee | Primary text |
| fg-secondary | #78716c | #a8a29e | Secondary text |
| brand-500 | #fe5102 | #fe5102 | CTAs, links, accents |
| border-primary | #e7e5e4 | #44403a | Interactive borders |
| border-secondary | #d6d3d1 | #363230 | Container borders |

### Typography

| Style | Font | Weight | Size |
|-------|------|--------|------|
| Display | Neue Haas Grotesk Display | Bold | 48-96px |
| Heading | Neue Haas Grotesk Display | Medium | 24-40px |
| Body | Neue Haas Grotesk Text | Regular | 16-18px |
| Accent | Offbit | Regular | Variable |
| Mono | System mono | Regular | 14px |

### Motion

| Pattern | Duration | Easing |
|---------|----------|--------|
| Page transition | 400ms | ease-out |
| Hover | 200ms | ease |
| Scroll reveal | 600ms | [0.16, 1, 0.3, 1] |
| Counter | 2000ms | ease-out |

---

## Pages

### 1. Home (`/`)
- Hero with animated headline
- Logo marquee (infinite scroll)
- Stats counter (animated)
- Process section (4 steps)
- Featured work grid
- Services section
- FAQ accordion
- CTA section
- Newsletter form

### 2. Projects (`/projects`)
- Category filters
- Project grid with hover effects
- Load more / pagination

### 3. Project Detail (`/projects/[slug]`)
- Hero with project meta
- Full-width images
- Content sections
- Next/prev navigation

### 4. About (`/about`)
- Story section
- Team section
- Values/how we work
- Stats

### 5. Blog (`/blog`)
- Article grid
- Category filters
- Featured post

### 6. Blog Post (`/blog/[slug]`)
- Article hero
- Rich content
- Author bio
- Related posts

### 7. Templates (`/templates`)
- Free resources grid
- Download CTAs

### 8. Workshop (`/workshop`)
- Services/pricing
- Booking CTA

### 9. Contact (`/contact`)
- Contact form
- Calendar booking embed
- Office info

---

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projects/
│   ├── about/
│   ├── blog/
│   ├── templates/
│   ├── workshop/
│   └── contact/
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── theme-toggle.tsx
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── logo-marquee.tsx
│   │   ├── stats-counter.tsx
│   │   ├── process-section.tsx
│   │   ├── featured-work.tsx
│   │   ├── services-section.tsx
│   │   └── cta-section.tsx
│   ├── projects/
│   ├── blog/
│   └── shared/
│       ├── button.tsx
│       ├── section-header.tsx
│       ├── faq-accordion.tsx
│       └── newsletter-form.tsx
├── lib/
│   ├── motion.ts
│   └── utils.ts
├── styles/
│   ├── globals.css
│   └── theme.css
└── data/
    ├── projects.ts
    ├── services.ts
    └── navigation.ts
```

---

## Acceptance Criteria

### Performance
- Lighthouse Performance score ≥ 90
- First Contentful Paint < 1.5s
- Cumulative Layout Shift < 0.1

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader friendly

### Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Chrome Mobile

### SEO
- Semantic HTML structure
- Meta tags on all pages
- OpenGraph images
- Sitemap.xml
- robots.txt

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Font licensing | Medium | Use web-licensed versions |
| Animation performance | Medium | Use GPU-accelerated transforms |
| Large images | High | Implement Next.js Image optimization |
| Dark mode flash | Low | Use CSS variables + script in head |

---

## Success Metrics

1. Site loads in < 2 seconds on 3G
2. All pages score 90+ on Lighthouse
3. Zero accessibility errors
4. Smooth 60fps animations
5. Successful deployment to Vercel

---

## References

- Good Fella: https://good-fella.com/
- Current Site: https://opensession.co/
- Design System: BOS-3.0 Tailwind Config
- Research: `.karimo/prds/inspo-clone/research/findings.md`
