import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/shared/skip-link";

export const metadata: Metadata = {
  title: {
    default: "Open Session | Design Company",
    template: "%s | Open Session",
  },
  description:
    "We're a design company focused on brand systems, creative AI, and community. We help the world make the most of design and technology.",
  keywords: [
    "design agency",
    "brand identity",
    "digital design",
    "UX design",
    "UI design",
    "creative AI",
    "design systems",
  ],
  authors: [{ name: "Open Session" }],
  creator: "Open Session",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://opensession.co",
    siteName: "Open Session",
    title: "Open Session | Design Company",
    description:
      "We're a design company focused on brand systems, creative AI, and community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Session | Design Company",
    description:
      "We're a design company focused on brand systems, creative AI, and community.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFAEE" },
    { media: "(prefers-color-scheme: dark)", color: "#191919" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Inline script to prevent flash of wrong theme
const themeScript = `
  (function() {
    const stored = localStorage.getItem('os-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'dark' || stored === 'light'
      ? stored
      : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1 pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
