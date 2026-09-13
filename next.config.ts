import type { NextConfig } from "next";

// `images.domains` was removed in Next 16 — use `remotePatterns` if remote
// images are ever needed. All images here are local, so nothing is configured.
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
