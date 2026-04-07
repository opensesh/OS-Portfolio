# Task Brief: T017

**Title:** Write content validation script
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 4/10
**Model:** Sonnet
**Wave:** 4
**Feature Issue:** (see execution_plan.yaml)

---

## Objective

Write `scripts/validate-content.js` — a Node.js script that validates all migrated content data files for integrity. It checks that image files exist on disk, MDX content files exist, required fields are present on every record, and external URLs use HTTPS. The script exits with code 0 on success or code 1 with a clear issue list on failure.

---

## Context

**Parent Feature:** framer-cms-migration PRD

By Wave 4, the following data files have been populated by earlier waves:
- `src/data/projects.ts` (T005) — 5 projects with `images[]`, `thumbnail`, `sections[]`, etc.
- `src/data/blog.ts` (T006) — 4 blog posts with `contentPath` pointing to MDX files in `src/content/blog/`
- `src/data/free-resources.ts` (T007) — 5 free resources with `media.src` paths and external `href` links
- `src/data/playbooks.ts` (T013) — currently empty array, but schema is defined

The validation script is a safety net before the template stripping script (T018) runs. It confirms the content is complete and correct so that stripping is performed on valid data.

The script runs with plain Node.js (`node scripts/validate-content.js`) — no TypeScript compilation, no bundler. It reads the data files by importing them using dynamic `require()` or by parsing them as text, and checks existence of referenced files on the filesystem.

**Important note on reading TypeScript data files:** Since the data files are `.ts`, the script cannot `require()` them directly without compilation. Use one of these approaches:
1. Parse the files as text and extract paths using regex (simpler, less fragile for path extraction)
2. Use `tsx` or `ts-node` if available — but do NOT add new devDependencies; check if they exist first
3. Write the script to read a compiled JSON dump OR duplicate the key data as JSON files — but this adds maintenance overhead

**Recommended approach:** Parse the TypeScript files as text using regex to extract string values that look like paths and URLs. This is sufficient for validation and avoids a TypeScript compilation dependency.

This task is part of **Wave 4** — integration and polish.

---

## Data File Structure (What to Validate)

### `src/data/projects.ts`

Each project record has:
- `slug` (required string — must not be empty)
- `title` (required string — must not be empty)
- `thumbnail` (required string — must be a path starting with `/images/`)
- `images[]` (array — each item has `src` starting with `/images/`)
- All image `src` values → check file exists at `public${src}` (e.g. `/images/projects/iterra/hero.svg` → `public/images/projects/iterra/hero.svg`)

### `src/data/blog.ts`

Each post record has:
- `slug` (required)
- `title` (required)
- `contentPath` (required string — path to MDX file like `src/content/blog/ep02-creative-ai-framework.mdx`)
- `thumbnail` (required string — must be a path under `/images/`)
- `contentPath` → check file exists at the path (relative to project root)
- `thumbnail` → check file exists at `public${thumbnail}`

### `src/data/free-resources.ts`

Each resource record has:
- `id` (required)
- `title` (required)
- `href` (required — must start with `https://`)
- `media.src` (required — path under `/images/` for images, or a URL for videos; if starts with `/`, check file exists at `public${src}`)

### `src/data/playbooks.ts`

- Array may be empty — if empty, skip validation (no error)
- If records exist: same structure as BlogPost — validate `slug`, `title`, `contentPath`, `thumbnail`

---

## Script Architecture

```
scripts/validate-content.js
```

The script should:
1. Read each data file as a string
2. Extract all values that look like `/images/...` paths and `src/content/...` paths using regex
3. For each path, check it exists using `fs.existsSync()`
4. Collect all failures into an array
5. After checking all files, if failures exist: print each one and `process.exit(1)`. If no failures: print a success summary and `process.exit(0)`

### Suggested Structure

```javascript
#!/usr/bin/env node
// scripts/validate-content.js
// Run with: node scripts/validate-content.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const issues = [];

function checkFile(filePath, context) {
  const abs = path.resolve(ROOT, filePath);
  if (!fs.existsSync(abs)) {
    issues.push(`[MISSING FILE] ${filePath}  (referenced in ${context})`);
  }
}

function checkHttps(url, context) {
  if (url && !url.startsWith('https://')) {
    issues.push(`[INVALID URL] "${url}" must use https://  (referenced in ${context})`);
  }
}

// --- Check each data file ---

// projects.ts
// Extract /images/ paths and validate
// ...

// blog.ts
// Extract contentPath and thumbnail values
// ...

// free-resources.ts
// Extract media.src and href values
// ...

// Report
if (issues.length > 0) {
  console.error(`\nContent validation failed — ${issues.length} issue(s) found:\n`);
  issues.forEach(issue => console.error(`  ${issue}`));
  console.error('');
  process.exit(1);
} else {
  console.log(`\nContent validation passed — all referenced files exist and URLs are valid.\n`);
  process.exit(0);
}
```

### Regex Patterns to Use

Extract image paths from TypeScript files:
```javascript
// Match: "/images/projects/iterra/hero.svg" or '/images/blog/ep02.jpg'
const imagePaths = content.match(/["'](\/images\/[^"']+)["']/g) || [];

// Match: contentPath values
const contentPaths = content.match(/contentPath:\s*["']([^"']+)["']/g) || [];

// Match: href values (for HTTPS check)
const hrefs = content.match(/href:\s*["'](https?:\/\/[^"']+)["']/g) || [];
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `scripts/validate-content.js` exists at the exact path
- [ ] Script is runnable with `node scripts/validate-content.js` from project root
- [ ] Script checks all `/images/` paths referenced in `src/data/projects.ts`
- [ ] Script checks all `/images/` paths and `contentPath` values in `src/data/blog.ts`
- [ ] Script checks `media.src` paths and `href` HTTPS in `src/data/free-resources.ts`
- [ ] Script exits 0 when all referenced files exist and all hrefs use HTTPS
- [ ] Script exits 1 and prints a specific list of issues when validation fails
- [ ] Running against a data file with a deliberately wrong path prints the broken path clearly
- [ ] Script handles the case where `src/data/playbooks.ts` has an empty array without crashing
- [ ] No new npm packages added (`package.json` must not be modified)

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/validate-content.js` | create | Content integrity validation script |

### File Ownership Notes

No existing files are modified. The `scripts/` directory does not currently exist — the script creates both the directory and the file. The script is read-only with respect to all source files.

---

## Implementation Guidance

### Reading TypeScript Files as Text

Since data files are TypeScript, use `fs.readFileSync` to read them as plain text, then apply regex. This avoids any transpilation requirement:

```javascript
const projectsContent = fs.readFileSync(
  path.resolve(ROOT, 'src/data/projects.ts'),
  'utf-8'
);
```

### Path Resolution

Image paths in data files look like `/images/projects/iterra/hero.svg`. They are served from the `public/` directory, so the actual file on disk is at `public/images/projects/iterra/hero.svg`:

```javascript
// Convert a data-file image path to a filesystem path
function resolveImagePath(imagePath) {
  // imagePath = "/images/projects/iterra/hero.svg"
  return path.resolve(ROOT, 'public' + imagePath);
}
```

MDX `contentPath` values look like `src/content/blog/ep02-creative-ai-framework.mdx` (relative to project root):

```javascript
function resolveContentPath(contentPath) {
  return path.resolve(ROOT, contentPath);
}
```

### Output Format

Make failures easy to scan:

```
Content validation failed — 3 issue(s) found:

  [MISSING FILE] public/images/projects/iterra/hero.svg  (referenced in src/data/projects.ts)
  [MISSING FILE] src/content/blog/ep02-creative-ai-framework.mdx  (referenced in src/data/blog.ts)
  [INVALID URL] "http://example.com/resource" must use https://  (referenced in src/data/free-resources.ts)
```

### Edge Cases

- If a data file doesn't exist yet (e.g. `src/data/free-resources.ts` wasn't created by T007), the script should print a warning but not crash — wrap `readFileSync` in try/catch and add a `[MISSING DATA FILE]` issue
- Regex matching can return null — always use `|| []` as fallback
- Duplicate paths in data files: only report each missing file once (use a Set to deduplicate issues by path before reporting)
- The `public/images/` directory may not exist if T001 hasn't run — this is a legitimate validation failure, not a script error

### Testing the Script

Run manually:
```bash
node scripts/validate-content.js
```

To test the failure path, temporarily change one path in a data file to a nonexistent path and verify the script exits 1 with the correct message. Then revert.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T005 | `src/data/projects.ts` populated with 5 projects including `images[]` and `thumbnail` paths | Check file exists and has 5 records |
| T006 | `src/data/blog.ts` updated with `contentPath` fields; 4 MDX files in `src/content/blog/` | Check that `contentPath` fields exist in blog.ts |
| T007 | `src/data/free-resources.ts` with 5 resources including `media.src` and `href` | Check file exists |

### Downstream Impact

Tasks that depend on this one: **T018** (template stripping script) — T018 depends on this script being runnable and passing before it strips content.

**Before starting:** Verify dependencies are complete by checking:
- `src/data/projects.ts` has enriched records (not just the 5 stub entries from the original codebase)
- `src/data/blog.ts` has `contentPath` fields (not just `content` string)
- `src/data/free-resources.ts` exists

---

## GitHub Context

**Issue:** T017
**Branch:** `worktree/framer-cms-migration-T017`
**Target:** `main` (or active feature branch if in use)

---

## Commit Guidelines

```
chore(scripts): add content validation script

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] `node scripts/validate-content.js` runs without crashing from project root
- [ ] Build passes: `npm run build` (script itself doesn't affect build, but verify no regressions)
- [ ] Lint passes: `npm run lint`
- [ ] `package.json` not modified
- [ ] `package-lock.json` not modified
- [ ] No source files in `src/` modified

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T017 | Wave: 4_
