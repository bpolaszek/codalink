# CodaLink

Turn any URL into a QR code. Customize it, download it as PNG or SVG, copy it or share it.

**Live:** https://codalink.pages.dev

## Features

- Live QR code preview, with bare domains accepted (`example.com` becomes `https://example.com`)
- Light customization: code color, background color, module style (squares, rounded, dots), with a warning when the contrast is too low for scanners
- Export as PNG or SVG (1024 px), copy the image to the clipboard, share through the Web Share API (when the browser supports it)
- `/?url=https://example.com` pre-fills the input (handy for bookmarklets)
- Local history of the last 10 URLs (stored in the browser only)
- English (default) and French, detected from the browser language and switchable from the header
- Installable PWA that also works offline, with a discreet install hint (native prompt, or the Share menu instructions on iOS Safari)
- Light and dark mode, mobile and desktop layouts

## Stack

Nuxt 4 (SPA, `ssr: false`) · @vite-pwa/nuxt · Nuxt UI · @nuxtjs/i18n · qr-code-styling · VueUse · Vitest

## Development

```bash
yarn install
yarn dev        # http://localhost:3000
yarn test       # vitest
yarn lint       # eslint + prettier
yarn typecheck
yarn generate   # static build (the service worker only exists in production builds)
yarn pwa-assets-generator   # regenerate PWA icons from public/favicon.svg
```

## Deployment

Hosted on Cloudflare Pages, connected to this repository: every push to `main` is built and deployed, other branches get preview deployments.

| Setting               | Value           |
| --------------------- | --------------- |
| Build command         | `yarn generate` |
| Output directory      | `dist`          |
| `NODE_VERSION`        | `22`            |
| `YARN_IGNORE_ENGINES` | `1`             |

Notes:

- `packageManager` is pinned to Yarn 1 in `package.json`: Cloudflare's build image would otherwise pick Yarn 4, which rejects the Yarn 1 lockfile.
- `YARN_IGNORE_ENGINES=1` is needed because Cloudflare's build image only ships Node 22.22.0 and 24.13.1, while Nuxt 4.6 declares a minimum of 22.22.3 / 24.15 in its `engines`. Remove it once the image catches up.
- On Cloudflare the Nitro preset writes the build to `dist`, whereas locally `yarn generate` writes to `.output/public` (`dist` is a symlink to it).

Local simulation of the Pages runtime: `yarn generate && npx wrangler pages dev dist`.
