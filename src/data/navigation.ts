export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const mainNavItems: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "The Lab", href: "/templates" },
];

export const footerNavItems: Record<string, NavItem[]> = {
  company: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "The Lab", href: "/templates" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/opensesh",
    icon: "github",
  },
  {
    label: "Figma",
    href: "https://figma.com/@opensession",
    icon: "figma",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/opensessionco",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/opensession",
    icon: "linkedin",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@opensession",
    icon: "youtube",
  },
];
