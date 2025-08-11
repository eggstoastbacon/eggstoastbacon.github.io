# GenMDM Explorer — User Site (eggstoastbacon.github.io)

This bundle is pre-configured for a **User/Org GitHub Pages** site hosted at `https://eggstoastbacon.github.io/` (main branch).

## Local dev
```bash
npm i
npm run dev
```

## Deploy (via GitHub Actions)
1. Push this repo to **eggstoastbacon/eggstoastbacon.github.io** on the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` any time; the workflow **pages.yml** builds with Vite and publishes `/dist` to Pages.

> Note: For user/org sites the Vite `base` **must be `'/'`** (already set in `vite.config.ts`).

If you prefer manual deploys, you can also `npm run build` and copy the contents of `dist/` into the repo root (overwriting). The Actions flow is cleaner.
