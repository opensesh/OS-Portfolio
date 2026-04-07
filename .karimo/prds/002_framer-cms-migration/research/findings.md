# Research Findings: Framer CMS Migration

## Executive Summary

Migration of opensession.co Framer CMS content into the existing Next.js portfolio codebase. The codebase already has CMS-ready TypeScript data structures — the main work is enriching data types, downloading assets, and populating content.

---

## 1. Framer CMS Content Inventory

### Projects (5 total)

| Project | Client | Year | Category | Images |
|---------|--------|------|----------|--------|
| Iterra | Iterra | 2025 | Brand Identity & Guidelines | 8 (1 hero SVG + 7 gallery JPG) |
| BILTFOUR | BILTFOUR | 2024-2025 | Brand Identity, E-commerce, Community | 8 (1 hero SVG + 7 gallery JPG) |
| NEXT | Google Cloud | 2023-2024 | Demo Design System, UX Strategy | 8 (1 hero SVG + 7 gallery JPG) |
| Infinite Nature | Google Cloud | 2023-2024 | UX/UI, Art Direction, Design System | 8 (1 hero SVG + 7 gallery JPG) |
| Universal Audio | Universal Audio | 2022-present | Visual Design, Campaign Creative | 8 (1 hero SVG + 6 gallery JPG + 1 GIF) |

**Each project includes:**
- Title, client, year, category/services
- Description (full paragraph)
- 3 structured sections: Challenge, Solution, Impact (each with heading + body)
- Gallery images (hero + 4 challenge/solution + 3 impact mockups)
- Testimonials (optional — Iterra has one)
- Results/metrics (optional — BILTFOUR, NEXT, UA have them)

### Blog Posts (4 total)

| Title | Category | Date | Reading Time |
|-------|----------|------|-------------|
| EP02: Creative AI Framework | Creative Philosophy | Feb 3, 2026 | 5 min |
| EP01: Creativity over Compute | Creative Philosophy | Jan 20, 2026 | 6 min |
| Democratizing Fortune 500 Design | About Us | Sep 13, 2025 | 7 min |
| MCP for Designers | Digital Design | Sep 12, 2025 | 5 min |

### Team Members (2)

| Name | Role | Has Photo |
|------|------|-----------|
| Karim Bouhdary | Head of Design | Yes (webp) |
| Morgan MacKean | Chief Creative Officer | Yes (webp) |

### Client Logos (8 SVGs)

Google Cloud, Fitbit, SAP, Iterra, Universal Audio, BILTFOUR, Salesforce, Jalapajar

### Site-Wide Images

- **Homepage**: Hero image, 5 project thumbnail SVGs, 4 service images (JPG), 3 blog thumbnails (JPG), team photo (JPG)
- **About page**: Main hero (7008x4672 JPG), team photos, 4 team story images, client logos
- **Favicon**: PNG from framerusercontent

---

## 2. Current Codebase Architecture

### Data Storage: TypeScript Constants in `/src/data/`

| File | Content | Count |
|------|---------|-------|
| `projects.ts` | Project objects | 5 |
| `blog.ts` | Blog posts with markdown | 3 |
| `team.ts` | Team members | 2 |
| `clients.ts` | Client logos | 8 |
| `tools.ts` | Tool logos | 16 |
| `services.ts` | Service offerings | 4 |
| `faq.ts` | FAQ pairs | varies |
| `process.ts` | Process steps | 4 |
| `values.ts` | Company values | 4 |
| `stats.ts` | Metrics | 4 |
| `what-we-do.ts` | Service categories | 5 |
| `templates.ts` | Template metadata | varies |
| `navigation.ts` | Nav items + social | varies |

### Type Definitions in `/src/types/`

**Current Project type:**
```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory; // "Brand Identity" | "Digital Design" | "Art Direction" | "Strategy"
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}
```

**Current BlogPost type:**
```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // embedded markdown
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}
```

### Image Handling

- Images referenced as paths in data objects (e.g., `/images/projects/iterra-thumb.jpg`)
- Using `next/image` with fill-based layout + sizes prop
- **Many image directories are empty** — placeholder gradients used instead
- No external domain allowlisting in `next.config.ts`
- Client/tool logos stored as SVGs in `/public/logos/`

### Routing

- `/projects` — Listing with filtering by category
- `/projects/[slug]` — Detail pages via `generateStaticParams()`
- `/blog` — Listing with featured section
- `/blog/[slug]` — Detail pages via `generateStaticParams()`
- Static generation — all routes pre-rendered at build time

---

## 3. Gap Analysis: Framer vs Codebase

### Data Gaps (Framer has, codebase lacks)

| Field | Framer | Codebase |
|-------|--------|----------|
| Project sections (Challenge/Solution/Impact) | Full structured content | Not in type |
| Project gallery images (7-8 per project) | Full URLs | Empty directories |
| Project testimonials | Optional per project | Not in type |
| Project results/metrics | Optional per project | Not in type |
| Project services list | Per project | Not in type |
| Blog post #4 (MCP for Designers) | Exists | Missing |
| Blog category "Creative Philosophy" | Used | Not in BlogCategory union |
| Blog category "About Us" | Used | Not in BlogCategory union |
| Blog category "Digital Design" | Used | Not in BlogCategory union |
| About page team story images | 4 images | Not present |
| Service page images | 4 images | Not present |
| Homepage hero image | framerusercontent | Not downloaded |

### Category Mismatch

**Framer project categories** (multi-tag, comma-separated):
- "Brand Identity & Guidelines"
- "Brand Identity, E-commerce, Community Building"
- "Demo Design System, UX Strategy, Experience Design"
- "UX/UI, Art Direction, Design System"
- "Visual Design, Campaign Creative, Product Launches"

**Codebase project categories** (single enum):
- "Brand Identity" | "Digital Design" | "Art Direction" | "Strategy"

**Decision needed:** Keep simplified categories or migrate to multi-tag system?

---

## 4. Image Asset Catalog

### Total Unique Images to Download: ~75

**Project Images (40):** 5 projects x ~8 images each
- Hero SVGs (5) — project thumbnail/cover
- Gallery JPGs (~30) — case study images
- GIF (1) — Universal Audio mockup

**Homepage Images (12):**
- Hero image (1 PNG)
- Service images (4 JPG)
- Blog thumbnails (3 JPG)
- Team photo (1 JPG)
- Client logos already exist locally as SVG

**About Page Images (9):**
- Main hero (1 JPG, 7008x4672 — needs optimization)
- Team photos (2)
- Team story images (4)
- BILTFOUR logo SVG (1, new — not in current logos)

**Blog Thumbnails (4 JPG)**

### Image Source: `framerusercontent.com`

All images hosted on Framer's CDN with URL pattern:
```
https://framerusercontent.com/images/{hash}.{ext}?width={w}&height={h}
```

Width/height params are for CDN resizing — download without params for originals.

---

## 5. Recommended Migration Approach

### Option A: Static Download (Recommended)

1. **Download all images** from framerusercontent to `/public/images/`
2. **Enrich TypeScript types** to include sections, gallery, testimonials, results
3. **Update data files** with full Framer content
4. **Update components** to render richer data (case study sections, image galleries)

**Pros:** No external dependencies, fastest load times, full control
**Cons:** Manual update process for future changes

### Option B: Framer CMS API (If MCP connected)

1. **Pull CMS collections** via Framer MCP
2. **Generate TypeScript data** from CMS response
3. **Download images** to public/ or use external domain allowlisting

**Pros:** Automated sync possible
**Cons:** Framer MCP not currently connected; adds dependency

### Option C: Hybrid (Keep framerusercontent URLs)

1. **Allowlist framerusercontent.com** in next.config.ts
2. **Reference images directly** from Framer CDN
3. **Update data + types** as in Option A

**Pros:** No download step, always up to date
**Cons:** External dependency, slower loads, CDN could change

### Recommendation: Option A

Static download gives full control, best performance, and matches the existing pattern. The content doesn't change frequently enough to justify a live CMS connection.

---

## 6. Proposed Type Enrichments

```typescript
interface ProjectSection {
  heading: string;
  body: string;
}

interface ProjectImage {
  src: string;
  alt: string;
  context: "hero" | "gallery" | "mockup";
}

interface Project {
  // existing fields...
  services: string[];
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: { quote: string; author: string }[];
  results?: string[];
}
```

---

## 7. Framer Image URLs (Full Catalog)

### Iterra
- Hero: `framerusercontent.com/images/vvl6xyIdUMskDBgstfyClKSxE8.svg`
- Gallery: `i8dim26bhvu5qQR9wg3QosYwH30.jpg`, `dNN6V4QOZliCydifbZq9mZHgs.jpg`, `4iGWtlK9qyEQGR3kn226neLeOx0.jpg`, `8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg`
- Mockups: `ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg`, `iKQP3E2D7UXucYJbubSRc3A7I.jpg`, `oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg`

### BILTFOUR
- Hero: `framerusercontent.com/images/ZwDzuAZjuENRwaTtArVGJQsGc.svg`
- Gallery: `sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg`, `pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg`, `fQNXA7iFcdLekr5tbHmESnMDE.jpg`, `5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg`
- Mockups: `VWj6qlkvnLdlyTExZDWZiezC104.jpg`, `rPlUBgrbosziZBcZfJfPe8sIHA.jpg`, `WUB4oauOJh26lOozw9rKdgUYRk.jpg`

### NEXT (Google Cloud)
- Hero: `framerusercontent.com/images/zwWkHCt1g0HSk5r9elbNigK55dk.svg`
- Gallery: `EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg`, `Zcgxim04ZIbn7CooJkyUahMgtU.jpg`, `vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg`, `Y1GhTfRUj1WegONQQcS7bRybV8I.jpg`
- Mockups: `TVWePxkVuYJ2ynKwvW8na7Gz8.jpg`, `1PeraZj4rwCBVywk3sEvPzcRvYw.jpg`, `kdIwpWfuzthCYLWztP0haNTzq0.jpg`

### Infinite Nature (Google Gemini)
- Hero: `framerusercontent.com/images/enyu0AxPncALYsOKGqBz5dcGo.svg`
- Gallery: `0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg`, `akEhFihTl9pdmzuHDf5W4UluIjA.jpg`, `q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg`, `69we6OfP9rfNdtqOohJDJYMYcC4.jpg`
- Mockups: `ZWM3jBNXCq5MI740NZoGE0owGx4.jpg`, `FhgyvB0QzTK3QC0aY40xLmw4K8.jpg`, `fEgHnqjSmKjGa0On2DRyNU9HTo.jpg`

### Universal Audio
- Hero: `framerusercontent.com/images/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg`
- Gallery: `5rY7sMJWPqahP45iscJTiYEOw.jpg`, `gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg`, `VKLBL93wfWhPj6VObEt1a4HlEA.jpg`, `2MalmzAFsqsCILwoPC2A6s6Hs.jpg`
- Mockups: `UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif`, `CJC7mcxaL9DGEYB4HGificxTbA.jpg`, `PWbwliRrvDvOr6Iw28xulNrFSc.jpg`

### Homepage
- Hero: `5tYWjZYwckbQWoi9rQ9mkhAoLG8.png`
- Services: `CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg`, `Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg`, `XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg`, `p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg`
- Team: `nQ5h9VMZNz5knXmzATISCBWqakc.jpg`
- Blog thumbs: `KKSflaBzLhQtCCknGCHsQqbqU2s.jpg`, `dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg`, `c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg`

### About Page
- Hero: `Sj4TYZrc68BDHPXs5O5D19mVik.jpg` (7008x4672)
- Team: `HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg`, `Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp`
- Story images: `TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg`, `wKJt8b9CgcZCyP5NKky2RDcdQ.jpg`, `hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg`, `qvzOeu5vdocdhOTq2yANNjMg0.jpg`

### Blog Thumbnails
- EP02: `KKSflaBzLhQtCCknGCHsQqbqU2s.jpg`
- EP01: `dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg`
- Democratizing: `c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg`
- MCP Guide: `6zZWCJwMNLKAwcShUSZbwsO7prA.jpg`

### Client Logos (SVGs)
- Google Cloud: `Lx8koBJOgiYp5zwEsfuox8FaaU.svg`
- Fitbit: `onjgBMqUJiYIWz4owgwIg988Dwo.svg`
- Google (alt): `uKBT4E9GTqDuY4zCTomIHK1zeQ.svg`
- Iterra: `ydfYD7UbY2ClV75a1Klgwg9CcI.svg`
- BILTFOUR: `b2QgKdGpeKLVkmcCq7hadnYA.svg`
- SAP: `U7vHh8rm5p3Sb3XpnaZ3jU4rzk.svg`
- Universal Audio: `I5kNOlJYn3GNBcvpUALAUoHSkw.svg`
- Salesforce: `V9vpY3UkjxrIrwuS63gykG4RC4.svg`
- BILTFOUR (about): `TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg`
