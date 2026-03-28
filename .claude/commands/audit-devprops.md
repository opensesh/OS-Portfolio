# /audit-devprops — devProps Compliance Audit

Scan the codebase for `devProps` compliance and produce a structured report grouped by section, with a percentage summary and an explicit exemption list.

## Usage

```
/audit-devprops
```

**This command is read-only and never modifies files.**

## Behavior

Run the following steps in order. Use the Grep tool (not Bash) for all searches.

### Step 1: Find compliant files

Use Grep to find all `.tsx` files under `app/` and `components/` that call `devProps`:

- Pattern: `devProps\(`
- Paths: `app/`, `components/`
- File type: `tsx`
- Output mode: `files_with_matches`

Record this as your **compliant set**.

### Step 2: Find all potential component files

Use Grep to find all `.tsx` files under `app/` and `components/` that export a PascalCase component:

- Pattern: `export (default )?(function|const) [A-Z]`
- Paths: `app/`, `components/`
- File type: `tsx`
- Output mode: `files_with_matches`

Record this as your **component set**.

### Step 3: Identify non-compliant files

Compare the two sets. Files in the **component set** that are NOT in the **compliant set** are non-compliant. Exclude:

- Files in `lib/`, `hooks/`, `types/` — these are not components
- Known exemptions listed in Step 6 below

### Step 4: Group results by section

Organize all files (both compliant and non-compliant) into these sections based on their path:

| Section             | Path prefix                                            |
| ------------------- | ------------------------------------------------------ |
| `app/` pages        | `app/` files that are `page.tsx`                       |
| `app/` layouts      | `app/` files that are `layout.tsx` or `template.tsx`   |
| `app/` other        | other `app/` files                                     |
| `components/ui/`    | `components/ui/`                                       |
| `components/chat/`  | `components/chat/`                                     |
| `components/brain/` | `components/brain/`                                    |
| `components/` root  | `components/*.tsx` (root level, not in a subdirectory) |
| Other               | any remaining `components/` subdirectories             |

### Step 5: Calculate compliance percentage

- Total component files = count of files in the component set (excluding exemptions)
- Compliant count = count of files in the compliant set (excluding exemptions)
- Compliance percentage = (compliant / total) \* 100, rounded to one decimal place

### Step 6: Known exemptions

These files legitimately cannot use `devProps` because their root return is a fragment or they render only third-party scripts with no DOM element to attach the attribute to:

- `components/VercelAnalytics.tsx` — renders a fragment of third-party analytics scripts; no DOM root

Do not count these files as non-compliant. List them in the Exemptions section of the report.

### Step 7: Edge case handling

- **Thin server pages**: Some `app/` pages contain no JSX of their own and re-export a client component. If a file appears in the component set but has no `devProps` import, flag it with a note: `(verify manually — may be a thin server wrapper)`.
- **Files with multiple exports**: Some files export two or more components (e.g., `components/ui/active-settings-indicators.tsx`). Check whether each exported component has its own `devProps` call, not just whether the file contains any `devProps` call. If uncertain, flag the file as `(multiple exports — verify manually)`.
- **Non-component `.tsx` files**: Skip any files under `lib/`, `hooks/`, `types/`, or `utils/` — these are not components.

### Step 8: Produce the report

Output the following structure:

```
## devProps Audit Report

### Summary
Total component files: {n}
Compliant: {n} ({pct}%)
Missing: {n} ({pct}%)

### Compliant Files
(grouped by section — list each file path)

#### app/ pages
- app/.../page.tsx

#### app/ layouts
- app/.../layout.tsx

#### components/ui/
- components/ui/button.tsx
- ...

#### components/chat/
...

#### components/ root
...

### Missing devProps
(grouped by section — list each file path; add manual-verify note where applicable)

#### app/ pages
- app/.../page.tsx  (verify manually — may be thin server wrapper)

#### components/ui/
...

### Exemptions (intentional)
- components/VercelAnalytics.tsx — fragment root, no DOM element; intentionally exempt

### Notes
- Run `bun run lint` to see ESLint violations for precise enforcement (the `bos-local/require-dev-props` rule is set to `error` and will block CI).
- Files flagged "(verify manually)" are edge cases that may or may not require devProps — review the component source to confirm.
```

## Implementation Notes

- Use Grep (not Bash) for all file searches. Grep's `files_with_matches` output mode is the most efficient for this scan.
- The report is a snapshot in time. Re-run `/audit-devprops` after adding devProps to files to see updated compliance.
- This command works at any compliance level — it does not require 100% compliance to produce a useful report.
- Do not modify any files. This command is purely diagnostic.
