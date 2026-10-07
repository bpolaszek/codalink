export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n', '@vite-pwa/nuxt'],
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#f97316' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-15',

  // Cloudflare Pages: avoid /contact.html -> /contact redirect loops
  // https://nuxt.com/deploy/cloudflare
  nitro: {
    prerender: { autoSubfolderIndex: false },
  },

  eslint: {
    config: {
      stylistic: { commaDangle: 'always-multiline', braceStyle: '1tbs' },
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'en',
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    client: { installPrompt: true },
    manifest: {
      name: 'CodaLink - QRCode Generator',
      short_name: 'CodaLink',
      description: 'Turn any link into a QR code.',
      theme_color: '#f97316',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Single-page app: any navigation falls back to the precached shell, so it works offline
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    devOptions: { enabled: false },
  },
})
