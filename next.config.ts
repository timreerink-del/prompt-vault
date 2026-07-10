import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodig zodat "/dierenspel/" niet naar "/dierenspel" wordt geredirect vóór de
  // rewrite hieronder — anders valt de pagina buiten het scope van de service worker.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // Losstaande statische PWA (offline dierenvangspel), los van de rest van de app.
      { source: "/dierenspel", destination: "/dierenspel/index.html" },
      { source: "/dierenspel/", destination: "/dierenspel/index.html" },
    ];
  },
};

export default nextConfig;
