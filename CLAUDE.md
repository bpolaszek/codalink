# CodaLink

Nuxt 4 SPA (`ssr: false`) that turns a URL into a QR code. Hosted on Cloudflare Pages (https://codalink.pages.dev), deployed on every push to `main`.

## Conventions

- Code, comments, commit messages and docs are in English.
- Package manager: Yarn 1 (`packageManager` is pinned: Cloudflare's build image would otherwise pick Yarn 4).
- Prettier owns formatting (`yarn format`), ESLint only checks code quality. Run `yarn lint`, `yarn typecheck` and `yarn test` before committing.

## i18n

- Locales: `en` (default) and `fr`, `no_prefix` strategy, language detected from the browser. Messages live in `<i18n lang="yaml">` blocks next to each component (global ones in `app/app.vue`).
- **French copy uses the formal "vous"** (never "tu"): "Collez une URL", "Votre QR code", "Réessayez". Apply it to every new or edited French string, including toasts, errors and PWA texts.
- Every user-facing string needs both `en` and `fr` entries.

## PWA

- Powered by `@vite-pwa/nuxt`. The service worker only exists in production builds (`yarn generate`), not in `yarn dev`.
- Icons are generated from `public/favicon.svg`: run `yarn pwa-assets-generator` after changing it.
