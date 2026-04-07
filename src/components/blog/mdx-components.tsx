import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-display text-3xl md:text-4xl mb-6 mt-12 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-heading text-2xl md:text-3xl mb-4 mt-10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-heading text-xl mb-3 mt-8">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-fg-secondary text-base md:text-lg leading-relaxed mb-6">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-fg-secondary">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-fg-secondary">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-base md:text-lg leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-border-primary pl-6 my-8 text-fg-secondary italic">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-bg-secondary text-fg-primary px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-bg-secondary text-fg-primary p-6 overflow-x-auto mb-6 text-sm font-mono">
        {children}
      </pre>
    ),
    hr: () => <hr className="border-border-secondary my-12" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-fg-primary">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-fg-secondary">{children}</em>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-fg-primary underline underline-offset-4 hover:text-fg-brand transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  };
}
