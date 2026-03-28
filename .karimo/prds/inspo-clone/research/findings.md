# Research Findings: Inspo Clone (Good Fella → Open Session)

**Source Sites:**
- Inspiration: https://good-fella.com/ (Awwwards SOTD Winner)
- Current: https://opensession.co/ (Framer)
- Design System: BOS-3.0 Tailwind Config

**Scraped:** 2026-03-27
**Goal:** Replace Framer site with custom Next.js build, adopting Good Fella's motion/structure with Open Session branding

---

## Executive Summary

This project clones Good Fella's award-winning structure, animations, and UX patterns while injecting Open Session's brand identity and content. The result replaces the current Framer-based opensession.co with a fully custom Next.js site.

**Key Differences:**
| Aspect | Good Fella | Open Session |
|--------|------------|--------------|
| Business | Frontend dev studio | Design agency (brand + AI) |
| Color Scheme | Dark only (#141314) | Dark/Light toggle |
| Brand Color | Orange (#FD551D) | Aperol (#FE5102) |
| Typography | Aktiv Grotesk | Neue Haas Grotesk |
| Border Radius | 0px (sharp) | Mix (sharp + rounded CTAs) |

---

## Site Structure Mapping

### Good Fella → Open Session

| Good Fella Page | Open Session Page | Notes |
|-----------------|-------------------|-------|
| Home | Home | Similar hero + process + work showcase |
| Work | Projects | Portfolio grid with filters |
| Pricing | Workshop | Services/pricing (adapted) |
| About | About | Team story, values, stats |
| Contact | Contact | Form + calendar booking |
| — | Blog | **NEW** - Article listings |
| — | Blog/[slug] | **NEW** - Article template |
| — | Templates | **NEW** - Free resources |

### Required Pages (7 total)
1. **Home** (`/`) - Hero, process, featured work, services, CTA
2. **Projects** (`/projects`) - Portfolio grid with category filters
3. **Projects/[slug]** (`/projects/[slug]`) - Project case study template
4. **About** (`/about`) - Team, story, values, stats
5. **Blog** (`/blog`) - Article listings
6. **Blog/[slug]** (`/blog/[slug]`) - Article template
7. **Templates** (`/templates`) - Free resources page
8. **Workshop** (`/workshop`) - Services/consulting page
9. **Contact** (`/contact`) - Contact form

---

## Open Session Brand Identity (from BOS-3.0)

### Color System

**Brand Colors:**
- Aperol: `#FE5102` - Primary accent for CTAs, links
- Charcoal: `#191919` - Dark mode base
- Vanilla: `#FFFAEE` - Light mode base / dark mode text

**Color Scales:**
```css
/* Brand (Aperol) Scale */
--color-brand-500: #fe5102;  /* Primary */
--color-brand-600: #e64400;  /* Hover */
--color-brand-400: #ff7a38;  /* Light accent */

/* Warm Gray Scale (tinted toward Vanilla) */
--color-gray-100: #f5f3f0;
--color-gray-700: #44403a;
--color-gray-900: #1c1a17;
```

### Typography

**Font Families:**
- Display: Neue Haas Grotesk Display Pro
- Body: Neue Haas Grotesk Text Pro
- Accent: Offbit (for special headers)

**Font Files Required:**
- NeueHaasDisplayRoman.woff2
- NeueHaasDisplayMedium.woff2
- NeueHaasDisplayBold.woff2
- OffBit-Regular.woff2
- OffBit-Bold.woff2

### Dark/Light Mode

Both modes supported via `.dark` class toggle:
- Light: `--bg-primary: #faf8f5` (soft vanilla)
- Dark: `--bg-primary: #191919` (charcoal)

---

## Open Session Current Content

### Hero
- Tagline: "we help the world make the most of design and technology"
- Headline: "We're a design company focused on brand systems, creative AI, and community."

### Services (4 pillars)
1. **Brand Identity** - Logo, visual systems, guidelines, typography
2. **Digital Design** - Web, app, UX/UI, design systems
3. **Art Direction** - Creative direction, campaigns, visual storytelling
4. **Strategy & Consulting** - Positioning, research, audits, consulting

### Process (4 steps)
1. **Discover** - Research and listening
2. **Define** - Strategy and structure
3. **Design** - Thoughtful iteration
4. **Deliver** - Handoff with care

### Stats
- 15+ Years of Experience
- 5+ Fortune 500 Projects
- Free Templates (coming soon)
- Newsletter for designers

### Projects (Current)
- Iterra (2025) - Brand Identity & Guidelines
- BILTFOUR (2024-2025) - Brand, E-commerce, Community
- Google Cloud NEXT (2023-2024) - Demo Design System, UX
- Google Gemini Infinite Nature (2023-2024) - UX/UI, Art Direction
- Universal Audio (2022-present) - Visual Design, Campaigns

### Social Links
- GitHub, Figma, Medium, YouTube, Substack, Instagram, LinkedIn

---

## Good Fella Design Patterns to Adopt

### 1. Navigation
- Minimal header with logo + single CTA
- Full-screen menu overlay on mobile
- Sticky header with scroll awareness

### 2. Hero Section
- Large bold headline with line breaks
- Two CTAs (primary + secondary)
- Announcement banner (optional)

### 3. Logo Marquee
- Horizontal infinite scroll
- Client logos with "+ Many more"

### 4. Stats Counter
- Animated odometer-style numbers
- Scroll-triggered animation
- Format: "XXX+" with label below

### 5. Process Section
- Numbered steps (01, 02, 03, 04)
- `// Process` monospace subtitle
- Accompanying images

### 6. Work Grid
- Image cards with hover effects
- Category tags: `[Type]—[Industry]`
- Filter system
- Horizontal scroll on mobile

### 7. Services Cards
- Collapsible/expandable
- Icon + title + description
- Service tags/pills

### 8. Comparison Table
- 3 columns (competitors vs us)
- Checkmarks for advantages
- Mobile: stacked cards

### 9. FAQ Accordion
- Smooth height animation
- Multiple sections across pages

### 10. Contact Form
- Name, email, company, message
- Budget selector
- Submit with loading state

### 11. Footer
- Multi-column links
- Email subscription
- Social icons
- Legal links

---

## Animation Patterns

### Page Load
- Staggered fade-in (Framer Motion)
- Hero text animate word-by-word

### Scroll Triggers
- Elements reveal on scroll-into-view
- Stats count up when visible

### Hover States
- Image scale (1.02-1.05)
- Color transitions (300ms)
- Underline animations

### Page Transitions
- Fade out/in between routes
- Shared layout animations

### Loading States
- "LOADING" text animation
- Skeleton screens

### Marquee
- CSS infinite horizontal scroll
- Pause on hover

---

## Technical Implementation

### Stack
- Next.js 16+ (App Router)
- React 19
- TypeScript
- Tailwind CSS (BOS design tokens)
- Framer Motion

### File Structure
```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── projects/
│   │   ├── page.tsx          # Projects list
│   │   └── [slug]/page.tsx   # Project detail
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx          # Blog list
│   │   └── [slug]/page.tsx   # Blog post
│   ├── templates/page.tsx
│   ├── workshop/page.tsx
│   ├── contact/page.tsx
│   └── layout.tsx            # Root layout
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── page-transition.tsx
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── logo-marquee.tsx
│   │   ├── stats-counter.tsx
│   │   ├── process-section.tsx
│   │   ├── featured-work.tsx
│   │   ├── services-section.tsx
│   │   └── cta-section.tsx
│   ├── projects/
│   │   ├── project-grid.tsx
│   │   ├── project-card.tsx
│   │   └── project-filters.tsx
│   ├── blog/
│   │   ├── blog-grid.tsx
│   │   └── blog-card.tsx
│   ├── shared/
│   │   ├── button.tsx
│   │   ├── section-header.tsx
│   │   ├── faq-accordion.tsx
│   │   ├── contact-form.tsx
│   │   └── newsletter-form.tsx
│   └── ui/
│       └── (base components)
├── lib/
│   ├── motion.ts             # Framer Motion variants
│   └── utils.ts
├── styles/
│   ├── globals.css
│   └── theme.css             # BOS design tokens
└── data/
    ├── projects.ts
    ├── services.ts
    └── blog.ts
```

---

## Task Breakdown (High Level)

### Phase 1: Foundation (8 tasks)
1. Project setup & design system import
2. Typography & font loading
3. Color system & dark mode
4. Base layout components
5. Header component
6. Footer component
7. Mobile menu
8. Page transition wrapper

### Phase 2: Home Page (10 tasks)
9. Hero section
10. Logo marquee
11. Stats counter with animation
12. Process section
13. Featured work grid
14. Services section
15. FAQ accordion
16. CTA section
17. Newsletter form
18. Home page assembly

### Phase 3: Projects (6 tasks)
19. Project data structure
20. Project grid component
21. Project filters
22. Project card with hover
23. Project detail template
24. Projects page assembly

### Phase 4: About (4 tasks)
25. About hero
26. Team section
27. Values/how we work
28. About page assembly

### Phase 5: Blog (6 tasks)
29. Blog data structure
30. Blog grid component
31. Blog card
32. Blog post template
33. Blog list page
34. Blog post page

### Phase 6: Additional Pages (6 tasks)
35. Templates page
36. Workshop/services page
37. Contact page
38. Contact form component
39. Legal pages (terms, privacy)
40. 404 page

### Phase 7: Polish (10 tasks)
41. Loading states
42. Scroll animations
43. Image optimization
44. SEO meta tags
45. OpenGraph images
46. Sitemap
47. Analytics setup
48. Performance optimization
49. Accessibility audit
50. Final QA & deploy

---

## Content Migration Checklist

### From opensession.co:
- [ ] Project case studies (5+)
- [ ] Blog articles (3+)
- [ ] Service descriptions
- [ ] Team bios
- [ ] Client logos
- [ ] Social links

### Assets Needed:
- [ ] OS logo (SVG)
- [ ] Project thumbnails
- [ ] Team photos
- [ ] Client logos (SVG)
- [ ] Blog images

---

## Recommendations

### Adopt from Good Fella:
- Sharp corners (0px radius) for containers
- `// Section` monospace labels
- Numbered process steps
- Stats with animated counters
- Full-bleed images
- Category tags on projects
- Loading text animation

### Keep from Open Session:
- Warm neutral color palette
- Neue Haas Grotesk typography
- Dark/light mode toggle
- Rounded CTAs (30px radius)
- Service pillars structure
- 4-step process

### Improve:
- Add page transitions
- Implement scroll animations
- Better loading states
- Optimized images
- Enhanced SEO
