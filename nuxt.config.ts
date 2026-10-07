export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
})
