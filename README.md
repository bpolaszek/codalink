# CodaLink

Turn any URL into a QR code. Customize it, download it as PNG or SVG, copy it or share it (Web Share API).

Nuxt 4 SPA · Nuxt UI · @nuxtjs/i18n (EN default, FR, browser detection) · qr-code-styling.

## Development

```bash
yarn install
yarn dev        # http://localhost:3000
yarn test       # vitest
yarn lint       # eslint + prettier
yarn typecheck
```

`/?url=https://example.com` pre-fills the input (handy for bookmarklets).

## Deploy on Cloudflare Pages

Git integration (zero config) with:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `yarn generate` |
| Output directory | `dist`          |
| `NODE_VERSION`   | `22`            |

Or direct upload:

```bash
yarn generate
npx wrangler pages deploy dist/
```

Local simulation: `npx wrangler pages dev dist`.
