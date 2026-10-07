import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // Maskable icons get cropped by the OS: pad the glyph and fill with the brand color
    maskable: {
      sizes: [512],
      padding: 0.2,
      resizeOptions: { background: '#f97316', fit: 'contain' },
    },
    apple: {
      sizes: [180],
      padding: 0.2,
      resizeOptions: { background: '#f97316', fit: 'contain' },
    },
  },
  images: ['public/favicon.svg'],
})
