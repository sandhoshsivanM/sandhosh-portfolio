import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files in out/, served by GitHub Pages at https://sandhoshsivanm.github.io
  output: "export",
  // GitHub Pages has no image server; images are already WebP at the right sizes.
  images: { unoptimized: true },
};

export default nextConfig;
