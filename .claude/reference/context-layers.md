# BOS Context Layers

The BOS Context System uses progressive disclosure to efficiently provide codebase understanding without overwhelming the context window.

## The L0/L1/L2 Model

### L0: Project Overview (~500 tokens)

**Location:** `.bos/context/index.md`

The L0 layer provides a high-level project summary loaded at session start. It answers:

- What is this project?
- What tech stack does it use?
- What are the key directories?
- What patterns should I follow?

**When to use:** Always available. Start here for orientation.

### L1: Section Overviews (~300-500 tokens each)

**Location:** `.bos/context/{section}/`

L1 summaries provide deeper context for specific areas:

| Section                      | Files | Purpose                            |
| ---------------------------- | ----- | ---------------------------------- |
| `architecture/index.md`      | 3     | App Router structure, routes, APIs |
| `architecture/app-router.md` | 1     | Next.js routing patterns           |
| `architecture/data-flow.md`  | 1     | State and data flow                |
| `components/index.md`        | 3     | Component library overview         |
| `components/ui.md`           | 1     | Design system primitives           |
| `components/chat.md`         | 1     | Chat interface components          |
| `lib/index.md`               | 3     | Core libraries                     |
| `lib/ai.md`                  | 1     | AI provider system                 |
| `lib/supabase.md`            | 1     | Database services                  |

**When to use:** Load relevant L1 files when working in that area.

### L2: Source Files (Full Detail)

**Location:** Original source files in `app/`, `components/`, `lib/`, etc.

L2 is the actual source code. L0/L1 provide pointers to help you find the right L2 files quickly.

**When to use:** When you need implementation details, read the actual source.

## Progressive Loading Pattern

```
Session Start
    ↓
Load L0 (index.md) - Always
    ↓
User asks about components
    ↓
Load L1 (components/index.md)
    ↓
Need specific component details
    ↓
Load L2 (components/ui/Button.tsx)
```

## Cache Management

### Manifest

The `manifest.json` tracks cache freshness:

```json
{
  "version": "1.0.0",
  "gitCommit": "abc123...",
  "generatedAt": "2026-03-12T...",
  "sections": {
    "app": { "files": 83, "lines": 19396, "lastModified": "..." },
    "components": { "files": 213, "lines": 55755, "lastModified": "..." },
    "lib": { "files": 119, "lines": 37506, "lastModified": "..." }
  }
}
```

### Staleness Detection

Compare `manifest.gitCommit` with current `HEAD`:

- Same commit: Cache is fresh
- Different commit: Consider regenerating

### Manual Refresh

Run `/bos-refresh` to regenerate:

```bash
bunx tsx .bos/scripts/generate-context.ts
```

## Integration with Claude Sessions

### Auto-Loading (Future)

In future phases, L0 will auto-load via hooks:

- `SessionStart` hook loads L0
- Query analysis loads relevant L1
- Vector search finds related L2 files

### Current (Manual)

For now, manually read context:

1. Start with `.bos/context/index.md`
2. Read relevant L1 sections
3. Navigate to L2 source files

## Design Principles

1. **Token Efficiency**: Each layer fits in ~500 tokens
2. **Progressive Disclosure**: Only load what's needed
3. **Freshness Tracking**: Know when cache is stale
4. **Human-Readable**: Markdown for easy inspection
5. **Machine-Friendly**: Structured for AI consumption

---

## Self-Evolving Memory System

The BOS Memory System extends context with learned knowledge that persists across sessions.

### Memory Categories

| Category      | Maps To      | Purpose                              |
| ------------- | ------------ | ------------------------------------ |
| `entities`    | Who/What     | People, services, APIs               |
| `patterns`    | How          | Proven solutions and best practices  |
| `preferences` | Why this way | User choices and conventions         |
| `events`      | When         | Milestones and significant changes   |
| `cases`       | Problems     | Bug fixes, edge cases, anti-patterns |
| `profile`     | Meta         | Learnings about user/project         |

### Memory Sources

| Source    | Trigger                    | Description                     |
| --------- | -------------------------- | ------------------------------- |
| `session` | SessionEnd hook            | Extracted from chat transcripts |
| `commit`  | Post-commit hook           | Extracted from git commits      |
| `manual`  | `/bos-learn` command       | User-added memories             |
| `karimo`  | `/bos-sync-karimo` command | Synced from KARIMO learnings    |

### Deduplication

New memories are checked against existing ones using embedding similarity:

- **Threshold:** 0.85 (85% similar)
- **Action:** Skip if duplicate detected

### KARIMO Integration

KARIMO artifacts are synced to the context system:

| KARIMO Source        | BOS Destination      | Layer |
| -------------------- | -------------------- | ----- |
| `learnings/patterns` | `memory/patterns`    | -     |
| `learnings/anti-*`   | `memory/cases`       | -     |
| `prds/*/PRD_*.md`    | `context_embeddings` | L1    |
| `prds/*/findings.md` | `context_embeddings` | L1    |

---

## Semantic Search

### Unified Search

Search across all sources with the unified search API:

```bash
# Search everything
bunx tsx .bos/lib/search-context.ts "query" --unified

# Search memories only
bunx tsx .bos/lib/search-context.ts "query" --memory

# Context only (original)
bunx tsx .bos/lib/search-context.ts "query"
```

### Programmatic Usage

```typescript
import { unifiedSearch, searchContext, searchMemories } from '.bos/lib/search-context';

// Unified search
const results = await unifiedSearch('brand colors', {
  topK: 10,
  threshold: 0.5,
  sources: ['context', 'memory', 'karimo'],
});

// Context only
const context = await searchContext('routing patterns');

// Memory only
const memories = await searchMemories('CSS variables');
```

---

## Database Schema

**Database:** `.bos/context.db`

### Tables

- `context_embeddings` - L0/L1/L2 context with embeddings
- `context_vec` - Vector index for context (sqlite-vec)
- `memories` - Self-evolving memory entries
- `memory_vec` - Vector index for memories
- `metadata` - Database metadata

### Embedding Model

- **Model:** `gemini-embedding-001`
- **Dimensions:** 3072
- **Provider:** Google Generative AI

---

## CLI Tools

```bash
# Database
bunx tsx .bos/scripts/init-db.ts

# Context
bunx tsx .bos/scripts/generate-context.ts
bunx tsx .bos/scripts/embed-context.ts

# Memory
bunx tsx .bos/lib/memory-manager.ts stats
bunx tsx .bos/lib/memory-manager.ts add <cat> "title" "content"

# KARIMO
bunx tsx .bos/scripts/sync-karimo.ts
bunx tsx .bos/scripts/migrate-learnings.ts
```

---

## Related

- `/bos-refresh` - Regenerate context cache
- `/bos-search` - Semantic search over context
- `/bos-learn` - Add manual memories
- `/bos-sync-karimo` - Sync KARIMO artifacts
- `.bos/scripts/generate-context.ts` - Generator script
