import { readFileSync } from "fs";
import { join } from "path";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Terms & Conditions | Open Session",
  description: "Terms & Conditions for Open Session LLC.",
};

export default function TermsPage() {
  const mdxPath = join(process.cwd(), "src/content/legal/terms.mdx");
  const source = readFileSync(mdxPath, "utf8");

  return (
    <div className="text-fg-primary">
      <h1 className="text-display text-4xl md:text-5xl mb-8">
        Terms &amp; Conditions
      </h1>
      <div className="prose-legal">
        <MDXRemote source={source} />
      </div>
    </div>
  );
}
