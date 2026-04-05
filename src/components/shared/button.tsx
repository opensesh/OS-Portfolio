"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
  external?: never;
}

interface ButtonAsLink
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "relative overflow-hidden",
    "bg-bg-brand-solid text-white",
    // Sliding background effect
    "before:absolute before:inset-0 before:bg-bg-inverse",
    "before:origin-left before:scale-x-0",
    "before:transition-transform before:duration-300 before:ease-out",
    "hover:before:scale-x-100",
    "hover:scale-[1.02]",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  secondary: cn(
    "relative overflow-hidden",
    "bg-transparent text-fg-primary",
    "border border-border-primary",
    // Sliding background effect
    "before:absolute before:inset-0 before:bg-bg-brand-solid",
    "before:origin-left before:scale-x-0",
    "before:transition-transform before:duration-300 before:ease-out",
    "hover:before:scale-x-100",
    "hover:text-white hover:border-bg-brand-solid",
    "hover:scale-[1.02]",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  ghost: cn(
    "relative overflow-hidden",
    "bg-transparent text-fg-primary",
    // Subtle background on hover
    "before:absolute before:inset-0 before:bg-bg-secondary",
    "before:origin-left before:scale-x-0",
    "before:transition-transform before:duration-300 before:ease-out",
    "hover:before:scale-x-100",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  link: cn(
    "relative",
    "bg-transparent text-fg-brand",
    // Underline slides in from left
    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px",
    "after:bg-fg-brand after:origin-left after:scale-x-0",
    "after:transition-transform after:duration-300 after:ease-out",
    "hover:after:scale-x-100",
    "p-0 h-auto"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2",
    "font-body font-medium tracking-normal",
    "rounded-[--radius-cta]",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    variant !== "link" && sizeStyles[size],
    className
  );

  // Wrapper for content to appear above sliding background
  const contentWrapper = (
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  );

  // Type guard for link props
  if ("href" in rest && rest.href) {
    const { href, external, ...linkRest } = rest as ButtonAsLink;

    if (external) {
      return (
        <a
          {...devProps('Button')}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseStyles}
          target="_blank"
          rel="noopener noreferrer"
          {...linkRest}
        >
          {contentWrapper}
        </a>
      );
    }

    return (
      <Link
        {...devProps('Button')}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseStyles}
        {...linkRest}
      >
        {contentWrapper}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;

  return (
    <button
      {...devProps('Button')}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseStyles}
      {...buttonRest}
    >
      {contentWrapper}
    </button>
  );
});
