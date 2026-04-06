"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "@untitledui-pro/icons/line";
import { ActionButton } from "@/components/shared/action-button";
import { devProps } from "@/utils/dev-props";

const interestOptions = [
  { value: "collaboration", label: "Collaboration" },
  { value: "partnership", label: "Partnership" },
  { value: "networking", label: "Networking" },
  { value: "other", label: "Other" },
];

const fieldStyles = cn(
  "w-full bg-transparent border-0 border-b border-border-secondary",
  "py-3 text-md text-fg-primary placeholder:text-fg-quaternary",
  "focus:outline-none focus:border-b-2 focus:border-fg-brand",
  "transition-colors duration-200",
  "font-[family-name:var(--font-body)]"
);

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-transparent border-0 border-b border-border-secondary",
          "py-3 text-md text-left font-[family-name:var(--font-body)]",
          "focus:outline-none focus:border-b-2 focus:border-fg-brand",
          "transition-colors duration-200 cursor-pointer",
          "flex items-center justify-between",
          value ? "text-fg-primary" : "text-fg-quaternary"
        )}
      >
        <span>{selectedLabel || placeholder}</span>
        <svg
          className={cn(
            "size-4 text-fg-tertiary transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 py-1 bg-bg-secondary border border-border-secondary shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm font-[family-name:var(--font-body)]",
                "hover:bg-bg-tertiary transition-colors duration-100",
                option.value === value
                  ? "text-fg-brand font-medium"
                  : "text-fg-primary"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
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
      <div {...devProps("ContactForm")} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-heading text-2xl mb-2">Message Sent!</h3>
        <p className="text-fg-secondary">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      {...devProps("ContactForm")}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Row 1: First Name + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input
          type="text"
          required
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder="First Name*"
          className={fieldStyles}
        />
        <input
          type="text"
          required
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Last Name*"
          className={fieldStyles}
        />
      </div>

      {/* Row 2: Email + Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="Email*"
          className={fieldStyles}
        />
        <input
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          placeholder="Company"
          className={fieldStyles}
        />
      </div>

      {/* Row 3: Interest */}
      <CustomSelect
        value={formData.interest}
        onChange={(value) => setFormData({ ...formData, interest: value })}
        options={interestOptions}
        placeholder="I'm interested in..."
      />

      {/* Row 4: Message */}
      <textarea
        required
        value={formData.message}
        onChange={(e) =>
          setFormData({ ...formData, message: e.target.value })
        }
        placeholder="Tell us more about what you have in mind*"
        rows={5}
        className={cn(fieldStyles, "resize-none")}
      />

      {/* Error */}
      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      {/* Submit */}
      <div className="pt-4">
        <ActionButton
          type="submit"
          variant="brand"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </ActionButton>
      </div>
    </form>
  );
}
