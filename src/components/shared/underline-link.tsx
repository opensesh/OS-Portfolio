"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UnderlineLinkBaseProps {
  className?: string;
  children: React.ReactNode;
}

interface UnderlineLinkAsAnchor
  extends UnderlineLinkBaseProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof UnderlineLinkBaseProps
    > {
  href: string;
  external?: boolean;
}

type UnderlineLinkProps = UnderlineLinkAsAnchor;

const underlineEasing =
  "[transition-timing-function:cubic-bezier(0.625,0.05,0,1)]";

export const UnderlineLink = forwardRef<HTMLAnchorElement, UnderlineLinkProps>(
  function UnderlineLink({ href, external, className, children, ...rest }, ref) {
    const styles = cn(
      "group relative inline-flex items-center cursor-pointer",
      "outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
      className
    );

    const underline = (
      <span
        className="pointer-events-none absolute inset-x-0 -bottom-1"
        aria-hidden="true"
      >
        {/* Line 1: visible by default, slides out right on hover */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-current",
            "origin-left scale-x-100 transition-transform duration-700 delay-300",
            underlineEasing,
            "group-hover:origin-right group-hover:scale-x-0 group-hover:delay-0",
            "group-focus-visible:origin-right group-focus-visible:scale-x-0 group-focus-visible:delay-0"
          )}
        />
        {/* Line 2: hidden by default, slides in from left on hover */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-current",
            "origin-right scale-x-0 transition-transform duration-700 delay-0",
            underlineEasing,
            "group-hover:origin-left group-hover:scale-x-100 group-hover:delay-300",
            "group-focus-visible:origin-left group-focus-visible:scale-x-100 group-focus-visible:delay-300"
          )}
        />
      </span>
    );

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          className={styles}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
          {underline}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={styles} {...rest}>
        {children}
        {underline}
      </Link>
    );
  }
);
