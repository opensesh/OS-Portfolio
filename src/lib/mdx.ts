import { readFile } from "fs/promises";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

/**
 * Read a raw MDX file from src/content/.
 * @param contentPath - relative path from src/content/, e.g. "blog/my-post.mdx"
 */
export async function getMdxContent(contentPath: string): Promise<string> {
  const fullPath = path.join(CONTENT_ROOT, contentPath);
  const source = await readFile(fullPath, "utf8");
  return source;
}
