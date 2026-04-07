import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors mb-8 text-sm"
        >
          &larr; Back to Home
        </Link>
        <article className="space-y-6">
          {children}
        </article>
      </div>
    </div>
  );
}
