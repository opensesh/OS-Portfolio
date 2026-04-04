"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loading01, Check } from "@untitledui-pro/icons/line";
import { Input } from "@/components/uui/base/input/input";
import { TextArea } from "@/components/uui/base/textarea/textarea";
import { devProps } from "@/utils/dev-props";

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
      <div {...devProps('ContactForm')} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 mb-6">
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
    <form {...devProps('ContactForm')} onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          isRequired
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Your name"
          size="md"
        />
        <Input
          label="Email"
          isRequired
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="your@email.com"
          size="md"
        />
      </div>

      {/* Company */}
      <Input
        label="Company"
        value={formData.company}
        onChange={(value) => setFormData({ ...formData, company: value })}
        placeholder="Your company"
        size="md"
      />

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-secondary mb-1.5">
          Budget Range
        </p>
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
      <TextArea
        label="Message"
        isRequired
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        placeholder="Tell us about your project..."
        rows={5}
        textAreaClassName="resize-none"
        size="md"
      />

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
            <Loading01 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
