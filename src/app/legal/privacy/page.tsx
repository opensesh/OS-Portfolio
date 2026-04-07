import { readFileSync } from "fs";
import { join } from "path";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Privacy Policy | Open Session",
  description: "Privacy Policy for Open Session LLC.",
};

export default function PrivacyPage() {
  const mdxPath = join(process.cwd(), "src/content/legal/privacy.mdx");
  const source = readFileSync(mdxPath, "utf8");

  return (
    <div className="text-fg-primary">
      <h1 className="text-display text-4xl md:text-5xl mb-8">
        Privacy Policy
      </h1>
      <div className="prose-legal">
        <MDXRemote source={source} />
      </div>
    </div>
  );
}
