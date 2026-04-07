# Task Brief: T003

**Title:** Set up content directory structure for MDX files
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation)

---

## Objective

Create the `src/content/` directory tree for file-based MDX content and ensure it is tracked by git and resolvable by TypeScript. This is a scaffolding-only task — no MDX content is authored here.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The portfolio uses a file-based CMS approach: blog posts and playbooks will live as `.mdx` files in `src/content/blog/` and `src/content/playbooks/`. These directories do not exist yet — the entire `src/content/` tree is absent from the codebase.

Git does not track empty directories, so `.gitkeep` files are needed to ensure the directories exist after cloning. Each directory also needs a short `README.md` explaining the file format expected by the MDX renderer.

The existing `tsconfig.json` only has one path alias:
```json
"paths": { "@/*": ["./src/*"] }
```

This means `@/content/blog/ep02.mdx` would resolve correctly, but the content loader (added in T011) will use `fs.readFileSync` with `path.join(process.cwd(), 'src/content', ...)` — no new path alias is strictly required. However, the task specifies confirming `tsconfig.json` paths include or resolve `src/content/`. The `@/*` alias covers this already since `@/content/*` maps to `./src/content/*`.

Verify this is sufficient. If the MDX loader in T011 uses the `@` alias to import content, no tsconfig change is needed. If it reads files via `process.cwd()` + relative path, also no tsconfig change is needed. Add a `baseUrl` of `"."` if and only if it would otherwise cause a build error.

This task is part of **Wave 1** — foundation. T006 (blog MDX), T008 (legal pages), and T013 (playbook scaffolding) all depend on this directory structure existing.

---

## Research Context

### Current State

```
src/
  app/
  components/
  data/
  lib/        (may or may not exist — verify)
  types/
```

No `src/content/` directory exists. No content infrastructure exists.

### Existing tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

The glob `"**/*.ts"` and `"**/*.tsx"` in `include` will automatically pick up any TypeScript files added to `src/content/`. The `@/*` path alias resolves `src/content/` as `@/content/`. No structural tsconfig changes are needed unless the build test reveals otherwise.

---

## Requirements

### Directory Structure to Create

```
src/
  content/
    blog/
      .gitkeep
      README.md
    playbooks/
      .gitkeep
      README.md
    legal/            ← needed by T008
      .gitkeep
```

### `.gitkeep` Files

Empty files. Their sole purpose is to make Git track the empty directory.

### `src/content/blog/README.md`

```markdown
# Blog Content

Each blog post is an MDX file named `{slug}.mdx`.

## File Format

\`\`\`mdx
# Post Title

Body content in Markdown/MDX format.

## Section Heading

Paragraph text...
\`\`\`

## Metadata

Post metadata (title, date, author, category, thumbnail, readingTime) is stored in
`src/data/blog.ts` — not in frontmatter. The MDX file contains only the body content.

## Slugs

The filename (without `.mdx`) must match the `slug` field in `src/data/blog.ts`.

## Current Posts

- `ep02-creative-ai-framework.mdx`
- `ep01-creativity-over-compute.mdx`
- `democratizing-fortune-500-design.mdx`
- `mcp-for-designers.mdx`
```

### `src/content/playbooks/README.md`

```markdown
# Playbooks Content

Each playbook is an MDX file named `{slug}.mdx`.

## File Format

Same as blog posts — MDX body content only. Metadata lives in `src/data/playbooks.ts`.

## Status

Playbook content is future work. This directory is scaffolded but empty.
```

### `tsconfig.json` Update (conditional)

Check if `npm run build` passes after creating the directories and `.gitkeep` files. If it does, no tsconfig change is needed — the existing `@/*` alias is sufficient.

If the build fails with a path resolution error related to `src/content/`, add `"baseUrl": "."` to `compilerOptions`:

```json
"compilerOptions": {
  "baseUrl": ".",
  ...existing options...
}
```

Only add this if needed.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/content/blog/` directory exists and contains `.gitkeep`
- [ ] `src/content/playbooks/` directory exists and contains `.gitkeep`
- [ ] `src/content/legal/` directory exists and contains `.gitkeep`
- [ ] `src/content/blog/README.md` exists with format documentation
- [ ] `src/content/playbooks/README.md` exists with format documentation
- [ ] `npm run build` passes (empty content directories do not cause errors)
- [ ] `tsconfig.json` includes a path alias or `baseUrl` that resolves `src/content/` (verify `@/content/*` maps correctly via existing `@/*` alias)

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/content/blog/.gitkeep` | create | Tracks empty directory in git |
| `src/content/blog/README.md` | create | Documents MDX file format for blog |
| `src/content/playbooks/.gitkeep` | create | Tracks empty directory in git |
| `src/content/playbooks/README.md` | create | Documents MDX file format for playbooks |
| `src/content/legal/.gitkeep` | create | Tracks empty directory for T008 |
| `tsconfig.json` | modify (conditional) | Add baseUrl only if build fails without it |

### File Ownership Notes

`tsconfig.json` is marked `require_review` in `config.yaml`. Only modify it if strictly needed (i.e., build fails without the change). The existing `@/*` alias should be sufficient.

`src/content/blog/` will receive MDX files in T006. `src/content/playbooks/` will receive MDX files in future work. `src/content/legal/` will receive MDX files in T008. No conflicts within Wave 1.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`

### Files Requiring Review

- `tsconfig.json` — only modify if `npm run build` requires it

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T006** — blog MDX migration (writes MDX files to `src/content/blog/`)
- **T008** — legal pages (writes MDX files to `src/content/legal/`)
- **T013** — playbook scaffolding (reads from `src/content/playbooks/`)

---

## GitHub Context

**Branch:** `worktree/framer-cms-migration-T003`
**Target:** feature branch `feat/framer-cms-migration` or main (determined by PM Agent)

---

## Commit Guidelines

```
chore(content): scaffold src/content directory structure for MDX

Creates blog/, playbooks/, and legal/ subdirectories with .gitkeep
files and README documentation for MDX content format.

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking task complete:

- [ ] All success criteria met
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `git status` shows new `.gitkeep` and `README.md` files tracked

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T003 | Wave: 1_
