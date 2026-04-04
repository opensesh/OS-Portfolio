import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@untitledui-pro/icons/line";
import { devProps } from "@/utils/dev-props";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Open Session.",
};

export default function PrivacyPage() {
  return (
    <div {...devProps('PrivacyPage')} className="py-20 md:py-32">
      <div className="container-main max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-display text-4xl md:text-5xl mb-8">
          Privacy Policy
        </h1>

        <div className="prose">
          <p className="text-fg-secondary text-lg mb-6">
            Last updated: March 2025
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            We collect information you provide directly to us, such as when you
            fill out a contact form, subscribe to our newsletter, or communicate
            with us. This may include your name, email address, company name,
            and any other information you choose to provide.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            We use the information we collect to provide, maintain, and improve
            our services, to communicate with you about our services, and to
            respond to your inquiries. We may also use the information to send
            you marketing communications, such as newsletters, if you have opted
            in to receive them.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties. This does not include trusted third
            parties who assist us in operating our website, conducting our
            business, or servicing you, so long as those parties agree to keep
            this information confidential.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">4. Cookies</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            We use cookies to understand and save your preferences for future
            visits and compile aggregate data about site traffic and site
            interaction. You can choose to have your computer warn you each time
            a cookie is being sent, or you can choose to turn off all cookies.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">5. Data Security</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            We implement a variety of security measures to maintain the safety
            of your personal information. However, no method of transmission
            over the Internet or method of electronic storage is 100% secure.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">6. Your Rights</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            You have the right to access, correct, or delete your personal
            information. You may also opt out of receiving marketing
            communications from us at any time by clicking the unsubscribe link
            in our emails or contacting us directly.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">7. Contact Us</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a href="mailto:hello@opensession.co" className="text-fg-brand">
              hello@opensession.co
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
