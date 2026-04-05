# Home Page Audit

## Context

Open Session is a design studio going through a rebrand. The primary goals of the website are:

1. **Establish identity** — showcase the rebrand and make a visual statement
2. **Signal premium positioning** — attract $20k+ projects without feeling like a traditional agency
3. **Win awards** — the site itself should be a portfolio piece
4. **Leave room for the product** — a separate BOS product site will exist eventually

The audience is someone landing on the site and thinking: *"Oh shit, these guys are serious."*

---

## Current Structure (10 Sections)

| # | Section | Purpose | Complexity |
|---|---------|---------|------------|
| 1 | Hero | Brand statement + 3D CRT TV experience | Very High |
| 2 | What We Do | 5-item accordion with image transitions | High |
| 3 | Logo Marquee | "Trusted By" client logos | Low |
| 4 | Stats Counter | 4 animated metrics | High |
| 5 | Process | 4-step workflow (Discover → Deliver) | Low |
| 6 | Featured Work | 3 project cards | Medium |
| 7 | Services | 4-item accordion with tags | Medium |
| 8 | Why Open Session | Comparison table vs agencies/freelancers | Medium |
| 9 | FAQ | 5 common questions | Medium |
| 10 | CTA | Final conversion with contact info | High |

**Total: 10 sections, 3 accordion patterns, heavy scroll depth.**

---

## Redundancy Issues

### 1. What We Do vs Services — Two sections saying the same thing

**What We Do** lists 5 areas: Brand Identity, Design Systems, Content Strategy, Context Optimization, Creative AI.

**Services** lists 4 areas: Brand Identity, Digital Design, Art Direction, Strategy & Consulting.

Both are accordion components. Both describe what you offer. A visitor sees "what we do" and then scrolls past 4 more sections only to hit "services" — which feels like a repeat. This is the single biggest structural problem.

**Recommendation:** Merge into one. Pick the framing that best serves your positioning (see proposed structure below).

### 2. Stats Counter + Logo Marquee + Why Section — Triple social proof

You currently have three separate sections dedicated to credibility:
- **Logo Marquee:** "Trusted By" Google, Anthropic, Vercel, etc.
- **Stats Counter:** 15+ years, 50+ brands, 100% satisfaction
- **Why Open Session:** Comparison table vs agencies and freelancers

For a studio that doesn't primarily want client work, this is a lot of "hire us" energy. The comparison table especially reads as a sales page — it positions you *against* alternatives, which is an agency move.

**Recommendation:** Consolidate to one moment of proof. Let the work speak for itself.

### 3. Process Section — Generic and undifferentiating

Discover → Define → Design → Deliver is the same process literally every design studio lists. For a site that wants to win awards and feel distinctive, this section actively works against you — it signals "we're like everyone else."

**Recommendation:** Cut it, or radically reimagine it as something unique to your philosophy.

---

## Strategic Tension

The current page structure tells the story of **a design agency looking for clients**. Every section after the hero is oriented around conversion: what we do, who trusts us, our stats, our process, our services, why us vs competitors, FAQ about pricing, book a call.

But your actual goal is: **"We're a design studio. Look at what we can do."**

That's a fundamentally different story. Award-winning studio sites tend to follow a pattern:

1. **Bold statement** — who you are, in one breath
2. **Show, don't tell** — let the work do the talking
3. **Philosophy/point of view** — what makes you *think* differently
4. **Proof** — one clean moment of credibility
5. **Open door** — a way in, if they're the right fit

Your current structure buries the work (section 6 of 10) and front-loads explanation. The hero is strong, but then you immediately explain yourself for 4 sections before showing any work.

---

## Proposed Structure

### Section 1: Hero (Keep, refine)

The CRT TV experience is strong and unique. This is your award moment — lean into it.

**Refinements to consider:**
- The tagline "A modern design studio" is safe. Consider something with more edge that reflects your actual point of view.
- "Brand strategy meets design systems" is descriptive but not provocative. What's the *tension* in what you do?
- Two CTAs ("Start a Project" + "View Our Work") right in the hero is agency behavior. For a studio-first site, the hero should be experiential, not transactional. Consider letting the scroll be the CTA.

### Section 2: Featured Work (Move up, expand)

This is the most important section on the page and it's currently buried at position 6. Move it immediately after the hero.

**Why:** When someone lands and thinks "these guys are serious," the next thing they need to see is *proof*. Not a services list — work.

**Refinements to consider:**
- 3 cards in a grid is standard portfolio fare. For an award-winning site, think about more immersive presentation — full-bleed images, scroll-driven reveals, case study teasers with motion.
- The current cards have placeholder gradients. Real imagery is essential here.
- Let each project breathe. Quality over quantity.

### Section 3: Capabilities (Merge What We Do + Services)

One section that communicates what you do. Not two.

**Refinements to consider:**
- The What We Do accordion with pixel transitions is the more interesting implementation — use that as the base.
- Trim to 3-4 areas max. Five services plus four more is too many categories. Think about what's distinctive:
  - **Brand Identity** (your core)
  - **Design Systems** (your differentiator)
  - **Creative AI** (your edge — no one else is leading with this)
- Frame as capabilities, not services. "We do this" vs "You can hire us for this."
- Consider whether this even needs to be an accordion. A more visual/spatial layout could be more memorable.

### Section 4: Philosophy / Point of View (Replace Process + Why)

Instead of a generic process and a comparison table, create one section that communicates *how you think*. This is where your personality comes through.

**What this could look like:**
- Your values (Craft, Collaboration, Clarity, Impact) presented in a way that has visual weight
- A manifesto-style statement about design
- Your perspective on AI + design (this is genuinely differentiating)
- Something that makes someone nod and say "I want to work with people who think like this"

**What to avoid:**
- The "Agency vs Freelancer vs Us" comparison table (positions you as a vendor)
- The 4-step process diagram (positions you as interchangeable)

### Section 5: Social Proof (Consolidate Marquee + Stats)

One clean moment of credibility. Options:

- **Option A:** Logo marquee only — the names (Google, Anthropic, Vercel, Figma) do the heavy lifting. No stats needed.
- **Option B:** A testimonial from one recognizable client + logo strip. One strong quote > four generic metrics.
- **Option C:** Integrate logos into the work section (show the logos next to the projects they're from).

**What to cut:**
- Stats counter. "15+ Years Experience" and "100% Client Satisfaction" are generic agency metrics. They don't support "oh shit, these guys are serious." They support "oh, another agency."

### Section 6: CTA (Keep, refine)

The current CTA section is well-designed. Refinements:

- **Tone shift:** Instead of "Start a Project" + "Book a Workshop," consider language that filters for premium: "Have an ambitious project?" or "Let's talk if the fit is right."
- **Remove "Book a Workshop"** from the home page CTA — workshops are a different audience. Keep the home page focused on one action.
- The FAQ can be folded into a contact/project page rather than living on the home page. Five FAQ items add scroll depth without adding impact.

---

## Proposed Structure Summary

| # | Section | Maps to Current | Change |
|---|---------|-----------------|--------|
| 1 | Hero | Hero | Refine copy, reduce CTAs |
| 2 | Featured Work | Featured Work (#6) | Move up, expand presentation |
| 3 | Capabilities | What We Do + Services | Merge, trim to 3-4 areas |
| 4 | Philosophy | Process + Why Section | Replace with POV/values |
| 5 | Social Proof | Logo Marquee + Stats | Consolidate to one moment |
| 6 | CTA | CTA | Refine language, cut FAQ |

**From 10 sections → 6 sections.** Tighter, more confident, less explaining.

---

## What Gets Cut or Relocated

| Section | Recommendation | Reason |
|---------|---------------|--------|
| Stats Counter | **Cut** | Generic agency metrics don't match studio positioning |
| Process | **Cut or reimagine** | Every studio has this; undifferentiating |
| Services accordion | **Merge into Capabilities** | Redundant with What We Do |
| Why Open Session table | **Cut** | Comparison framing is agency/vendor behavior |
| FAQ | **Move to /contact** | Adds scroll depth without impact on home page |

---

## Accessibility Notes

The current implementation has some accessibility considerations to keep in mind:

- **Three WebGL/Canvas elements in the hero** (Faulty Terminal, CRT TV Scene, Burn Transition) — ensure graceful degradation and respect `prefers-reduced-motion`
- **Accordion-heavy design** — screen readers need proper ARIA roles, which the current implementation handles via Framer Motion's AnimatePresence
- **Auto-playing marquee** — should pause on hover and respect reduced motion preferences
- **Scroll-linked animations** — the hero's 300vh scroll height with fading text could be disorienting. Ensure content is accessible without the scroll animation
- **Color contrast** — the Vanilla/Charcoal palette is excellent (18.5:1 ratio). Aperol on Charcoal meets AA. Keep this.

---

## Award-Winning Site Principles

For context, sites that win Awwwards/FWA/CSS Design Awards share these traits:

1. **Strong editorial POV** — they say something, not just show services
2. **Immersive transitions** — scroll-driven storytelling, not section after section
3. **Work front and center** — the portfolio IS the experience
4. **Restraint** — fewer sections, more impact per section
5. **Technical craft** — WebGL, custom shaders, physics (you already have this with the CRT TV)
6. **Typography as design** — large type, creative layouts, not just content blocks
7. **No template patterns** — comparison tables, generic stat counters, and cookie-cutter processes actively hurt

Your hero already has the technical craft. The opportunity is in the structure and storytelling that follows it.

---

## Next Steps

1. **Decide on the 6-section structure** — or adjust based on what feels right
2. **Write the copy** — especially the philosophy section; this is where voice matters most
3. **Design the work showcase** — this is the money section; it needs to be exceptional
4. **Consolidate components** — removing 4 sections and merging 2 will simplify the codebase significantly
5. **Consider page transitions** — if you want awards, the journey between sections matters as much as the sections themselves
