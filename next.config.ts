import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All images are served locally from /public/images/.
    // No remote domains are allowlisted — framerusercontent.com
    // is intentionally absent.
    remotePatterns: [],

    // Device breakpoints for responsive image generation.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Thumbnail/icon sizes — used when <Image> has a fixed width/height.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Serve AVIF (smallest) and WebP (broad support).
    // Next.js will fall back to the original format if the browser
    // does not support AVIF.
    formats: ["image/avif", "image/webp"],

    // The about-page hero is 7008x4672. Next.js Image handles
    // optimization at serve time — no build-time resize needed.
    // Setting minimumCacheTTL ensures optimized variants are cached.
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
