# Task Brief: T018

**Title:** Write template stripping script
**PRD:** framer-cms-migration
**Priority:** could
**Complexity:** 5/10
**Model:** Opus
**Wave:** 4
**Feature Issue:** (see execution_plan.yaml)

---

## Objective

Write `scripts/strip-for-template.js` — a Node.js script that transforms the populated portfolio repo into a clean, redistributable template by removing proprietary MDX content, replacing data files with single-record stubs, and replacing production images with placeholder gradients. After stripping, `npm run build` must still pass. The script is idempotent and non-destructive on repeated runs.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The Open Session portfolio codebase is intended to be released as an open-source Next.js portfolio template. However, by the end of the migration, it contains:
- Real client project data (descriptions, images, testimonials, results)
- Personal blog content in MDX files
- Team photos and about page media
- Brand-specific copy throughout the data files

The template stripping script automates the cleanup so the repo can be shared publicly without exposing proprietary content. It is a one-shot transformation script meant to be run in a fork/copy of the repo — not on the production repo itself.

**T017** (content validation) must pass before T018 is run — the strip script assumes it is operating on a fully valid content state.

This task is part of **Wave 4** — integration and polish. It is marked `could` priority (nice to have) and only runs after all content is fully migrated.

---

## What the Script Does

### Phase 1: Remove MDX Content

Delete all files under `src/content/` recursively:
- `src/content/blog/*.mdx` — all blog post content
- `src/content/playbooks/*.mdx` — all playbook content (if any)
- `src/content/legal/*.mdx` — all legal page content (if any)

Do NOT delete the directories themselves (keep `.gitkeep` files so empty dirs are tracked).

### Phase 2: Replace Data Files with Stubs

Replace each data file with a stub version containing:
1. A header comment: `// TEMPLATE: replace with your content`
2. A single placeholder record with realistic dummy values
3. The same TypeScript exports as the original (same exported name, same type)

Data files to stub:
- `src/data/projects.ts` — 1 stub project
- `src/data/blog.ts` — 1 stub blog post (with `contentPath` pointing to a non-existent placeholder path — that's fine for template)
- `src/data/free-resources.ts` — 1 stub resource
- `src/data/team.ts` — 1 stub team member

Data files to leave untouched (generic, not client-specific):
- `src/data/categories.ts`
- `src/data/services.ts`
- `src/data/faq.ts`
- `src/data/process.ts`
- `src/data/values.ts`
- `src/data/stats.ts`
- `src/data/what-we-do.ts`
- `src/data/clients.ts`
- `src/data/navigation.ts`
- `src/data/playbooks.ts` (already empty — leave as-is)

### Phase 3: Replace Images with Placeholders

- Remove all files under `public/images/projects/`
- Remove all files under `public/images/blog/`
- Remove all files under `public/images/about/`
- Remove all files under `public/images/resources/`
- For each image referenced by the stub data files, create a minimal 1x1 PNG placeholder (or create a placeholder SVG gradient) so the path resolves during build
- Keep `public/logos/` intact (client logos are generic enough for a template)

### Phase 4: Verify Build

After stripping, run `npm run build` and verify it exits 0. If it fails, print the build output and exit 1 with a message explaining that the strip left the project in an unresolvable state.

**Note:** Phase 4 is optional to automate — it is acceptable to print instructions telling the user to manually run `npm run build` after stripping. However, the script MUST NOT leave the project in a state where `npm run build` fails due to broken references from the stubs.

---

## Stub Content Templates

### projects.ts Stub

```typescript
// TEMPLATE: replace with your content
import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "your-project",
    slug: "your-project",
    title: "Your Project Title",
    client: "Client Name",
    year: "2025",
    categories: ["brand-identity"],
    industry: "Your Industry",
    description: "A brief description of the project and the problem it solved.",
    thumbnail: "/images/projects/your-project/hero.svg",
    featured: true,
    tags: ["Brand Identity"],
    services: ["Brand Strategy", "Visual Identity"],
    duration: "3 months",
    buttonText: "View Project",
    buttonHref: "https://example.com",
    sections: [
      {
        heading: "The Challenge",
        headline: "One-line challenge statement",
        body: "Describe the core challenge the client faced.",
      },
      {
        heading: "Our Solution",
        headline: "One-line solution statement",
        body: "Describe how you approached and solved it.",
      },
      {
        heading: "The Impact",
        headline: "One-line impact statement",
        body: "Describe the measurable outcomes.",
      },
    ],
    images: [
      { src: "/images/projects/your-project/hero.svg", alt: "Project hero", context: "hero" },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
```

### blog.ts Stub

```typescript
// TEMPLATE: replace with your content
import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "your-first-post",
    slug: "your-first-post",
    title: "Your First Blog Post",
    excerpt: "A brief excerpt summarizing what this post is about.",
    contentPath: "src/content/blog/your-first-post.mdx",
    author: {
      name: "Your Name",
    },
    date: "2025-01-01",
    category: "Design",
    thumbnail: "/images/blog/your-first-post.jpg",
    readingTime: "5 min read",
    featured: true,
  },
];

export const featuredBlogPosts = blogPosts.filter((p) => p.featured);
```

### free-resources.ts Stub

```typescript
// TEMPLATE: replace with your content
import { FreeResource } from "@/types/free-resources";

export const freeResources: FreeResource[] = [
  {
    id: "your-resource",
    title: "Your Free Resource",
    description: "A short description of what this resource provides.",
    badge: "live",
    media: {
      type: "image",
      src: "/images/resources/your-resource.jpg",
    },
    href: "https://example.com/your-resource",
    buttonLabel: "Get for Free",
  },
];
```

### team.ts Stub

```typescript
// TEMPLATE: replace with your content
export const teamMembers = [
  {
    id: "team-member-1",
    name: "Your Name",
    role: "Founder",
    bio: "A brief biography of this team member.",
    image: "/images/about/team-member-1.jpg",
    social: {
      linkedin: "https://linkedin.com",
    },
  },
];
```

---

## Placeholder Image Generation

For each image path referenced in stub data files, the script must ensure the file exists so Next.js Image and build don't error.

The simplest approach is to write a minimal valid SVG as a placeholder:

```javascript
const PLACEHOLDER_SVG = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2a2a2a"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <text x="50%" y="50%" font-family="monospace" font-size="14" fill="#666" 
        text-anchor="middle" dominant-baseline="middle">TEMPLATE PLACEHOLDER</text>
</svg>`;
```

For JPG paths, still write the SVG file but with a `.jpg` extension — Next.js will throw a format error. Better approach: for non-SVG paths in stubs, change the extension to `.svg` in the stub templates above, OR create a minimal 1x1 valid JPEG using a base64-encoded byte string.

**Recommended:** Write stub data files that use `.svg` extensions for all images. This avoids the JPEG format issue entirely and keeps placeholder creation simple.

---

## Idempotency Requirements

Running the script twice must not fail or produce different results:
- Deleting MDX files that don't exist: use `fs.existsSync()` before `fs.unlinkSync()`
- Writing stub data files: always overwrite (not append)
- Creating placeholder image directories: use `fs.mkdirSync({ recursive: true })` — idempotent

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `scripts/strip-for-template.js` exists and is documented with inline comments
- [ ] Running the script removes all MDX files from `src/content/blog/`, `src/content/playbooks/`, `src/content/legal/` (but keeps `.gitkeep`)
- [ ] Running the script replaces `src/data/projects.ts` with a 1-record stub containing the header comment
- [ ] Running the script replaces `src/data/blog.ts` with a 1-record stub containing the header comment
- [ ] Running the script replaces `src/data/free-resources.ts` with a 1-record stub containing the header comment
- [ ] Running the script replaces `src/data/team.ts` with a 1-record stub containing the header comment
- [ ] All stub data files begin with `// TEMPLATE: replace with your content`
- [ ] Placeholder image files are created for all paths referenced in stubs
- [ ] `npm run build` passes after stripping (no missing import errors, no broken image paths)
- [ ] Script is idempotent — running it twice produces identical results without error
- [ ] Script prints a clear summary of actions taken
- [ ] No new npm packages added

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/strip-for-template.js` | create | Main template stripping script |
| `src/data/projects.ts` | modify (at runtime) | Replaced with stub by the script |
| `src/data/blog.ts` | modify (at runtime) | Replaced with stub by the script |
| `src/data/free-resources.ts` | modify (at runtime) | Replaced with stub by the script |
| `src/data/team.ts` | modify (at runtime) | Replaced with stub by the script |

**Note:** The data files listed above are modified by the *script when executed*, not by you directly during development. You write the script; the script modifies the data files when run.

### File Ownership Notes

`src/data/projects.ts`, `src/data/blog.ts` are flagged as potentially touched by many tasks. This script treats them as output targets — it overwrites them entirely. It should only be run in a fork or template-release branch, never on the production repo.

---

## Implementation Guidance

### Script Structure

```javascript
#!/usr/bin/env node
// scripts/strip-for-template.js
//
// Transforms this portfolio repo into a clean template for open-source release.
// WARNING: This script removes real content. Run in a fork, not the production repo.
// Run with: node scripts/strip-for-template.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const actions = [];

// ──────────────────────────────────────────────
// Phase 1: Remove MDX content files
// ──────────────────────────────────────────────
function removeMdxFiles(dir) { ... }

// ──────────────────────────────────────────────
// Phase 2: Write data file stubs
// ──────────────────────────────────────────────
function writeStub(filePath, content) {
  fs.writeFileSync(path.resolve(ROOT, filePath), content, 'utf-8');
  actions.push(`Replaced: ${filePath}`);
}

// ──────────────────────────────────────────────
// Phase 3: Write placeholder images
// ──────────────────────────────────────────────
function writePlaceholder(imagePath) {
  const abs = path.resolve(ROOT, 'public' + imagePath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (!fs.existsSync(abs)) {
    fs.writeFileSync(abs, PLACEHOLDER_SVG, 'utf-8');
    actions.push(`Created placeholder: ${imagePath}`);
  }
}

// ──────────────────────────────────────────────
// Run all phases
// ──────────────────────────────────────────────
removeMdxFiles('src/content');
writeStub('src/data/projects.ts', PROJECTS_STUB);
writeStub('src/data/blog.ts', BLOG_STUB);
writeStub('src/data/free-resources.ts', FREE_RESOURCES_STUB);
writeStub('src/data/team.ts', TEAM_STUB);
writePlaceholder('/images/projects/your-project/hero.svg');
writePlaceholder('/images/blog/your-first-post.svg');
writePlaceholder('/images/resources/your-resource.svg');
writePlaceholder('/images/about/team-member-1.svg');

// Summary
console.log('\nTemplate stripping complete.\n');
actions.forEach(a => console.log(`  ✓ ${a}`));
console.log('\nNext: run npm run build to verify the template builds clean.\n');
```

### Removing MDX Files While Preserving .gitkeep

```javascript
function removeMdxFiles(dirRelative) {
  const abs = path.resolve(ROOT, dirRelative);
  if (!fs.existsSync(abs)) return;
  
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      removeMdxFiles(path.join(dirRelative, entry.name));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const filePath = path.join(abs, entry.name);
      fs.unlinkSync(filePath);
      actions.push(`Removed: ${path.join(dirRelative, entry.name)}`);
    }
    // .gitkeep and README files are left untouched
  }
}
```

### Stub File Variable Names

Define each stub content as a const string at the top of the script for clarity:

```javascript
const PROJECTS_STUB = `// TEMPLATE: replace with your content
import { Project } from "@/types/project";
// ...full stub content...
`;

const BLOG_STUB = `// TEMPLATE: replace with your content
// ...
`;
// etc.
```

### Code Style

- Plain Node.js only — no ESM syntax (use `require`, not `import`)
- No external npm packages
- Inline JSDoc comment at the top explaining purpose and usage
- `console.log` for progress, `console.error` for failures
- `process.exit(1)` on unrecoverable errors

### Edge Cases

- If a data file listed for stubbing doesn't exist yet (e.g. `free-resources.ts` was never created by T007), still write the stub — this is fine and creates the file
- If `src/content/` directory doesn't exist, skip without error
- The stub types must match the TypeScript interfaces that will still be compiled during `npm run build`. If the enriched Project type from T002 has required fields like `sections`, `images`, etc., the stub MUST include those fields or the build will fail
- If `src/data/team.ts` doesn't exist (it may already exist from the base codebase), overwrite it with the stub

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T017 | Content validation script exists and passes | Run `node scripts/validate-content.js` — should exit 0 |

### Downstream Impact

Tasks that depend on this one: None — T018 is a leaf task.

**Before starting:** Verify T017 is complete:
- `scripts/validate-content.js` exists
- Run `node scripts/validate-content.js` and confirm it exits 0 (or note which issues exist and whether they'll be cleaned up by stripping)

---

## GitHub Context

**Issue:** T018
**Branch:** `worktree/framer-cms-migration-T018`
**Target:** `main` (or active feature branch if in use)

---

## Commit Guidelines

```
chore(scripts): add template stripping script for open-source release

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Script exists at `scripts/strip-for-template.js`
- [ ] Build passes: `npm run build` (before running the strip script — verify production build is clean)
- [ ] Tested strip in a git stash/branch: run the script, then `npm run build`, then `git stash` to restore
- [ ] Lint passes: `npm run lint`
- [ ] `package.json` not modified
- [ ] `package-lock.json` not modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T018 | Wave: 4_
