# React Architecture Reference

<!-- Last updated: 2026-04-03 -->

> Applies to all files under `src/components/`, `src/app/`, `src/hooks/`, `src/utils/`, `src/lib/`.
> Does NOT apply to `src/components/uui/` (vendor library code).

---

## Principle 1: Separation of Concerns

**Rule:** Each component handles one UI job and operates independently.

**Threshold:** If a component does rendering + data fetching + complex state management, it needs to be split.

```tsx
// DO — ContactPage orchestrates, ContactForm renders
// src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <main>
      <ContactForm />         {/* handles form UI */}
      <ContactInfo />         {/* handles info display */}
    </main>
  );
}

// DON'T — one component fetches, validates, submits, and renders
export function ContactForm() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  // ...validation logic, API call, form state, render — all in one place
}
```

**Known violations:**
- `src/components/blog/blog-post.tsx` — `BlogPostView` contains an inline markdown-to-JSX parser (the `split("\n\n").map()` block) mixed with layout rendering. Extract a `<MarkdownContent>` component.
- `src/components/shared/contact-form.tsx` — mixes form state, validation, submission, and rendering. Extract submit logic to a `useFormSubmission` hook.

---

## Principle 2: Single Responsibility

**Rule:** One reason to change per file. Each module tackles one functionality.

**Thresholds:**
- **150 lines** — soft limit, review for extraction opportunities
- **200 lines** — hard limit, must decompose before merging

Line count excludes imports and type definitions.

```tsx
// DO — dedicated utility for a single task
// src/utils/dev-props.ts
export function devProps(componentName: string): Record<string, string> {
  if (process.env.NODE_ENV === 'production') return {};
  return { 'data-component': componentName };
}

// DON'T — 260-line component with hero, sidebar, content, and navigation
// src/components/projects/project-detail.tsx (current state)
```

**Known violations:**
- `src/components/projects/project-detail.tsx` (260 lines) — contains hero, hero image, sidebar metadata, content body, and prev/next navigation. Decompose into `ProjectHero`, `ProjectContent`, `ProjectNavigation`.
- `src/components/blog/blog-post.tsx` (158 lines) — near limit due to inline markdown parser.
- `src/components/layout/header.tsx` (149 lines) — manages scroll-progress tracking, mobile menu state, and body overflow locking. Acceptable but monitor.
- `src/components/home/stats-counter.tsx` — three internal components (`SlotDigit`, `SlotNumber`, `StatItem`) plus a `requestAnimationFrame` animation loop. Extract `useSlotAnimation` hook.

---

## Principle 3: DRY / Pattern Consolidation

**Rule:** No pattern should be duplicated across 2+ files without extraction into a shared component or hook.

When you see the same logic in two places, extract it. Three similar lines is better than a premature abstraction — but two identical 15-line blocks is not.

**Known duplicated patterns:**

| Pattern | Files | Extraction target |
|---------|-------|-------------------|
| Word-split headline animation | `home/hero.tsx`, `about/about-hero.tsx` | `<WordRevealHeadline>` component |
| Form submission state machine (`idle/loading/success/error`) | `shared/contact-form.tsx`, `shared/newsletter-form.tsx` | `useFormSubmission` hook |
| Image placeholder (`bg-bg-tertiary` + centered text) | `project-card.tsx`, `project-detail.tsx`, `blog-card.tsx`, `blog-post.tsx`, `team-section.tsx` | `<ImagePlaceholder>` component |
| Accordion expand/collapse + Plus/Minus toggle | `shared/faq-accordion.tsx`, `home/services-section.tsx` | Shared `accordionContent` variant + icon toggle |
| Inline `useInView` + `motion.div` reveal | 11+ section components | Use existing `<ScrollReveal>` from `shared/scroll-reveal.tsx` |

---

## Principle 4: State Management

**Rule:** If a prop passes through 2+ intermediary components unchanged, it's prop drilling. Extract to Context, composition, or URL state.

**Threshold:** Max 2 levels of prop passing.

```tsx
// DO — composition avoids drilling
function ProjectPage() {
  const filters = useProjectFilters();
  return (
    <ProjectFilters {...filters} />
    <ProjectGrid projects={filters.filtered} />
  );
}

// DON'T — prop drills through intermediaries
<Page user={user}>
  <Sidebar user={user}>
    <UserInfo user={user} />    {/* 3 levels deep — use Context */}
  </Sidebar>
</Page>
```

**Current state:** No violations found. The project is early-stage and data flows are shallow. This rule prevents future problems.

---

## Principle 5: Performance Optimization

**Rule:** Lazy load heavy components. Code-split where appropriate. Profile before optimizing.

```tsx
// DO — lazy load Three.js scene (already done correctly)
// src/components/home/hero.tsx
const CRTTVScene = dynamic(() =>
  import('@/components/three/crt-tv-scene').then(mod => mod.CRTTVScene),
  { ssr: false }
);

// DON'T — eagerly import a heavy component that's below the fold
import { HeavyChart } from '@/components/charts/heavy-chart';
```

**Rules of thumb:**
- Use `next/dynamic` with `ssr: false` for client-only heavy components (Three.js, charts, editors)
- Don't sprinkle `React.memo` or `useMemo` everywhere — profile first
- Refs over state for values read in animation loops (see `useMousePosition` hook as a good example)

---

## Principle 6: Shared Component Usage

**Rule:** When a shared component exists, use it. Do not reimplement with raw CSS classes or inline logic.

**Existing shared components that MUST be used:**

| Component | Location | Instead of |
|-----------|----------|------------|
| `<SectionLabel>` | `src/components/shared/section-label.tsx` | Raw `<p className="section-label">` |
| `<ScrollReveal>` | `src/components/shared/scroll-reveal.tsx` | Inline `useInView` + `motion.div` patterns |
| `<Button>` | `src/components/shared/button.tsx` | Raw `<button>` or `<a>` with manual styling |
| `<ScrambleText>` | `src/components/shared/scramble-text.tsx` | Inline text scramble logic |
| `<FAQAccordion>` | `src/components/shared/faq-accordion.tsx` | Custom accordion implementations |

**Known violations:**
- 8 files use `<p className="section-label">` instead of `<SectionLabel>`: `hero.tsx`, `faq-section.tsx`, `services-section.tsx`, `logo-marquee.tsx`, `process-section.tsx`, `values-section.tsx`, `about-hero.tsx`, `team-section.tsx`
- `<ScrollReveal>` is never used by any section component — all 11+ sections roll their own reveal animation

---

## Principle 7: Constants Centralization

**Rule:** No hardcoded business strings (emails, URLs, pricing, contact info) in component files. Import from a constants or data file.

```tsx
// DO
import { CONTACT_EMAIL, BOOKING_URL } from '@/lib/constants';

// DON'T
<a href="mailto:hello@opensession.co">hello@opensession.co</a>
<a href="https://cal.com/opensession">Book a call</a>
```

**Known violations:**
- `hello@opensession.co` hardcoded in: `cta-section.tsx`, `faq-section.tsx`, `terms/page.tsx`
- `https://cal.com/opensession` hardcoded in: `contact/page.tsx`
- `"Remote / Los Angeles, CA"` hardcoded in: `contact/page.tsx`
- Workshop pricing strings hardcoded inline in: `workshop/page.tsx`
- Budget options hardcoded at top of: `contact-form.tsx`

**Action:** Create `src/lib/constants.ts` and migrate all shared strings there.

---

## devProps Requirement

**Rule:** Every feature component's root DOM element must spread `devProps('ComponentName')`.

```tsx
import { devProps } from '@/utils/dev-props';

export function ContactForm() {
  return (
    <form {...devProps('ContactForm')}>
      {/* form content */}
    </form>
  );
}
```

**Utility location:** `src/utils/dev-props.ts`

**Exemptions:**
- `src/components/uui/**` — vendor library code, add devProps only to feature-level wrappers
- `src/components/providers/theme-provider.tsx` — context provider with no meaningful root DOM element
- Page layout files (`layout.tsx`, `template.tsx`) — thin server wrappers

**Audit:** Run `/audit-devprops` for a compliance report.

**Cross-reference:** See `design-system.md` § "devProps on UUI Wrapper Components" for the UUI exemption rationale.

---

## Props Typing Convention

**Rule:** Use `interface` for component props. Use `type` only for union/discriminated union patterns.

```tsx
// DO — interface for props
interface ProjectCardProps {
  project: Project;
  index: number;
}

// DO — type for discriminated union (Button component pattern)
type ButtonProps = ButtonAsButton | ButtonAsLink;

// DON'T — inline props
function Card({ title, desc }: { title: string; desc: string }) {}

// DON'T — defaultProps (React 19 deprecated)
Card.defaultProps = { desc: 'Default' };

// DO — default values via destructuring
function Card({ title, desc = 'Default' }: CardProps) {}
```

---

## Refactoring Backlog

These are known issues to address in future work sessions. They are documented here so new work doesn't compound them.

### High priority (blocks clean architecture)
- [ ] Extract `src/lib/constants.ts` with `CONTACT_EMAIL`, `BOOKING_URL`, `LOCATION`
- [ ] Migrate 8 raw `section-label` usages to `<SectionLabel>`
- [ ] Extract `useFormSubmission` hook from `contact-form.tsx` / `newsletter-form.tsx`

### Medium priority (improves maintainability)
- [ ] Extract `<WordRevealHeadline>` from `hero.tsx` / `about-hero.tsx`
- [ ] Extract `<ImagePlaceholder>` from the 5+ components using the pattern
- [ ] Migrate inline `useInView` animations to `<ScrollReveal>`
- [ ] Move `workshops` data from `workshop/page.tsx` to `@/data/workshops.ts`
- [ ] Move `comparisonData` from `why-section.tsx` to `@/data/`

### Lower priority (larger refactors)
- [ ] Decompose `ProjectDetail` into sub-components (`ProjectHero`, `ProjectContent`, `ProjectNavigation`)
- [ ] Extract inline markdown parser from `BlogPostView` into `<MarkdownContent>`
- [ ] Extract `useSlotAnimation` hook from `stats-counter.tsx`
- [ ] Move social icon wrappers from `footer.tsx` to a shared icons file
