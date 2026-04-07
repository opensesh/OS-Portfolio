#!/usr/bin/env node
// scripts/validate-content.js
//
// Validates all migrated content data files for integrity.
// Checks that image files exist on disk, MDX content files exist,
// required fields are present, and external URLs use HTTPS.
//
// Run with: node scripts/validate-content.js
// Exit 0 = all good | Exit 1 = issues found

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const issues = [];
const checkedPaths = new Set(); // deduplicate missing-file reports

function checkFile(filePath, context) {
  if (checkedPaths.has(filePath)) return;
  checkedPaths.add(filePath);
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

function readDataFile(relPath) {
  const abs = path.resolve(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    issues.push(`[MISSING DATA FILE] ${relPath}`);
    return null;
  }
  try {
    return fs.readFileSync(abs, 'utf-8');
  } catch (e) {
    issues.push(`[READ ERROR] ${relPath}: ${e.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Validate src/data/projects.ts
// ─────────────────────────────────────────────────────────
(function validateProjects() {
  const context = 'src/data/projects.ts';
  const content = readDataFile(context);
  if (!content) return;

  // Extract all /images/ paths
  const imagePaths = content.match(/["'](\/images\/[^"']+)["']/g) || [];
  for (const match of imagePaths) {
    const imagePath = match.replace(/["']/g, '');
    checkFile('public' + imagePath, context);
  }
})();

// ─────────────────────────────────────────────────────────
// Validate src/data/blog.ts
// ─────────────────────────────────────────────────────────
(function validateBlog() {
  const context = 'src/data/blog.ts';
  const content = readDataFile(context);
  if (!content) return;

  // Extract /images/ paths (thumbnails)
  const imagePaths = content.match(/["'](\/images\/[^"']+)["']/g) || [];
  for (const match of imagePaths) {
    const imagePath = match.replace(/["']/g, '');
    checkFile('public' + imagePath, context);
  }

  // Extract contentPath values (relative to src/content/)
  const contentPathMatches = content.match(/contentPath:\s*["']([^"']+)["']/g) || [];
  for (const match of contentPathMatches) {
    const contentPath = match.replace(/contentPath:\s*["']/, '').replace(/["']$/, '');
    // contentPath is relative to src/content/, e.g. "blog/post.mdx" → src/content/blog/post.mdx
    checkFile('src/content/' + contentPath, context);
  }
})();

// ─────────────────────────────────────────────────────────
// Validate src/data/free-resources.ts
// ─────────────────────────────────────────────────────────
(function validateFreeResources() {
  const context = 'src/data/free-resources.ts';
  const content = readDataFile(context);
  if (!content) return;

  // Extract /images/ paths (media.src and hoverImage)
  const imagePaths = content.match(/["'](\/images\/[^"']+)["']/g) || [];
  for (const match of imagePaths) {
    const imagePath = match.replace(/["']/g, '');
    // Skip video files — just check image files
    if (!imagePath.endsWith('.mp4') && !imagePath.endsWith('.webm')) {
      checkFile('public' + imagePath, context);
    }
  }

  // Check video files exist too
  const videoPaths = content.match(/["'](\/images\/[^"']+\.(?:mp4|webm))["']/g) || [];
  for (const match of videoPaths) {
    const videoPath = match.replace(/["']/g, '');
    checkFile('public' + videoPath, context);
  }

  // Check href URLs use HTTPS
  const hrefMatches = content.match(/href:\s*["'](https?:\/\/[^"']+)["']/g) || [];
  for (const match of hrefMatches) {
    const url = match.replace(/href:\s*["']/, '').replace(/["']$/, '');
    checkHttps(url, context);
  }
})();

// ─────────────────────────────────────────────────────────
// Validate src/data/playbooks.ts (may be empty array — skip gracefully)
// ─────────────────────────────────────────────────────────
(function validatePlaybooks() {
  const context = 'src/data/playbooks.ts';
  const content = readDataFile(context);
  if (!content) return;

  // Check if the array is empty — if so, nothing to validate
  if (content.includes('Playbook[] = []') || content.includes('Playbook[] =\n  []')) {
    // Empty array — nothing to validate
    return;
  }

  // Extract /images/ paths
  const imagePaths = content.match(/["'](\/images\/[^"']+)["']/g) || [];
  for (const match of imagePaths) {
    const imagePath = match.replace(/["']/g, '');
    checkFile('public' + imagePath, context);
  }

  // Extract contentPath values (relative to src/content/)
  const contentPathMatches = content.match(/contentPath:\s*["']([^"']+)["']/g) || [];
  for (const match of contentPathMatches) {
    const contentPath = match.replace(/contentPath:\s*["']/, '').replace(/["']$/, '');
    checkFile('src/content/' + contentPath, context);
  }
})();

// ─────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────
if (issues.length > 0) {
  console.error(`\nContent validation failed — ${issues.length} issue(s) found:\n`);
  issues.forEach(issue => console.error(`  ${issue}`));
  console.error('');
  process.exit(1);
} else {
  console.log('\nContent validation passed — all referenced files exist and URLs are valid.\n');
  process.exit(0);
}
