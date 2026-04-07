# Task Brief: T005

**Title:** Migrate all 5 project data records
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 8/10
**Model:** opus
**Wave:** 2

---

## Objective

Populate `/src/data/projects.ts` with the full enriched data for all 5 projects (Iterra, BILTFOUR, NEXT/Google Cloud, Infinite Nature, Universal Audio). Each project record must include the complete structured content sourced from Framer CMS: categories as a `string[]`, services, sections (Challenge/Solution/Impact), images with local paths, testimonials (Iterra only), and results/metrics (BILTFOUR, NEXT, Universal Audio). Also update the project listing filter logic to handle array-based category matching.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The portfolio site at `/src/data/projects.ts` currently has 5 stub project records with minimal fields — a single `category` string, no sections, no gallery images, and no enriched content. The Framer CMS CSV (`Projects.csv`) contains the full structured content for all 5 projects including 3-paragraph case study sections, image URLs, metadata, and external links.

Wave 1 (T001 + T002) must complete before this task:
- **T001** downloads all project images from `framerusercontent.com` to `/public/images/projects/{slug}/`
- **T002** enriches the TypeScript schema in `/src/types/project.ts` to support the new fields

This task populates the data layer using the enriched types from T002 and the downloaded images from T001.

This task is part of **Wave 2** — content migration, where all raw Framer CMS data is written into the Next.js data layer.

---

## Requirements

### Schema Expected from T002

After T002 completes, `/src/types/project.ts` will export these types (use them verbatim):

```typescript
export interface ProjectSection {
  heading: string;
  headline: string;
  body: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  context: "hero" | "gallery" | "mockup";
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  categories: string[];        // replaces single `category`
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  services: string[];
  duration: string;
  buttonText: string;
  buttonHref: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}
```

**Note:** If T002 hasn't landed yet when you start, confirm the schema matches before writing data. The `category` field (singular) is replaced by `categories` (array). The `projectCategories` const and `ProjectCategory` type are removed or replaced.

### Filter Logic Change (projects page)

`/src/app/projects/page.tsx` currently filters with:
```typescript
return projects.filter((p) => p.category === activeFilter);
```

This must change to array intersection:
```typescript
return projects.filter((p) => p.categories.includes(activeFilter));
```

The filter state type must also change from `ProjectCategory | "All"` to `string | "All"` since `ProjectCategory` enum is removed.

---

## Full Project Data (Source: Framer CSV + Research Findings)

### Canonical Category Slugs

From `Categories.csv`:
- `art-direction` → "Art Direction"
- `strategy` → "Strategy"
- `digital-design` → "Digital Design"
- `brand-identity` → "Brand Identity"
- `web-design` → "Web Design"

### Image Path Convention

Images are downloaded by T001 to `/public/images/projects/{slug}/`. The filename convention matches the hash portion of the Framer URL (without query params), e.g.:
- `framerusercontent.com/images/vvl6xyIdUMskDBgstfyClKSxE8.svg` → `/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg`

---

### Project 1: Iterra

**Slug:** `iterra`
**CSV Categories field:** `brand-identity,strategy`
**Year:** 2025
**Client:** Iterra
**Duration:** 1 month
**Scope:** Brand Identity & Guidelines
**Button:** text="Coming Soon", href="" (empty — no link)

**Overview (description):**
> We helped Iterra, a Pacific Northwest 3D manufacturing company, establish a professional brand identity that elevated their business from a small-scale operation to a legitimate brand with scalable visual systems.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Taking a growing manufacturer to the next level through brand. | Iterra came to us as a Pacific Northwest 3D manufacturing company producing accessories for the off-road and camping community. While their products were solid, they lacked the visual identity to compete professionally in the market. As an in-house operation ready to scale, they needed more than a logo—they needed a complete brand foundation that could support their growth from small-scale manufacturer to established brand, while staying true to their hands-on expertise. |
| Solution | Solution | Layers and patterns that mirror the 3D printing process itself. | Through intensive workshops and mood board sessions, we developed a visual language inspired by the very nature of 3D printing—building from the ground up, layer by layer. The identity combines clean geometric shapes and angles with warm, natural textures that reflect their Pacific Northwest environment. Every element was documented in comprehensive brand guidelines, creating a scalable system that could evolve with their business growth while maintaining authenticity. |
| Impact | Impact | "This identity forced us into existence as a true brand." | The transformation was immediate and profound. The founders reported feeling like they'd evolved from a manufacturing operation to a legitimate brand overnight. 'We feel like a real company now,' they told us. 'This identity forced us into existence as not just a manufacturing business, but a true 3D company for the future.' The brand system gave them the confidence and tools to compete with established players while maintaining their authentic, craft-focused approach. |

**Testimonial (Iterra only):**
- Quote: "This identity forced us into existence as a true brand."
- Author: Iterra Founders

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| `/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg` | Iterra brand hero | hero |
| `/images/projects/iterra/i8dim26bhvu5qQR9wg3QosYwH30.jpg` | Iterra brand identity — gallery 1 | gallery |
| `/images/projects/iterra/dNN6V4QOZliCydifbZq9mZHgs.jpg` | Iterra brand identity — gallery 2 | gallery |
| `/images/projects/iterra/4iGWtlK9qyEQGR3kn226neLeOx0.jpg` | Iterra brand identity — gallery 3 | gallery |
| `/images/projects/iterra/8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg` | Iterra brand identity — gallery 4 | gallery |
| `/images/projects/iterra/ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg` | Iterra brand mockup — impact 1 | mockup |
| `/images/projects/iterra/iKQP3E2D7UXucYJbubSRc3A7I.jpg` | Iterra brand mockup — impact 2 | mockup |
| `/images/projects/iterra/oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg` | Iterra brand mockup — impact 3 | mockup |

**Services:** `["Brand Identity", "Visual Systems", "Brand Guidelines"]`

---

### Project 2: BILTFOUR

**Slug:** `biltfour`
**CSV Categories field:** `art-direction,digital-design,strategy,web-design,brand-identity`
**Year:** 2024-2025
**Client:** BILTFOUR
**Duration:** 1 year
**Scope:** Brand Identity, E-commerce, Community Building
**Button:** text="Visit Site", href="https://www.biltfour.com/"

**Overview (description):**
> We partnered with BILTFOUR from inception to build a premium brand identity for their modular aluminum drawer systems, creating a scalable design ecosystem that generated hundreds of thousands of social media views and established immediate market presence as a premium player.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Creating a premium brand that speaks to discerning builders and adventurers. | BILTFOUR came to us with an innovative vision: modular aluminum drawer systems that work like LEGO—stacking vertically and horizontally in different configurations. They needed a brand that could capture their technical precision while appealing to a sophisticated audience who values quality over trends. The challenge was positioning them in the sweet spot between utilitarian and luxury—think Land Cruiser, not Land Rover—while building authentic community connections from day one. |
| Solution | Solution | Technical grit meets systematic brand building. | We developed a comprehensive brand identity with a 'technical grit' aesthetic that resonated with discerning customers who appreciate purposeful design. Our systematic approach went beyond digital—we designed apparel, event booths, and showed up at expos and local meetups to understand our audience firsthand. The custom Shopify e-commerce platform was optimized for conversion and SEO, while our content production system enabled consistent storytelling across all channels. Every touchpoint reinforced BILTFOUR's position as the premium choice for modular storage. |
| Impact | Impact | From startup to premium market leader in under a year. | The results exceeded expectations: hundreds of thousands of social media views, overwhelmingly positive customer feedback, and rapid establishment as a premium brand in the modular storage market. By combining systematic design thinking with authentic community engagement, BILTFOUR achieved the kind of brand equity that typically takes established companies years to build. The scalable design system continues to support their growth while maintaining the technical precision their customers expect. |

**Results:**
```
["Hundreds of thousands of social media views", "Rapid establishment as premium market leader", "Scalable design system supporting ongoing growth"]
```

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| `/images/projects/biltfour/ZwDzuAZjuENRwaTtArVGJQsGc.svg` | BILTFOUR brand hero | hero |
| `/images/projects/biltfour/sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg` | BILTFOUR brand identity — gallery 1 | gallery |
| `/images/projects/biltfour/pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg` | BILTFOUR brand identity — gallery 2 | gallery |
| `/images/projects/biltfour/fQNXA7iFcdLekr5tbHmESnMDE.jpg` | BILTFOUR brand identity — gallery 3 | gallery |
| `/images/projects/biltfour/5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg` | BILTFOUR brand identity — gallery 4 | gallery |
| `/images/projects/biltfour/VWj6qlkvnLdlyTExZDWZiezC104.jpg` | BILTFOUR brand mockup — impact 1 | mockup |
| `/images/projects/biltfour/rPlUBgrbosziZBcZfJfPe8sIHA.jpg` | BILTFOUR brand mockup — impact 2 | mockup |
| `/images/projects/biltfour/WUB4oauOJh26lOozw9rKdgUYRk.jpg` | BILTFOUR brand mockup — impact 3 | mockup |

**Services:** `["Brand Identity", "E-commerce Design", "Community Strategy", "Art Direction", "Web Design"]`

---

### Project 3: NEXT (Google Cloud)

**Slug:** `google-cloud-next`
**CSV Categories field:** `art-direction,digital-design,strategy,web-design,brand-identity`
**Year:** 2023-2024
**Client:** Google Cloud
**Duration:** 2 years
**Scope:** Demo Design System, UX Strategy, Experience Design
**Button:** text="View Event Recap", href="https://cloud.google.com/blog/topics/google-cloud-next/next-2023-wrap-up"

**Overview (description):**
> Our founder, Karim, partnered with Google Cloud for two consecutive years of NEXT to architect a scalable demo design system and deliver 50+ showcase experiences—from solar analytics to F1 machine learning—that set the standard for how Google presents products at scale.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Orchestrating 50+ demos across multiple product teams for 60,000+ attendees. | Google Cloud NEXT needed more than event design—they needed a systematic approach to demo creation that could scale across dozens of teams while maintaining Google's standards. The challenge was immense: coordinate with solution architects, product managers, and PMMs across all Cloud go-to-market neighborhoods to create cohesive yet unique demo experiences. Each year brought a new sub-brand identity that needed seamless integration, while demos ranged from technical deep-dives in solar analytics to interactive experiences like AI game shows and penalty kick challenges. We needed to enable experts to tell their stories while ensuring every demo met strict go-to-market criteria. |
| Solution | Solution | A demo design system that adapts to any output—web, apps, Figma, even Slides. | We architected a sophisticated demo design system that became the backbone of Google Cloud NEXT. What made it unique was its adaptability—working seamlessly across web platforms, low-code apps, Figma, and Google Slides—while maintaining narrative structure and visual consistency. We established a governance model to review and track progress across all demos, working closely with each expert to ensure experiences were both immersive for audiences and accurately represented product capabilities. Our team supported flagship interactive experiences including Infinite Nature, AI Game Show, and the Penalty Kick Challenge, while helping dozens of teams bring complex technologies to life through compelling storytelling. |
| Impact | Impact | Setting the standard for Google's future event demonstrations. | The impact extended far beyond the 120,000+ combined attendees across both years. Our demo design system and governance model became the template for future Google events, with many experiences being redeployed globally throughout the year. Google leadership praised how effectively the demos represented their products' capabilities while maintaining engagement. Most importantly, the systematic approach we pioneered continues to influence how Google designs and scales demo experiences, leaving a lasting mark on their event strategy. The framework proved that with the right systems, you can maintain quality and consistency across 50+ experiences while empowering individual teams to shine. |

**Results:**
```
["120,000+ combined attendees across 2 years", "50+ demo experiences delivered", "Design system became template for future Google events", "Demos redeployed globally throughout the year"]
```

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| `/images/projects/google-cloud-next/zwWkHCt1g0HSk5r9elbNigK55dk.svg` | Google Cloud NEXT hero | hero |
| `/images/projects/google-cloud-next/EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg` | NEXT demo experience — gallery 1 | gallery |
| `/images/projects/google-cloud-next/Zcgxim04ZIbn7CooJkyUahMgtU.jpg` | NEXT demo experience — gallery 2 | gallery |
| `/images/projects/google-cloud-next/vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg` | NEXT demo experience — gallery 3 | gallery |
| `/images/projects/google-cloud-next/Y1GhTfRUj1WegONQQcS7bRybV8I.jpg` | NEXT demo experience — gallery 4 | gallery |
| `/images/projects/google-cloud-next/TVWePxkVuYJ2ynKwvW8na7Gz8.jpg` | NEXT design system — mockup 1 | mockup |
| `/images/projects/google-cloud-next/1PeraZj4rwCBVywk3sEvPzcRvYw.jpg` | NEXT design system — mockup 2 | mockup |
| `/images/projects/google-cloud-next/kdIwpWfuzthCYLWztP0haNTzq0.jpg` | NEXT design system — mockup 3 | mockup |

**Services:** `["Demo Design System", "UX Strategy", "Experience Design", "Governance & Coordination"]`

---

### Project 4: Infinite Nature (Google Gemini)

**Slug:** `google-gemini-infinite-nature`
**CSV Categories field:** `strategy,digital-design`
**Year:** 2023-2024
**Client:** Google Cloud
**Duration:** 6 months
**Scope:** UX/UI, Art Direction, Design System
**Button:** text="View Case Study", href="https://cloud.google.com/transform/infinite-nature-gen-ai-biodiversity-demo-industry-applications"

**Overview (description):**
> Our founder, Karim, partnered with Google Cloud's AI Experiments team and Deep Local to create Infinite Nature—Gemini's first public demo experience, pioneering generative UI where users and AI co-create the interface in real-time while exploring 8TB of global fauna data.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Introducing the world to multimodal AI through wonder, not widgets. | Google Cloud needed to demonstrate Gemini's revolutionary multimodal capabilities—where text, image, video, and generation converge for the first time. The challenge was massive: transform 8TB of animal data into an experience that would make CEOs, politicians, and press instantly understand this momentous shift in AI technology. We needed to move beyond traditional chat interfaces to create something that felt like magic—an infinite exploration triggered by voice, text, or simply dropping a pin on a map, asking questions like 'show me all the furry green animals' and watching AI orchestrate the response. |
| Solution | Solution | Generative UI: where users and AI build the experience together. | We pioneered a new paradigm—generative UI—where the interface itself is created collaboratively between user and AI in real-time. Working with Deep Local, we designed an immersive 3D experience that felt like navigating through a constellation of data, with AI-clustered responses floating in space—proximity indicating relevance. The visual language merged dark mode aesthetics with Interstellar-like data navigation. Crucially, we implemented live architecture visualization, showing exactly which Google Cloud products were being used and how data flowed through the system, making the AI's decision-making transparent and educational. Users could infinitely explore, with each interaction generating new interface states. |
| Impact | Impact | From first demo to global deployment—redefining AI interaction. | Infinite Nature became the definitive showcase for Gemini's capabilities, deployed globally and adapted with different datasets for various audiences. Watching world leaders, CEOs, and press experience that 'aha' moment in person validated our approach—we'd successfully translated complex AI capabilities into pure wonder. The project set a new standard for AI demos, proving that the future of AI interaction isn't just conversation—it's generative interfaces where human curiosity and machine intelligence collaborate to create the experience itself. |

**No testimonials. No results metrics.**

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| `/images/projects/google-gemini-infinite-nature/enyu0AxPncALYsOKGqBz5dcGo.svg` | Infinite Nature hero | hero |
| `/images/projects/google-gemini-infinite-nature/0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg` | Infinite Nature UI — gallery 1 | gallery |
| `/images/projects/google-gemini-infinite-nature/akEhFihTl9pdmzuHDf5W4UluIjA.jpg` | Infinite Nature UI — gallery 2 | gallery |
| `/images/projects/google-gemini-infinite-nature/q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg` | Infinite Nature UI — gallery 3 | gallery |
| `/images/projects/google-gemini-infinite-nature/69we6OfP9rfNdtqOohJDJYMYcC4.jpg` | Infinite Nature UI — gallery 4 | gallery |
| `/images/projects/google-gemini-infinite-nature/ZWM3jBNXCq5MI740NZoGE0owGx4.jpg` | Infinite Nature generative UI — mockup 1 | mockup |
| `/images/projects/google-gemini-infinite-nature/FhgyvB0QzTK3QC0aY40xLmw4K8.jpg` | Infinite Nature generative UI — mockup 2 | mockup |
| `/images/projects/google-gemini-infinite-nature/fEgHnqjSmKjGa0On2DRyNU9HTo.jpg` | Infinite Nature generative UI — mockup 3 | mockup |

**Services:** `["UX/UI Design", "Art Direction", "Generative UI", "Design System"]`

---

### Project 5: Universal Audio

**Slug:** `universal-audio`
**CSV Categories field:** `digital-design,art-direction,brand-identity`
**Year:** 2022-present
**Client:** Universal Audio
**Duration:** 3+ years
**Scope:** Visual Design, Campaign Creative, Product Launches
**Button:** text="Visit Site", href="https://www.uaudio.com/"

**Overview (description):**
> Our founder, Morgan, spent 3+ years helping Universal Audio evolve from a pro-only brand to welcoming a new generation of home producers, developing creative campaigns and visual systems that bridge heritage with accessibility while driving significant new customer acquisition.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Making pro audio accessible without losing its soul. | Universal Audio, the industry leader in audio interfaces, plugins, and hardware, faced a pivotal moment. Their products were legendary among professional studios, but their messaging and visuals spoke only to seasoned engineers. With products like Volt targeting home producers and podcasters, they needed to welcome newcomers without alienating their pro base. The challenge: translate complex audio engineering concepts into accessible language and visuals that resonate with someone recording in their bedroom instead of a pro level studio. |
| Solution | Solution | Nostalgic, immersive campaigns that balance heritage with fresh energy. | Each campaign became an immersive experience—the Blockbuster Top 50 sale channeled 90s video store nostalgia, while the 12 Days campaign evoked classic game shows. By listening closely to design, product, and marketing teams, Morgan helped create a visual language that speaks to both the bedroom producer and the studio professional, using outcome-based messaging that shows what's possible rather than just listing specs. |
| Impact | Impact | Expanding the family while keeping the legacy intact. | The creative evolution delivered impressive results: hundreds of thousands of views across campaigns, above-average conversion rates, and significant new customer acquisition from the home producer segment. More importantly, Morgan helped Universal Audio maintain positive brand equity with their professional customers while successfully welcoming a new generation into the ecosystem. The work proves that premium audio brands can democratize their offerings without diluting their essence—it's about meeting people where they are in their creative journey. |

**Results:**
```
["Hundreds of thousands of campaign views", "Above-average conversion rates", "Significant new customer acquisition from home producer segment", "Maintained pro brand equity while expanding audience"]
```

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| `/images/projects/universal-audio/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg` | Universal Audio hero | hero |
| `/images/projects/universal-audio/5rY7sMJWPqahP45iscJTiYEOw.jpg` | Universal Audio campaign — gallery 1 | gallery |
| `/images/projects/universal-audio/gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg` | Universal Audio campaign — gallery 2 | gallery |
| `/images/projects/universal-audio/VKLBL93wfWhPj6VObEt1a4HlEA.jpg` | Universal Audio campaign — gallery 3 | gallery |
| `/images/projects/universal-audio/2MalmzAFsqsCILwoPC2A6s6Hs.jpg` | Universal Audio campaign — gallery 4 | gallery |
| `/images/projects/universal-audio/UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif` | Universal Audio animated mockup | mockup |
| `/images/projects/universal-audio/CJC7mcxaL9DGEYB4HGificxTbA.jpg` | Universal Audio product mockup 2 | mockup |
| `/images/projects/universal-audio/PWbwliRrvDvOr6Iw28xulNrFSc.jpg` | Universal Audio product mockup 3 | mockup |

**Services:** `["Visual Design", "Campaign Creative", "Art Direction", "Product Launch Design"]`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 5 projects have non-empty `sections[]` with Challenge, Solution, and Impact entries (each with `heading`, `headline`, and `body`)
- [ ] All 5 projects have `images[]` including hero SVG and 7-8 gallery/mockup images
- [ ] All 5 projects have `categories` as `string[]` using canonical slugs (`brand-identity`, `strategy`, `digital-design`, etc.)
- [ ] All 5 projects have `services[]`, `duration`, `buttonText`, `buttonHref`
- [ ] Iterra project has `testimonials[]` with at least 1 entry (the "This identity forced us into existence" quote)
- [ ] BILTFOUR, NEXT, and Universal Audio projects have `results[]` with metrics
- [ ] Infinite Nature project has no `testimonials` and no `results` fields (omit or set to undefined)
- [ ] All image paths reference `/images/projects/{slug}/` (not `framerusercontent.com`)
- [ ] `/src/app/projects/page.tsx` filter uses `p.categories.includes(activeFilter)` instead of `p.category === activeFilter`
- [ ] Filter state type updated from `ProjectCategory | "All"` to `string | "All"`
- [ ] `npm run build` passes with TypeScript strict mode (no `any`, no type errors)
- [ ] `npm run lint` passes with no errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/projects.ts` | modify | Replace 5 stub records with full enriched data |
| `src/app/projects/page.tsx` | modify | Update filter logic from single-category to array intersection |
| `src/components/projects/project-filters.tsx` | modify | Update type from `ProjectCategory` to `string` for filter state |

### File Ownership Notes

- `src/types/project.ts` is owned by T002. Do NOT modify it in this task — only read from it.
- `src/app/projects/[slug]/page.tsx` is owned by T010 (Wave 3). The project detail page rendering is out of scope here.
- The filter component (`project-filters.tsx`) currently imports `ProjectCategory` and `projectCategories` from `@/types/project`. After T002, those may be removed or changed. Update imports accordingly.

---

## Implementation Guidance

### Patterns to Follow

The current `src/data/projects.ts` exports:
```typescript
export const projects: Project[] = [...];
export const featuredProjects = projects.filter((p) => p.featured);
```
Preserve both exports. Keep `featuredProjects` — mark `iterra` and `biltfour` as `featured: true`, others as `featured: false` (matching current codebase).

### Thumbnail vs Hero Image

The `thumbnail` field on `Project` is used for listing cards and should be the hero SVG path:
```typescript
thumbnail: "/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg",
```
The `images[0]` entry (context: "hero") duplicates this same path. This redundancy is intentional — `thumbnail` is for lightweight listing usage, `images[]` is for the detail page gallery.

### Filter Logic Migration

In `src/app/projects/page.tsx`, the current filter line:
```typescript
return projects.filter((p) => p.category === activeFilter);
```
Must become:
```typescript
return projects.filter((p) => p.categories.includes(activeFilter));
```

The state type `ProjectCategory | "All"` must change to `string | "All"`. The import of `ProjectCategory` from `@/types/project` should be removed if T002 has removed that export.

In `project-filters.tsx`, the `ALL_FILTERS` array is currently derived from `projectCategories`. After T002, derive it from `Categories.csv` canonical values. For this task, you can hardcode the display names inline if the `categories.ts` data file doesn't exist yet (T009 creates it in Wave 3):

```typescript
const ALL_FILTERS = ["All", "art-direction", "strategy", "digital-design", "brand-identity", "web-design"] as const;
```
Or show human-readable labels with a simple map:
```typescript
const CATEGORY_LABELS: Record<string, string> = {
  "art-direction": "Art Direction",
  "strategy": "Strategy",
  "digital-design": "Digital Design",
  "brand-identity": "Brand Identity",
  "web-design": "Web Design",
};
```

### Edge Cases

- `buttonHref` for Iterra is an empty string `""`. Either omit the button in the detail view (T010 handles rendering) or keep it as empty string — the data file should store it faithfully.
- `year` for projects with ranges (e.g., "2023-2024", "2022-present") must be stored as a string, not a number.
- For `google-gemini-infinite-nature`, the slug in the current codebase is `gemini-infinite-nature` but the Framer CSV slug is `google-gemini-infinite-nature`. Use the Framer CSV slug `google-gemini-infinite-nature` as it matches the image download paths from T001.

### TypeScript

- Use strict typing — no `as any` or type assertions
- All required fields must be present on every project
- Optional fields (`testimonials`, `results`) should be omitted entirely when not applicable (not set to `undefined` explicitly)

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/types/project.ts` (owned by T002)
- `src/app/projects/[slug]/page.tsx` (owned by T010)

### Files Requiring Review

- `package.json` — do not modify for this task
- `next.config.ts` — do not modify for this task

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads all project images to `/public/images/projects/{slug}/` | Check that `/public/images/projects/iterra/` directory exists with downloaded SVG and JPG files |
| T002 | Enriched TypeScript schema in `src/types/project.ts` with `ProjectSection`, `ProjectImage`, `ProjectTestimonial`, `categories: string[]` | Verify `src/types/project.ts` exports `ProjectSection`, `ProjectImage`, `ProjectTestimonial` interfaces and that `Project` has `categories: string[]` not `category: ProjectCategory` |

### Downstream Impact

Tasks that depend on this one:
- **T009** — Derives canonical categories from the projects data
- **T010** — Renders the enriched project fields on detail pages
- **T017** — Validates image paths in the data file
- **T019** — Uses project thumbnails for homepage featured work section

**Before starting:** Check T001 and T002 are marked complete in GitHub issues. Confirm image files exist in `/public/images/projects/` and the schema matches what is documented above.

---

## GitHub Context

**Issue:** T005 (to be created)
**Branch:** `worktree/framer-cms-migration-T005`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

```
feat(projects): populate enriched project data from Framer CMS

Co-Authored-By: Claude <noreply@anthropic.com>
```

Use separate commits if the filter logic change is significant:
```
refactor(projects): update category filter to array intersection

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] No `never_touch` files modified
- [ ] `npm run lint` passes with no errors
- [ ] All 5 projects visible on `/projects` listing page
- [ ] Category filter shows correct projects for each category
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T005 | Wave: 2_
