#!/usr/bin/env node
// scripts/strip-for-template.js
//
// Transforms this portfolio repo into a clean, redistributable template by:
//   Phase 1: Removing proprietary MDX content files
//   Phase 2: Replacing data files with single-record stubs
//   Phase 3: Creating SVG placeholder images for all stub-referenced paths
//
// WARNING: This script removes real content. Run in a fork or template-release
//          branch — NEVER on the production repo.
//
// Run with: node scripts/strip-for-template.js
// After running: npm run build  (to verify the template builds cleanly)

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const actions = [];

// ─────────────────────────────────────────────────────────
// Placeholder SVG content
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Stub file contents
// ─────────────────────────────────────────────────────────
const PROJECTS_STUB = `// TEMPLATE: replace with your content
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
        headline: "One-line challenge statement.",
        body: "Describe the core challenge the client faced.",
      },
      {
        heading: "Our Solution",
        headline: "One-line solution statement.",
        body: "Describe how you approached and solved it.",
      },
      {
        heading: "The Impact",
        headline: "One-line impact statement.",
        body: "Describe the measurable outcomes.",
      },
    ],
    images: [
      { src: "/images/projects/your-project/hero.svg", alt: "Project hero", context: "hero" },
    ],
    results: ["Result one", "Result two"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
`;

const BLOG_STUB = `// TEMPLATE: replace with your content
import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "your-first-post",
    slug: "your-first-post",
    title: "Your First Blog Post",
    excerpt: "A brief excerpt summarizing what this post is about.",
    contentPath: "blog/your-first-post.mdx",
    author: {
      name: "Your Name",
    },
    date: "2025-01-01",
    category: "Design Strategy",
    thumbnail: "/images/blog/your-first-post.svg",
    readingTime: "5 min read",
    featured: true,
  },
];

export const featuredBlogPosts = blogPosts.filter((p) => p.featured);
`;

const FREE_RESOURCES_STUB = `// TEMPLATE: replace with your content
import { FreeResource } from "@/types/free-resources";

export const freeResources: FreeResource[] = [
  {
    id: "your-resource",
    title: "Your Free Resource",
    description: "A short description of what this resource provides.",
    badge: "live",
    media: {
      type: "image",
      src: "/images/resources/your-resource.svg",
    },
    href: "https://example.com/your-resource",
    buttonLabel: "Get for Free",
  },
];
`;

const TEAM_STUB = `// TEMPLATE: replace with your content
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const team: TeamMember[] = [
  {
    id: "team-member-1",
    name: "Your Name",
    role: "Founder",
    bio: "A brief biography of this team member.",
    image: "/images/about/team-member-1.svg",
    social: {
      linkedin: "https://linkedin.com",
    },
  },
];

export const showcase: TeamMember[] = [
  {
    id: "member-a",
    name: "Team Member A",
    role: "Co-Founder & CEO",
    bio: "Drives the strategic vision and business impact.",
    image: "/images/about/team-member-a.svg",
    social: {
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "member-b",
    name: "Team Member B",
    role: "Co-Founder & COO",
    bio: "Brings operational excellence and creative leadership.",
    image: "/images/about/team-member-b.svg",
    social: {
      linkedin: "https://linkedin.com",
    },
  },
];

export const storyImages: string[] = [
  "/images/about/story-1.svg",
  "/images/about/story-2.svg",
];
`;

// ─────────────────────────────────────────────────────────
// Phase 1: Remove MDX content files
// ─────────────────────────────────────────────────────────
function removeMdxFiles(dirRelative) {
  const abs = path.resolve(ROOT, dirRelative);
  if (!fs.existsSync(abs)) return;

  const entries = fs.readdirSync(abs, { withFileTypes: true });
  for (const entry of entries) {
    const entryRelative = path.join(dirRelative, entry.name);
    if (entry.isDirectory()) {
      removeMdxFiles(entryRelative);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      // Skip README files (they describe the directory purpose)
      if (entry.name === 'README.md') continue;
      const filePath = path.resolve(ROOT, entryRelative);
      fs.unlinkSync(filePath);
      actions.push(`Removed: ${entryRelative}`);
    }
  }
}

// ─────────────────────────────────────────────────────────
// Phase 2: Write data file stubs
// ─────────────────────────────────────────────────────────
function writeStub(relPath, content) {
  const abs = path.resolve(ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf-8');
  actions.push(`Replaced stub: ${relPath}`);
}

// ─────────────────────────────────────────────────────────
// Phase 3: Write placeholder images
// ─────────────────────────────────────────────────────────
function writePlaceholder(imagePath) {
  const abs = path.resolve(ROOT, 'public' + imagePath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (!fs.existsSync(abs)) {
    fs.writeFileSync(abs, PLACEHOLDER_SVG, 'utf-8');
    actions.push(`Created placeholder: ${imagePath}`);
  }
}

// ─────────────────────────────────────────────────────────
// Remove production image directories
// ─────────────────────────────────────────────────────────
function removeImageDir(dirRelative) {
  const abs = path.resolve(ROOT, dirRelative);
  if (!fs.existsSync(abs)) return;

  const entries = fs.readdirSync(abs, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(abs, entry.name);
    if (entry.isDirectory()) {
      removeImageDir(path.join(dirRelative, entry.name));
      // Remove empty directory after clearing contents
      try {
        fs.rmdirSync(entryPath);
        actions.push(`Removed dir: ${path.join(dirRelative, entry.name)}`);
      } catch (_) {
        // Directory not empty — leave it
      }
    } else {
      fs.unlinkSync(entryPath);
      actions.push(`Removed image: ${path.join(dirRelative, entry.name)}`);
    }
  }
}

// ─────────────────────────────────────────────────────────
// Run all phases
// ─────────────────────────────────────────────────────────

console.log('\nStripping portfolio for template release...\n');

// Phase 1: Remove MDX content
console.log('Phase 1: Removing MDX content files...');
removeMdxFiles('src/content');

// Phase 2: Write data stubs
console.log('Phase 2: Writing data file stubs...');
writeStub('src/data/projects.ts', PROJECTS_STUB);
writeStub('src/data/blog.ts', BLOG_STUB);
writeStub('src/data/free-resources.ts', FREE_RESOURCES_STUB);
writeStub('src/data/team.ts', TEAM_STUB);

// Phase 3: Remove production images and create placeholders
console.log('Phase 3: Replacing production images with placeholders...');
removeImageDir('public/images/projects');
removeImageDir('public/images/blog');
removeImageDir('public/images/about');
removeImageDir('public/images/resources');

// Create placeholder images for all paths referenced in stubs
writePlaceholder('/images/projects/your-project/hero.svg');
writePlaceholder('/images/blog/your-first-post.svg');
writePlaceholder('/images/resources/your-resource.svg');
writePlaceholder('/images/about/team-member-1.svg');
writePlaceholder('/images/about/team-member-a.svg');
writePlaceholder('/images/about/team-member-b.svg');
writePlaceholder('/images/about/story-1.svg');
writePlaceholder('/images/about/story-2.svg');

// ─────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────
console.log('\nTemplate stripping complete.\n');
console.log(`Actions taken (${actions.length} total):`);
actions.forEach(a => console.log(`  \u2713 ${a}`));
console.log('\nNext steps:');
console.log('  1. Run: npm run build  (verify template builds cleanly)');
console.log('  2. Run: node scripts/validate-content.js  (verify stubs are valid)');
console.log('  3. Update src/data/*.ts files with your own content');
console.log('  4. Add your own images to public/images/\n');
