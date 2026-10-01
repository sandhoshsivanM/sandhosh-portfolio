# sandhosh-portfolio

Personal site for Sandhoshsivan M, .NET Backend Developer. Next.js + Tailwind CSS.

```bash
npm install
npm run dev
```

## Deploy

Live at **https://sandhoshsivanm.github.io**.

Every push to `main` runs `.github/workflows/deploy.yml`: it builds the static site (`out/`) and
force-pushes it to the `sandhoshsivanM/sandhoshsivanM.github.io` repo, which GitHub Pages serves.
The workflow authenticates with the `PAGES_DEPLOY_KEY` secret (a write deploy key on that repo).
Never edit the `.github.io` repo by hand; the next deploy overwrites it.

The public address used for canonical links, link previews and the sitemap comes from
`src/lib/site.ts` (`NEXT_PUBLIC_SITE_URL`, set in the workflow). For a custom domain later: add a
`public/CNAME` file with the domain, point its DNS at GitHub Pages, and change `NEXT_PUBLIC_SITE_URL`.

## Assets

- `scripts/clean-assets.py`: raw stickers in `references/assets-raw/` → `public/assets/` (WebP).
- `scripts/make-og-image.py`: the 1200×630 link-preview card (`src/app/opengraph-image.png`).
