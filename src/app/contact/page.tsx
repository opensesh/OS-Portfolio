import { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { devProps } from "@/utils/dev-props";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with Open Session for collaborations, partnerships, and networking.",
};

export default function ContactPage() {
  return (
    <div {...devProps("ContactPage")}>
      <ContactHero />
    </div>
  );
}
