# Claude Code Configuration

Welcome to the BOS Claude configuration. Start here.

## Quick Links

| Task               | Go To                        |
| ------------------ | ---------------------------- |
| Building a feature | `plugins/feature-dev/`       |
| Reviewing code     | `plugins/pr-review-toolkit/` |
| Creating a plugin  | `plugins/plugin-dev/`        |
| Design system      | `reference/design-system.md` |
| Brand questions    | `brand/identity/`            |
| Writing content    | `brand/writing/`             |
| Specialized agents | `agency-packs/`              |

## Structure

```
.claude/
├── CLAUDE.md              # Main project instructions
├── agents/                # Autonomous workflows
├── agency-packs/          # Third-party specialized agents
├── commands/              # Slash commands (/restart, etc.)
├── plugins/               # Full-featured packages
├── skills/                # Auto-activating knowledge
├── brand/                 # Brand content (identity, writing)
├── data/                  # Reference data
├── reference/             # Design system, MCP setup
└── system/                # Auto-generated docs
```

## Key Rules

1. **CSS Syntax**: Use Style 2 mapped classes
   - `bg-bg-primary` (correct)
   - `bg-[var(--bg-primary)]` (wrong)

2. **Opacity**: Never use `/30` on bracket notation
   - `bg-bg-secondary/30` (correct)
   - `bg-[var(--bg-secondary)]/30` (broken - silently fails)

3. **Icons**: Never use `Sparkles` icon (hard ban)

4. **Borders**: Use `border-border-secondary` for containers

5. **Accessibility**: All interactive elements use React Aria

## Agency Packs

Third-party specialized agents adapted from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents).

| Pack | Command | Purpose |
|------|---------|---------|
| `a11y` | `/use-pack a11y` | WCAG 2.2 AA compliance, React Aria validation |
| `perf` | `/use-pack perf` | Core Web Vitals, Lighthouse, bundle analysis |
| `security` | `/use-pack security` | Threat modeling, OWASP Top 10, secure code review |
| `database` | `/use-pack database` | Supabase/PostgreSQL optimization, N+1 detection |
| `ux` | `/use-pack ux` | User research, usability testing, personas |

All packs include BOS-specific customizations (design system, MCP tools, workflow integration).

See `agency-packs/README.md` for full documentation.

## Instruction Precedence

When instructions conflict, follow this priority:

1. Agent-specific file (e.g., `karimo-implementer.md`)
2. `KARIMO_RULES.md` (for KARIMO agents)
3. Project `CLAUDE.md`
4. Global `~/.claude/CLAUDE.md`
5. Skills (latest activated wins)

## Validation

Run these before completing work:

```bash
# Config lint (catches .claude/ issues)
./scripts/lint-claude-config.sh

# Type check
bun run typecheck

# Tests
bun test

# Build
bun run build
```

## Agent Permission Guidance

Different agents have different permission needs:

| Agent Type         | Recommended Permissions              | Notes                      |
| ------------------ | ------------------------------------ | -------------------------- |
| **PM/Orchestrator** | Read, Write, Edit, Bash, Grep, Glob  | Coordinates but NEVER writes code |
| **Implementer**    | Read, Write, Edit, Bash, Grep, Glob  | Full access for code changes |
| **Tester**         | Read, Write, Edit, Bash, Grep, Glob  | Writes test files          |
| **Reviewer**       | Read, Grep, Glob                     | Read-only analysis         |

Note: Claude Code currently uses shared permissions. This guidance is for manual reference when reviewing agent behavior.

## Skills Behavior

Skills auto-activate based on keywords and **supplement** the instruction hierarchy—they don't override it.

When multiple skills activate:
- All activated skills provide context
- Conflicting advice should defer to CLAUDE.md
- The Instruction Precedence (in CLAUDE.md) always wins

## Full Documentation

See `CLAUDE.md` for complete project configuration.
