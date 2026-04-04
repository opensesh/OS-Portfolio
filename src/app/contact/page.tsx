import { Metadata } from "next";
import { Mail01, MarkerPin01, Calendar } from "@untitledui-pro/icons/line";
import { ContactForm } from "@/components/shared/contact-form";
import { cn } from "@/lib/utils";
import { devProps } from "@/utils/dev-props";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Open Session. We'd love to hear about your project.",
};

export default function ContactPage() {
  return (
    <div {...devProps('ContactPage')} className="py-20 md:py-32">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <div>
            <p className="section-label mb-4">Contact</p>
            <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">
              Let&apos;s work together
            </h1>
            <p className="text-fg-secondary text-lg mb-12">
              Have a project in mind? We&apos;d love to hear from you. Fill out
              the form or reach out directly.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-bg-secondary rounded-lg">
                  <Mail01 className="w-5 h-5 text-fg-tertiary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-fg-primary mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@opensession.co"
                    className="text-fg-brand hover:underline"
                  >
                    hello@opensession.co
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-bg-secondary rounded-lg">
                  <MarkerPin01 className="w-5 h-5 text-fg-tertiary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-fg-primary mb-1">
                    Location
                  </h3>
                  <p className="text-fg-secondary">Remote / Los Angeles, CA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-bg-secondary rounded-lg">
                  <Calendar className="w-5 h-5 text-fg-tertiary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-fg-primary mb-1">
                    Book a Call
                  </h3>
                  <a
                    href="https://cal.com/opensession"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-brand hover:underline"
                  >
                    Schedule on Cal.com →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-bg-secondary p-8 md:p-10">
            <h2 className="text-heading text-2xl mb-6">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
