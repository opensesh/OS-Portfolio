"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    "bg-bg-brand-solid text-white",
    "hover:opacity-90",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  secondary: cn(
    "bg-transparent text-fg-primary",
    "border border-border-primary",
    "hover:bg-bg-secondary",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  ghost: cn(
    "bg-transparent text-fg-primary",
    "hover:bg-bg-secondary",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  ),
  link: cn(
    "bg-transparent text-fg-brand",
    "underline-offset-4 hover:underline",
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
    "font-medium",
    "rounded-[--radius-cta]",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    variant !== "link" && sizeStyles[size],
    className
  );

  // Type guard for link props
  if ("href" in rest && rest.href) {
    const { href, external, ...linkRest } = rest as ButtonAsLink;

    if (external) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseStyles}
          target="_blank"
          rel="noopener noreferrer"
          {...linkRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseStyles}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseStyles}
      {...buttonRest}
    >
      {children}
    </button>
  );
});
