"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";

const budgetOptions = [
  { value: "5k-10k", label: "$5K - $10K" },
  { value: "10k-25k", label: "$10K - $25K" },
  { value: "25k-50k", label: "$25K - $50K" },
  { value: "50k+", label: "$50K+" },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Please fill in all required fields");
      setStatus("error");
      return;
    }

    setStatus("loading");

    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-heading text-2xl mb-2">Message Sent!</h3>
        <p className="text-fg-secondary">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-fg-primary mb-2"
          >
            Name <span className="text-fg-brand">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className={cn(
              "w-full h-12 px-4",
              "bg-bg-primary border border-border-primary",
              "text-fg-primary placeholder:text-fg-tertiary",
              "focus:outline-none focus:border-brand-500",
              "transition-colors duration-200"
            )}
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-fg-primary mb-2"
          >
            Email <span className="text-fg-brand">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={cn(
              "w-full h-12 px-4",
              "bg-bg-primary border border-border-primary",
              "text-fg-primary placeholder:text-fg-tertiary",
              "focus:outline-none focus:border-brand-500",
              "transition-colors duration-200"
            )}
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-fg-primary mb-2"
        >
          Company
        </label>
        <input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className={cn(
            "w-full h-12 px-4",
            "bg-bg-primary border border-border-primary",
            "text-fg-primary placeholder:text-fg-tertiary",
            "focus:outline-none focus:border-brand-500",
            "transition-colors duration-200"
          )}
          placeholder="Your company"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-fg-primary mb-2">
          Budget Range
        </label>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFormData({ ...formData, budget: option.value })
              }
              className={cn(
                "px-4 py-2 text-sm border transition-all duration-200",
                formData.budget === option.value
                  ? "bg-bg-inverse text-fg-inverse border-bg-inverse"
                  : "bg-transparent text-fg-secondary border-border-primary hover:border-border-brand"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-fg-primary mb-2"
        >
          Message <span className="text-fg-brand">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={5}
          className={cn(
            "w-full px-4 py-3",
            "bg-bg-primary border border-border-primary",
            "text-fg-primary placeholder:text-fg-tertiary",
            "focus:outline-none focus:border-brand-500",
            "transition-colors duration-200",
            "resize-none"
          )}
          placeholder="Tell us about your project..."
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "w-full h-14 flex items-center justify-center gap-2",
          "bg-bg-brand-solid text-white font-medium",
          "rounded-[--radius-cta]",
          "hover:opacity-90 disabled:opacity-50",
          "transition-opacity duration-200"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
