<template>
  <UApp :toaster="{ position: 'bottom-center' }">
    <NuxtPwaManifest />
    <AppHeader />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()

useHead({ htmlAttrs: { lang: () => locale.value } })
useSeoMeta({
  title: () => t('title'),
  description: () => t('description'),
  ogTitle: () => t('title'),
  ogDescription: () => t('description'),
})
</script>

<i18n lang="yaml" global>
en:
  title: 'CodaLink - URL to QR code'
  description: 'Turn any link into a QR code. Customize it, download it as PNG or SVG, copy it or share it.'
fr:
  title: 'CodaLink - URL en QR code'
  description: "Transforme n'importe quel lien en QR code. Personnalise-le, télécharge-le en PNG ou SVG, copie-le ou partage-le."
</i18n>
