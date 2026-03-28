# MCP Server Setup Guide

This project uses **Model Context Protocol (MCP)** servers to extend Claude's capabilities. MCP servers provide Claude with direct access to external tools and services like databases, deployment platforms, and design tools.

---

## Required MCP Servers

| Server       | Purpose                                         | Auth Method           |
| ------------ | ----------------------------------------------- | --------------------- |
| **Supabase** | Database operations, migrations, edge functions | OAuth                 |
| **Vercel**   | Deployments, logs, project management           | OAuth                 |
| **Figma**    | Design context, screenshots, code generation    | OAuth                 |
| **Notion**   | Documentation, pages, databases                 | OAuth                 |
| **GitHub**   | Repository, issues, PRs, code search            | Personal Access Token |
| **Firecrawl**| Web scraping, search, crawling, browser sandbox  | API Key (env var)     |

All servers are configured at **user scope** (`--scope user`) for global availability across projects.

---

## Quick Check: Verify MCP Status

Run this command to check all MCP servers are connected:

```bash
claude mcp list
```

Expected output (all should show ✓ Connected):

```
supabase: https://mcp.supabase.com/mcp (HTTP) - ✓ Connected
vercel: https://mcp.vercel.com (HTTP) - ✓ Connected
figma: https://mcp.figma.com/mcp (HTTP) - ✓ Connected
notion: https://mcp.notion.com/mcp (HTTP) - ✓ Connected
github: https://api.githubcopilot.com/mcp (HTTP) - ✓ Connected
```

---

## Quick Setup (5 minutes)

### Prerequisites

- [Claude Code CLI](https://claude.com/claude-code) installed
- GitHub account (for GitHub MCP)

### Step 1: Create GitHub Personal Access Token

GitHub MCP requires a Personal Access Token (PAT):

1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "Claude Code MCP")
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org membership)
   - `read:user` (Read user profile data)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again)

### Step 2: Add Token to Shell Profile

Add your GitHub PAT to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# GitHub MCP Authentication
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"
```

Then reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Step 3: Configure MCP Servers

Run these commands to add all 5 MCP servers globally:

```bash
# Add OAuth-based servers (automatic authentication)
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp" --scope user
claude mcp add --transport http vercel "https://mcp.vercel.com" --scope user
claude mcp add --transport http figma "https://mcp.figma.com/mcp" --scope user
claude mcp add --transport http notion "https://mcp.notion.com/mcp" --scope user

# Add GitHub with PAT authentication
claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"}}' --scope user
```

### Step 4: Verify Setup

```bash
claude mcp list
```

You should see all 5 servers with "✓ Connected" status:

```
supabase: ... (HTTP) - ✓ Connected
vercel: ... (HTTP) - ✓ Connected
figma: ... (HTTP) - ✓ Connected
notion: ... (HTTP) - ✓ Connected
github: ... (HTTP) - ✓ Connected
```

---

## OAuth Authentication

Supabase, Vercel, Figma, and Notion use OAuth for authentication. On first use:

1. Claude Code opens your browser automatically
2. Log in to the service (if not already)
3. Authorize Claude Code to access your account
4. You're done - tokens refresh automatically

**No manual token management required** for OAuth servers.

---

## Troubleshooting

### GitHub MCP shows "Failed to connect"

1. **Check environment variable is set:**

   ```bash
   echo $GITHUB_PERSONAL_ACCESS_TOKEN
   ```

   Should print your token.

2. **Restart terminal** after adding to shell profile:

   ```bash
   source ~/.zshrc
   ```

3. **Verify token has correct scopes:**
   Go to [GitHub Tokens](https://github.com/settings/tokens) and check the token has `repo`, `read:org`, `read:user`.

4. **Re-add the MCP server:**
   ```bash
   claude mcp remove github -s user
   claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"}}' --scope user
   ```

### OAuth server shows "Failed to connect"

1. **Check network connectivity** to the service
2. **Re-authenticate** by running Claude Code and using the MCP - it will prompt for OAuth
3. **Check if service is down** (Supabase status, Vercel status, etc.)

### "Server not found" error

Make sure you added servers with `--scope user` flag for global availability:

```bash
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp" --scope user
```

---

## MCP Server Capabilities

### Supabase MCP

- Execute SQL queries
- List and manage tables
- Apply migrations
- Deploy edge functions
- View logs

### Vercel MCP

- List deployments
- View build logs
- Manage projects
- Check deployment status

### Figma MCP

- Get design screenshots
- Extract design context
- Generate code from designs
- Access design metadata

### Notion MCP

- Search pages and databases
- Read page content
- Create and update pages
- Query database entries

### GitHub MCP

- Create/read/update files
- Manage issues and PRs
- Search code and commits
- Create branches

### Firecrawl MCP

**12 tools** for web scraping, search, and browser automation.

Core Tools:
- **Scrape** — Extract markdown, JSON, screenshots, branding, or PDF content from any URL
- **Search** — Search the web with operators (`site:`, `intitle:`, `""`, `-`) and optional inline scraping
- **Extract** — LLM-powered structured data extraction from multiple URLs with JSON schema
- **Map** — Fast URL discovery on a site; use `search` param to find specific pages

Async Tools:
- **Crawl** — Crawl entire site sections (async, poll with `check_crawl_status`)
- **Agent** — Autonomous research agent for complex multi-source queries (async, poll with `agent_status`)

Browser Automation:
- **Browser Create/Execute/List/Delete** — CDP-based browser sessions for JS-heavy or login-gated sites

Special Formats:
- PDF parsing (`parsers: ["pdf"]`), screenshots (`formats: ["screenshot"]`), brand extraction (`formats: ["branding"]`)

> **Full usage guide:** See `.claude/skills/firecrawl-web-tools.md` for decision tree, examples, and best practices.

**Setup:** Requires `FIRECRAWL_API_KEY` environment variable. Add to `~/.zshrc`:

```bash
export FIRECRAWL_API_KEY="your-api-key-here"
```

Configured in `.mcp.json` as a stdio server (runs via `npx -y firecrawl-mcp`).

---

## Updating MCP Servers

To update an MCP server configuration:

```bash
# Remove existing
claude mcp remove <server-name> -s user

# Re-add with new config
claude mcp add --transport http <server-name> "<url>" --scope user
```

---

## Removing MCP Servers

```bash
claude mcp remove <server-name> -s user
```

---

## BOS MCP Server (Outbound)

BOS also exposes its own MCP server for external AI clients to access brand knowledge.

### Available Tools

| Tool                     | Purpose                           | When to Use                                  |
| ------------------------ | --------------------------------- | -------------------------------------------- |
| `search_brand_knowledge` | Semantic search across brand docs | Questions about voice, messaging, philosophy |
| `get_brand_colors`       | Retrieve color palette            | "What colors should I use?"                  |
| `get_brand_assets`       | List logos, fonts, images         | "Show me our logos"                          |
| `get_brand_guidelines`   | Fetch guideline documents         | Deep dive into specific guidelines           |
| `search_brand_assets`    | Semantic asset search             | "Find photos with warm tones"                |

### MCP Server Endpoint

```
URL: https://bos-3-0.vercel.app/api/mcp
Transport: streamable-http
Auth: Bearer token (API key from BOS settings)
```

### Voice Guidance for AI Assistants

When using BOS MCP, act as a **brand steward**, not an outside advisor:

- Use "we" and "our" naturally
- Integrate brand knowledge seamlessly without clinical prefixes
- Be helpful and informative while embodying brand voice

---

## Need Help?

- [Claude Code Documentation](https://claude.com/claude-code)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
