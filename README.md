# sandhosh-portfolio

Personal site for Sandhoshsivan M, .NET Backend Developer. Next.js + Tailwind CSS.

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Every push to `main` deploys to production; every pull request gets its own preview link.

The site's public address comes from `src/lib/site.ts`:

1. `NEXT_PUBLIC_SITE_URL`, if set in Vercel's environment variables, or
2. Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`), which follows a custom domain once one is added.

So adding a custom domain later needs no code change: add it under Project → Settings → Domains and redeploy.

## Assets

- `scripts/clean-assets.py`: raw stickers in `references/assets-raw/` → `public/assets/` (WebP).
- `scripts/make-og-image.py`: the 1200×630 link-preview card (`src/app/opengraph-image.png`).
