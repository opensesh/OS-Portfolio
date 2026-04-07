export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
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
    { label: "Contact", href: "/contact" },
  ],
  theLab: [
    { label: "Blog", href: "/blog" },
    { label: "Playbooks", href: "/playbooks" },
    { label: "Free Assets", href: "/free-assets" },
    { label: "View All", href: "/templates" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

// Navigation items for the full-screen overlay menu
export const overlayNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  {
    label: "The Lab",
    href: "/templates",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Playbooks", href: "/playbooks" },
      { label: "Resources", href: "/resources" },
      { label: "View All", href: "/templates" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const contactEmails = [
  { name: "Karim", email: "karim@opensession.co" },
  { name: "Morgan", email: "morgan@opensession.co" },
  { name: "General", email: "hello@opensession.co" },
];

export const statusLines = [
  "Based in California, working globally",
  "Open to partnerships and collaboration",
  "Currently developing products",
];

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
