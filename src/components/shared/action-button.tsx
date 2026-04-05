"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActionButtonVariant = "brand" | "dark" | "light";
type ActionButtonSize = "md" | "lg";

interface ActionButtonBaseProps {
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

interface ActionButtonAsButton
  extends ActionButtonBaseProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      keyof ActionButtonBaseProps
    > {
  href?: never;
  external?: never;
}

interface ActionButtonAsLink
  extends ActionButtonBaseProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof ActionButtonBaseProps
    > {
  href: string;
  external?: boolean;
}

type ActionButtonProps = ActionButtonAsButton | ActionButtonAsLink;

const variantStyles: Record<
  ActionButtonVariant,
  { box: string; text: string; glisten: boolean }
> = {
  brand: {
    box: "bg-bg-brand-solid text-fg-on-brand",
    text: "bg-bg-brand-solid",
    glisten: true,
  },
  dark: {
    box: "bg-bg-inverse text-fg-inverse",
    text: "bg-bg-inverse text-fg-inverse",
    glisten: false,
  },
  light: {
    box: "bg-white text-bg-inverse",
    text: "bg-white text-bg-inverse",
    glisten: false,
  },
};

const sizeConfig = {
  md: {
    icon: "size-8",
    height: "h-8",
    padding: "px-4",
    offset: "-translate-x-[calc(32px+6px)]",
    iconSvg: "size-3",
    text: "text-xs",
  },
  lg: {
    icon: "size-10",
    height: "h-10",
    padding: "px-6",
    offset: "-translate-x-[calc(40px+6px)]",
    iconSvg: "size-3.5",
    text: "text-sm",
  },
};

const transition =
  "transition-transform duration-700 [transition-timing-function:var(--ease-power4-in-out)] motion-reduce:transition-none";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1v10M1 6h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export const ActionButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ActionButtonProps
>(function ActionButton(props, ref) {
  const {
    variant = "brand",
    size = "md",
    icon,
    className,
    children,
    ...rest
  } = props;

  const colors = variantStyles[variant];
  const sizing = sizeConfig[size];

  const iconContent = icon ?? <PlusIcon className={sizing.iconSvg} />;

  const wrapperStyles = cn(
    "group inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center",
    "whitespace-nowrap font-body font-medium uppercase tracking-normal",
    "outline-none rounded-[6px] overflow-hidden",
    "focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    sizing.text,
    className
  );

  const inner = (
    <span className="relative flex w-full items-center gap-1.5">
      {/* Left icon — hidden by default, spins in on hover */}
      <span
        className={cn(
          "flex items-center justify-center",
          transition,
          sizing.icon,
          "origin-left -rotate-45 scale-0",
          "group-hover:rotate-0 group-hover:scale-100",
          "rounded-none",
          colors.box
        )}
      >
        {iconContent}
      </span>

      {/* Text — shifted left to compensate for hidden icon, slides right on hover */}
      <span
        className={cn(
          "flex w-full flex-1 items-center justify-center",
          transition,
          sizing.height,
          sizing.padding,
          sizing.offset,
          "group-hover:translate-x-0",
          colors.text
        )}
      >
        <span className={colors.glisten ? "action-button-glisten" : undefined}>
          {children}
        </span>
      </span>

      {/* Right icon — visible by default, spins out on hover */}
      <span
        className={cn(
          "flex items-center justify-center",
          transition,
          sizing.icon,
          "absolute right-0 z-10",
          "origin-right rotate-0 scale-100",
          "group-hover:-rotate-45 group-hover:scale-0",
          "rounded-none",
          colors.box
        )}
      >
        {iconContent}
      </span>
    </span>
  );

  if ("href" in rest && rest.href) {
    const { href, external, ...linkRest } = rest as ActionButtonAsLink;

    if (external) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={wrapperStyles}
          target="_blank"
          rel="noopener noreferrer"
          {...linkRest}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={wrapperStyles}
        {...linkRest}
      >
        {inner}
      </Link>
    );
  }

  const buttonRest = rest as ActionButtonAsButton;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={wrapperStyles}
      {...buttonRest}
    >
      {inner}
    </button>
  );
});
