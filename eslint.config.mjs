// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

// Prettier owns formatting; ESLint only checks code quality
export default withNuxt(prettier)
