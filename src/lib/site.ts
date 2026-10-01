/**
 * The site's public address, used for canonical links, social previews and the sitemap.
 *
 * Order: NEXT_PUBLIC_SITE_URL if set (use it to pin a custom domain), else the
 * production domain Vercel provides at build time (it follows a custom domain once
 * one is added in Vercel), else localhost for local builds.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? (fromVercel ? `https://${fromVercel}` : "http://localhost:3000"),
);
