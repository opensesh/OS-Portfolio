# Task Brief: T008

**Title:** Migrate legal page content from CSV HTML
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 2

---

## Objective

Create `/legal/terms` and `/legal/privacy` routes in the Next.js portfolio. Extract the Terms & Conditions and Privacy Policy content from the Framer `Legal.csv` export, convert HTML to clean MDX or static page content, and render both pages under a shared `/src/app/legal/layout.tsx`. Update the site footer to link to the new `/legal/terms` and `/legal/privacy` routes instead of the non-existent `/terms` and `/privacy` stubs.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The portfolio site's footer at `src/components/layout/footer.tsx` currently links to `/terms` and `/privacy` (via `footerNavItems.legal` in `src/data/navigation.ts`). These routes do not exist — navigating to them results in a 404. The Framer site has both legal pages with full content in `Legal.csv`.

This task creates the legal pages from scratch under a new `/legal/` route group and updates the footer links to point there.

Wave 1 dependencies:
- **T002** — not strictly required, but MDX setup (next-mdx-remote) may be installed by T002
- **T003** — Creates `/src/content/` directory structure. Legal MDX files will live in `/src/content/legal/`

This task is part of **Wave 2** — content migration.

---

## Full Legal Content (Source: Framer Legal.csv)

### Legal.csv Column Structure
```
Slug | Title | Content (HTML)
```

---

### Page 1: Terms & Conditions

**CSV Slug:** `terms-conditions`
**Target Route:** `/legal/terms`
**MDX File:** `src/content/legal/terms.mdx`

**Full Content (converted from CSV HTML to MDX):**

```mdx
**Last Updated: September 8, 2025**

Welcome to OpenSession LLC ("OpenSession," "we," "us," or "our"). By accessing or using our website (opensession.co), services, digital products, or contacting us through any channel, you ("Client," "you," or "your") agree to be bound by these Terms & Conditions ("Terms"). If you do not agree to these Terms, please refrain from using our website and services.

## 1. Acceptance and Modifications

By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of any modifications.

## 2. Services Offered

OpenSession provides digital design services including but not limited to:

- Brand identity and logo design
- Website design and development
- User interface (UI) and user experience (UX) design
- Digital marketing and advertising services
- Website hosting and ongoing maintenance
- Client account management and dashboard services
- Digital assets, templates, and downloadable products
- Software plugins and open-source code
- Educational content and training materials

## 3. Use of Website and Services

### Permitted Use

You agree to use our website and services for lawful purposes only and in accordance with these Terms.

### Prohibited Activities

You may not:

- Attempt to gain unauthorized access to our systems, servers, or networks
- Use the site to transmit harmful, malicious, or illegal content
- Copy, distribute, modify, or reverse-engineer our proprietary content without permission
- Interfere with or disrupt our services or servers
- Use automated systems to access our website without permission
- Violate any applicable local, state, or federal laws

We reserve the right to suspend or terminate access immediately if we suspect any misuse or violation of these Terms.

## 4. Intellectual Property Rights

### Our Property

All content on this website—including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, software, designs, and case studies—is owned by OpenSession LLC or our licensors and is protected by United States and international copyright laws.

### Client Work and Ownership

- Upon full payment, clients receive complete ownership of final design deliverables as specified in the project agreement
- OpenSession retains the right to maintain copies of all work for our records, portfolio showcase, educational purposes, case studies, marketing materials, and AI training datasets
- Clients grant OpenSession a perpetual, royalty-free license to display their work in our portfolio and marketing materials
- Any preliminary designs, concepts, or work product not included in final deliverables remains OpenSession property

### Third-Party Content

We may use third-party fonts, stock images, or other assets in client projects. Clients are responsible for ensuring proper licensing of any third-party content in their final deliverables.

## 5. Project Engagement and Service Terms

### Project Agreements

All custom projects are subject to a separate written agreement outlining scope of work, deliverables, timelines, and specific payment terms. These Terms supplement but do not replace project-specific agreements.

### Project Acceptance

- OpenSession reserves the right to decline any project request at our sole discretion
- We may refuse service to anyone for any reason not prohibited by law
- All project scopes must be clearly defined in writing before work begins

### Digital Products and Templates

- Digital products, templates, and downloadable assets are sold with limited commercial licenses as specified at time of purchase
- No refunds on digital downloads after delivery
- Redistribution or resale of our digital products is prohibited unless explicitly stated

## 6. Payment Terms and Billing

### Standard Payment Structure

- **Custom Projects**: 50% deposit required to begin work, 50% due upon project completion
- **Retainer Services**: 50% payment upfront, 50% due upon completion of retainer period
- **Digital Products**: Full payment required before download access

### Payment Processing

- All payments processed securely through third-party payment processors
- Accepted payment methods include credit cards, ACH transfers, and other methods as specified
- All prices quoted in US dollars unless otherwise stated

### Late Payments

- Invoices are due within 15 days of issuance unless otherwise specified
- Late payments subject to 1.5% monthly service charge (18% annually) or maximum allowed by law
- Work may be suspended on overdue accounts
- Client remains responsible for all collection costs and reasonable attorney fees

### Refund Policy

- **Custom Services**: No refunds for completed work or work in progress beyond 30 days
- **Digital Products**: No refunds after delivery due to the nature of digital goods
- **Deposits**: Non-refundable once work has commenced
- **Retainer Services**: Unused portions may be refunded at OpenSession discretion

## 7. Data Collection and Privacy

### Information We Collect

We collect information you provide directly (contact forms, project communications) and automatically (cookies, analytics, usage data) to improve our services and user experience.

### Third-Party Tools

We use various third-party tools including:

- Google Analytics for website analytics
- Notion for project management
- Figma for design collaboration
- Various development and billing platforms

### Cookies and Tracking

Our website uses cookies and tracking technologies. By using our site, you consent to our cookie policy. You can manage cookie preferences through your browser settings.

### Data Usage

- We may use project data and communications for internal training, process improvement, and AI model training
- Personal information is handled in accordance with our Privacy Policy
- We implement reasonable security measures to protect your data

## 8. Client Responsibilities

### Content and Materials

- Clients must provide all necessary content, materials, and information in a timely manner
- Clients warrant they have rights to all materials provided to us
- Clients are responsible for content accuracy and legal compliance

### Cooperation and Communication

- Timely feedback and approvals are essential for project success
- Delays caused by client non-responsiveness may result in timeline extensions and additional fees
- Changes to project scope require written approval and may incur additional costs

### Third-Party Services

- Clients are responsible for their own hosting, domain registration, and third-party service accounts unless managed by OpenSession
- We are not liable for third-party service interruptions or failures

## 9. Limitation of Liability and Disclaimers

### Service Disclaimer

While we strive for excellence in all our work, our services are provided "AS IS" without warranties of any kind, either express or implied.

### Limitation of Liability

OpenSession LLC's total liability for any claim related to our services shall not exceed the total amount paid by the client for the specific service giving rise to the claim. We are not liable for:

- Indirect, incidental, special, or consequential damages
- Loss of profits, revenue, data, or business opportunities
- Delays caused by third-party vendors, platforms, or circumstances beyond our control
- Business outcomes, performance, or results based on our design or development work
- Technical issues, server downtime, or data loss not directly caused by our negligence

### Force Majeure

We are not liable for delays or failures due to circumstances beyond our reasonable control, including natural disasters, government actions, internet outages, or other force majeure events.

## 10. Confidentiality

### Mutual Confidentiality

Both parties agree to maintain confidentiality of sensitive information shared during the course of our business relationship. This includes:

- Proprietary business information
- Trade secrets and processes
- Client data and project details
- Technical specifications and methodologies

### Exceptions

Confidentiality obligations do not apply to information that:

- Is publicly available through no breach of these Terms
- Is independently developed without use of confidential information
- Must be disclosed by law or court order

## 11. Third-Party Services and Links

### External Links

Our website may contain links to third-party websites or services. We are not responsible for:

- Content, accuracy, or availability of external sites
- Privacy practices of third-party services
- Any damages resulting from your use of third-party services

### Embedded Tools and Integrations

We may use embedded third-party tools for enhanced functionality. Use of these tools is subject to their respective terms of service and privacy policies.

## 12. Termination

### Termination Rights

Either party may terminate ongoing services with written notice. OpenSession may immediately terminate services if:

- Client violates these Terms
- Payment obligations are not met
- Client engages in abusive or inappropriate conduct

### Effect of Termination

Upon termination:

- Client remains obligated to pay for all completed work
- OpenSession will deliver all completed work upon full payment
- Both parties' confidentiality obligations survive termination

## 13. Dispute Resolution

### Mandatory Arbitration

Any dispute, claim, or controversy arising from these Terms or our services must first be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association.

### Arbitration Process

- Arbitration will be conducted in San Diego County, California
- Each party bears their own attorney fees unless arbitrator rules otherwise
- Arbitration awards are final and binding
- Class action lawsuits are waived

### Exceptions

The following may be resolved in court:

- Claims for injunctive relief
- Intellectual property disputes
- Small claims court matters under jurisdictional limits

## 14. Governing Law and Jurisdiction

These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any court proceedings (where permitted under Section 13) shall be conducted in the state or federal courts of San Diego County, California.

## 15. Severability and Waiver

If any provision of these Terms is found unenforceable, the remaining provisions will remain in full effect. Our failure to enforce any provision does not constitute a waiver of that provision or any other provision.

## 16. Entire Agreement

These Terms, together with any signed project agreements and our Privacy Policy, constitute the entire agreement between you and OpenSession LLC regarding our services.

## 17. Contact Information

For questions about these Terms & Conditions, please contact us:

**OpenSession LLC**
Email: [hello@opensession.co](mailto:hello@opensession.co)
Website: opensession.co

*By using our services, you acknowledge that you have read and understood these Terms & Conditions and agree to be legally bound by them.*
```

---

### Page 2: Privacy Policy

**CSV Slug:** `privacy-policy`
**Target Route:** `/legal/privacy`
**MDX File:** `src/content/legal/privacy.mdx`

**Full Content (converted from CSV HTML to MDX):**

```mdx
**Last Updated: September 8, 2025**

This Privacy Policy explains how OpenSession LLC ("OpenSession," "we," "us," or "our") collects, uses, discloses, and protects your personal information when you interact with our website (opensession.co), services, or business operations.

We respect your privacy and are committed to protecting your personal information. This policy describes our privacy practices in compliance with applicable laws, including the California Consumer Privacy Act (CCPA) and other relevant data protection regulations.

If you have any questions, comments, or concerns about this policy or how we handle your information, please contact us at hello@opensession.co.

## Information We Collect

We collect personal information from you in several ways when you interact with our business:

### Information You Provide Directly

- **Contact Information**: Name, email address, phone number, company name, and job title when you fill out forms, subscribe to newsletters, or contact us
- **Project Information**: Details about your business, project requirements, preferences, and communications during our service engagement
- **Newsletter Subscriptions**: Email address and preferences when you subscribe to our marketing communications
- **Workshop Attendance**: Contact information, dietary restrictions, accessibility needs, and other relevant details for in-person or virtual events
- **Social Media Interactions**: Information when you interact with us on Instagram, YouTube, LinkedIn, or other social platforms

### Information We Collect Automatically

- **Website Analytics**: IP address, browser type, device information, pages visited, time spent on site, referring websites, and other usage data via Google Analytics
- **Cookies and Tracking**: Information collected through cookies, pixels, and similar technologies (see our Cookie Policy for details)
- **Social Media Tracking**: Data from Facebook Pixel, LinkedIn Insight Tag, and other social media tracking tools for advertising and analytics
- **Marketing Analytics**: Information collected through Sprout Social and other marketing platforms for campaign effectiveness

### Information from Third Parties

- **Social Media Platforms**: Publicly available information from your social media profiles when you interact with us
- **Client Referrals**: Information provided by existing clients or business partners who refer you to our services
- **Service Providers**: Information from payment processors, project management tools, and other service providers we use

## How We Use Your Information

We use your personal information for the following purposes:

### Service Delivery and Communication

- Provide design, development, and consulting services as requested
- Respond to inquiries and communicate about projects
- Send project updates, invoices, and service-related communications
- Manage workshop attendance and event logistics

### Marketing and Business Development

- Send newsletters, marketing materials, and company updates (with your consent)
- Analyze website and marketing campaign performance
- Improve our services and user experience
- Showcase completed work in our portfolio (with appropriate permissions)

### Legal and Business Operations

- Comply with legal obligations and respond to legal requests
- Protect our rights, property, and safety
- Process payments and maintain financial records
- Conduct business analytics and reporting

### AI Training and Development

- Use Figma files and design assets for AI model training and experimental purposes
- Improve our design processes and service delivery capabilities
- Develop new tools and methodologies for client engagement

**Legal Basis for Processing**: We process your information based on:

- Your consent (which you can withdraw at any time)
- Our legitimate business interests
- Performance of contracts with you
- Compliance with legal obligations

## Information Sharing and Disclosure

We may share your personal information in the following circumstances:

### Service Providers and Partners

We work with trusted third-party service providers who help us operate our business, including:

- **Analytics Providers**: Google Analytics, Facebook, LinkedIn
- **Communication Tools**: Email marketing platforms, social media management tools (Sprout Social)
- **Project Management**: Notion, Figma, and other collaboration platforms
- **Payment Processing**: Secure payment processors for billing
- **Cloud Storage**: Secure cloud storage providers for project files

### Legal Requirements

We may disclose your information when required by law or to:

- Comply with legal processes, court orders, or government requests
- Protect our rights, property, or safety
- Investigate fraud or other illegal activities
- Enforce our Terms & Conditions

### Business Transfers

If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.

### With Your Consent

We may share your information for other purposes with your explicit consent.

## International Data Transfers

OpenSession serves clients globally. When we transfer your personal information outside the United States, we ensure appropriate safeguards are in place, including:

- Standard Contractual Clauses approved by relevant authorities
- Adequacy decisions by regulatory bodies
- Other appropriate safeguards as required by applicable law

For clients in the European Union, United Kingdom, or other jurisdictions with specific data protection requirements, we comply with applicable cross-border transfer regulations.

## Data Retention

We retain your personal information only as long as necessary for the purposes outlined in this policy:

### General Business Information

- Contact information and communications: 7 years after last interaction
- Financial records and invoices: 7 years for tax and legal compliance
- Marketing data: Until you unsubscribe or request deletion

### Client Project Information

- **Design Files and Assets**: Retained indefinitely for portfolio, showcase, AI training, and reference purposes
- **Project Communications**: 3 years after project completion
- **Contracts and Agreements**: 7 years after contract termination

### Website and Analytics Data

- Cookie and tracking data: Up to 26 months
- Website analytics: Up to 38 months
- Marketing campaign data: Up to 2 years

## Your Privacy Rights

Depending on your location, you may have certain rights regarding your personal information:

### California Residents (CCPA Rights)

If you are a California resident, you have the right to:

- **Know**: Request information about the categories and specific pieces of personal information we collect, use, disclose, and sell
- **Delete**: Request deletion of your personal information (subject to certain exceptions)
- **Opt-Out**: Opt-out of the sale of your personal information (we do not currently sell personal information)
- **Non-Discrimination**: Not be discriminated against for exercising your privacy rights

### General Rights (All Users)

- **Access**: Request a copy of the personal information we hold about you
- **Correction**: Request correction of inaccurate or incomplete information
- **Portability**: Request your data in a structured, machine-readable format
- **Withdrawal**: Withdraw consent for processing based on consent
- **Restriction**: Request limitation of processing in certain circumstances

To exercise these rights, contact us at hello@opensession.co with your specific request.

## Cookies and Tracking Technologies

Our website uses cookies and similar technologies to:

- Analyze website performance and user behavior
- Provide personalized content and advertisements
- Enable social media features
- Remember your preferences and settings

You can manage your cookie preferences through your browser settings. However, disabling certain cookies may limit website functionality.

For detailed information about our cookie practices, please see our Cookie Policy.

## Children's Privacy

Our services are not directed to children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can delete such information.

## Security Measures

We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and authentication procedures
- Secure hosting and cloud storage solutions
- Employee training on data protection practices

However, no internet transmission is completely secure, and we cannot guarantee absolute security.

## Third-Party Websites and Services

Our website may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to those external sites or services. We encourage you to review the privacy policies of any third-party sites you visit.

## Changes to This Privacy Policy

We may update this Privacy Policy periodically to reflect changes in our practices, services, or applicable laws. We will notify you of material changes by:

- Posting the updated policy on our website
- Sending email notifications to subscribers
- Other appropriate communication methods

Your continued use of our services after any changes constitutes acceptance of the updated policy.

## Contact Information

For questions about this Privacy Policy or to exercise your privacy rights, please contact us:

**OpenSession LLC**
Email: hello@opensession.co
Website: opensession.co

For California residents exercising CCPA rights, please include "CCPA Request" in your subject line and specify which right you wish to exercise.

## Effective Date

This Privacy Policy is effective as of the date listed at the top of this document and applies to all information collected by OpenSession LLC.
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `/legal/terms` renders Terms & Conditions content without 404
- [ ] `/legal/privacy` renders Privacy Policy content without 404
- [ ] Content is readable and properly formatted — no raw HTML tags visible in the browser
- [ ] Both pages share a consistent legal layout with back navigation
- [ ] Footer links in `src/data/navigation.ts` point to `/legal/terms` and `/legal/privacy` (not `/terms` and `/privacy`)
- [ ] No old `/terms` or `/privacy` routes exist (or they redirect to `/legal/terms` and `/legal/privacy`)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/legal/layout.tsx` | create | Shared layout for legal pages (heading, back nav) |
| `src/app/legal/terms/page.tsx` | create | Terms & Conditions route page |
| `src/app/legal/privacy/page.tsx` | create | Privacy Policy route page |
| `src/content/legal/terms.mdx` | create | Terms content as MDX |
| `src/content/legal/privacy.mdx` | create | Privacy Policy content as MDX |
| `src/data/navigation.ts` | modify | Update `footerNavItems.legal` hrefs from `/terms` → `/legal/terms` and `/privacy` → `/legal/privacy` |

### File Ownership Notes

- `src/components/layout/footer.tsx` does not need changes — it reads from `footerNavItems.legal` dynamically. Updating `navigation.ts` is sufficient.
- The legal content directory `/src/content/legal/` does not currently exist. Create it as part of this task (T003 only creates `blog/` and `playbooks/`).

---

## Implementation Guidance

### Approach: MDX Files + MDX Rendering

The recommended approach is to create MDX files in `/src/content/legal/` and render them in the page components using `next-mdx-remote` (installed by T002). This keeps content separate from code and is consistent with how blog posts work.

**If next-mdx-remote is not yet installed** (T002 incomplete): Fall back to rendering the content as a JSX component with standard HTML elements. This is acceptable as legal pages don't need dynamic MDX features. You can inline the content as a React component if needed.

### Layout Component

Create a minimal `src/app/legal/layout.tsx`:

```tsx
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container-main max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-fg-secondary hover:text-fg-primary transition-colors mb-8 text-sm"
        >
          ← Back to Home
        </Link>
        <article className="prose prose-invert max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
}
```

**Note:** If the project doesn't have `@tailwindcss/typography` (which provides `prose` classes), use standard semantic HTML styling instead:
- `text-fg-primary` for body text
- `text-3xl font-bold` for h1
- `text-xl font-semibold mt-8 mb-4` for h2
- `text-lg font-semibold mt-6 mb-3` for h3
- `mb-4 text-fg-secondary leading-relaxed` for paragraphs
- `list-disc list-inside mb-4 text-fg-secondary` for ul/li

### Page Components (with MDX rendering)

If `next-mdx-remote` is available:

```tsx
// src/app/legal/terms/page.tsx
import { readFileSync } from "fs";
import { join } from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Open Session",
};

export default function TermsPage() {
  const mdxPath = join(process.cwd(), "src/content/legal/terms.mdx");
  const source = readFileSync(mdxPath, "utf8");
  return <MDXRemote source={source} />;
}
```

If MDX is not available, inline the content as JSX or dangerouslySetInnerHTML as a last resort.

### Navigation Update

In `src/data/navigation.ts`, the `footerNavItems.legal` array currently reads:
```typescript
legal: [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
],
```

Change to:
```typescript
legal: [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
],
```

### Old Routes

There are no existing `/src/app/terms/` or `/src/app/privacy/` directories (confirmed via codebase check). No redirect needed — the old hrefs simply didn't have corresponding pages.

### Content Directory

T003 creates `/src/content/blog/` and `/src/content/playbooks/`. It does NOT create `/src/content/legal/`. Create it:

```bash
mkdir -p src/content/legal
```

No `.gitkeep` needed since you'll immediately add content files.

### Prose Styling Check

Check if `tailwind.config.*` includes `@tailwindcss/typography` plugin. If it does, the `prose` class from the layout will style the legal content correctly. If not, apply Tailwind classes directly in the page or layout.

---

## Boundaries

### Files You MUST NOT Touch

- `node_modules/**`
- `.git/**`
- `.next/**`
- `package-lock.json`
- `src/components/layout/footer.tsx` (no changes needed — footer reads from navigation.ts dynamically)

### Files Requiring Review

- `package.json` — do not add new packages unless next-mdx-remote is genuinely missing and you need an alternative
- `tsconfig.json` — do not modify
- `next.config.ts` — do not modify

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | Installs next-mdx-remote; creates `src/content/` path setup | Check if `next-mdx-remote` is in `package.json` dependencies |
| T003 | Creates `src/content/` directory (but not `src/content/legal/`) | Check `src/content/` exists; you'll create `src/content/legal/` yourself |

### Downstream Impact

Tasks that depend on this one: None — T008 is a leaf node. No Wave 3 or Wave 4 tasks depend on legal pages.

**Before starting:** Verify navigation.ts exists at `src/data/navigation.ts` and contains the `footerNavItems.legal` array (confirmed — it does, with `/terms` and `/privacy` hrefs that need updating).

---

## GitHub Context

**Issue:** T008 (to be created)
**Branch:** `worktree/framer-cms-migration-T008`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

```
feat(legal): create legal pages with terms and privacy content

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix(navigation): update footer legal links to /legal/* routes

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: `npm run build`
- [ ] `npm run lint` passes
- [ ] `/legal/terms` accessible and renders full Terms content
- [ ] `/legal/privacy` accessible and renders full Privacy Policy content
- [ ] Footer legal links updated to `/legal/terms` and `/legal/privacy`
- [ ] No raw HTML tags visible in rendered pages
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T008 | Wave: 2_
