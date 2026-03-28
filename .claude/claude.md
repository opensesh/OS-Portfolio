# OS-Portfolio - Claude Development Guide

## Project Overview

Personal portfolio website built with Next.js 16+, React 19, TypeScript, Tailwind CSS, and Framer Motion.

## Essential Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Tech Stack

- **Framework**: Next.js 16+ App Router
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Language**: TypeScript

## Key Directories

```
src/
  app/            # Next.js pages and API routes
  components/     # React components
  lib/            # Utilities and helpers
public/           # Static assets
.claude/          # Claude configuration
```

## Claude Configuration Structure

The `.claude/` directory is organized for Claude Code CLI compatibility.

| Folder       | Purpose                              |
| ------------ | ------------------------------------ |
| `commands/`  | User-invoked slash commands          |
| `plugins/`   | Full capability packages             |
| `skills/`    | Auto-activating contextual knowledge |
| `brand/`     | Brand identity docs, writing guides  |
| `reference/` | Design system, MCP setup             |

---

## Code Conventions

### TypeScript

- Strict mode enabled
- Prefer `interface` for component props
- Use Zod for runtime validation where needed

### Components

- Co-locate component-specific types in the same file
- Prefer composition over prop drilling

### Styling: Use Mapped Tailwind Classes

```css
/* ✅ CORRECT - Semantic classes */
bg-bg-primary          /* Main background */
bg-bg-secondary        /* Elevated surfaces */
text-fg-primary        /* Primary text */
text-fg-secondary      /* Secondary text */
border-border-primary  /* Interactive element borders */
border-border-secondary /* Container borders */

/* ❌ WRONG - Raw CSS variables */
bg-[var(--bg-primary)]

/* ❌ WRONG - Opacity modifiers don't work with CSS vars */
bg-[var(--bg-secondary)]/30
```

---

## Framer Motion Patterns

### Basic Animation

```tsx
import { motion } from 'framer-motion';

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

### Stagger Children

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={item} />
  ))}
</motion.ul>
```

---

## Design System

### Key Rules

- **CSS Syntax**: Use mapped Tailwind classes
- **Opacity**: Never use `/30` or `/50` modifiers with CSS vars
- **Borders**: Use semantic border colors
- **Icons**: Use Lucide React for icons

### Validation Requirements

Before completing any feature:

1. `npm run lint` - No ESLint errors
2. `npm run build` - Clean build

---

## Instruction Precedence

When instructions conflict, follow this priority order (highest to lowest):

1. **Project CLAUDE.md** (root)
2. **This file** (.claude/claude.md)
3. **Global ~/.claude/CLAUDE.md**

Skills auto-activate based on context and supplement the above.
