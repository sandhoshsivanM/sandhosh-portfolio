/**
 * The site's public address, used for canonical links, social previews and the sitemap.
 *
 * Order: NEXT_PUBLIC_SITE_URL if set (use it to pin a custom domain), else the
 * production domain Vercel provides at build time, else the GitHub Pages address.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? (fromVercel ? `https://${fromVercel}` : "https://sandhoshsivanm.github.io"),
);
