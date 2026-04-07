# Blog Content

Each blog post is an MDX file named `{slug}.mdx`.

## File Format

```mdx
# Post Title

Body content in Markdown/MDX format.

## Section Heading

Paragraph text...
```

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
