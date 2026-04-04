import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@untitledui-pro/icons/line";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Open Session.",
};

export default function TermsPage() {
  return (
    <div className="py-20 md:py-32">
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
          Terms of Service
        </h1>

        <div className="prose">
          <p className="text-fg-secondary text-lg mb-6">
            Last updated: March 2025
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">
            1. Agreement to Terms
          </h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            By accessing or using our services, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using or
            accessing this site.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">2. Use License</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            Permission is granted to temporarily access the materials on Open
            Session&apos;s website for personal, non-commercial transitory
            viewing only. This is the grant of a license, not a transfer of
            title.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">3. Disclaimer</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            The materials on Open Session&apos;s website are provided on an
            &apos;as is&apos; basis. Open Session makes no warranties, expressed
            or implied, and hereby disclaims and negates all other warranties
            including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">4. Limitations</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            In no event shall Open Session or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Open Session&apos;s website.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">5. Revisions</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            Open Session may revise these terms of service for its website at
            any time without notice. By using this website you are agreeing to
            be bound by the then current version of these terms of service.
          </p>

          <h2 className="text-heading text-2xl mt-12 mb-4">6. Contact</h2>
          <p className="text-fg-secondary leading-relaxed mb-6">
            If you have any questions about these Terms, please contact us at{" "}
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
