"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loading01 } from "@untitledui-pro/icons/line";
import { InputBase } from "@/components/uui/base/input/input";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "inline";
}

export function NewsletterForm({
  className,
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email");
      setStatus("error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email");
      setStatus("error");
      return;
    }

    setStatus("loading");

    // TODO: Implement actual newsletter signup
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex items-center justify-center w-10 h-10 bg-green-500/10">
          <Check className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-fg-primary">Thanks for subscribing!</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <InputBase
          type="email"
          value={email}
          onChange={(e) => {
            setEmail((e.target as HTMLInputElement).value);
            setStatus("idle");
          }}
          placeholder="Enter your email"
          isInvalid={status === "error"}
          inputClassName="pr-12"
          size="md"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "absolute right-1 top-1 bottom-1",
            "w-10 flex items-center justify-center",
            "bg-bg-brand-solid text-white",
            "hover:opacity-90 disabled:opacity-50",
            "transition-opacity duration-200"
          )}
        >
          {status === "loading" ? (
            <Loading01 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
        {status === "error" && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <InputBase
          type="email"
          value={email}
          onChange={(e) => {
            setEmail((e.target as HTMLInputElement).value);
            setStatus("idle");
          }}
          placeholder="your@email.com"
          isInvalid={status === "error"}
          size="md"
          aria-label="Email address"
        />
        {status === "error" && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "w-full h-12 flex items-center justify-center gap-2",
          "bg-bg-brand-solid text-white font-medium",
          "hover:opacity-90 disabled:opacity-50",
          "transition-opacity duration-200"
        )}
      >
        {status === "loading" ? (
          <>
            <Loading01 className="w-4 h-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            Subscribe
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
