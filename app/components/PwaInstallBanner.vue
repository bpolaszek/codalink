<template>
  <div
    v-if="mode"
    class="border-default text-muted mx-auto mt-8 flex max-w-md items-center gap-3 rounded-lg border px-3 py-2 text-sm"
    role="region"
    :aria-label="t('label')">
    <UIcon name="i-lucide-download" class="text-primary size-4 shrink-0" />
    <p class="flex-1">{{ mode === 'ios' ? t('ios') : t('native') }}</p>
    <UButton
      v-if="mode === 'native'"
      size="xs"
      variant="soft"
      :label="t('install')"
      @click="install" />
    <UButton
      size="xs"
      variant="ghost"
      color="neutral"
      icon="i-lucide-x"
      :aria-label="t('dismiss')"
      @click="dismiss" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { mode, install, dismiss } = usePwaInstall()
</script>

<i18n lang="yaml">
en:
  label: 'Install the app'
  native: 'Install CodaLink for quick access, even offline.'
  ios: 'To install: tap Share, then “Add to Home Screen”.'
  install: 'Install'
  dismiss: 'Dismiss'
fr:
  label: "Installer l'application"
  native: 'Installe CodaLink pour y accéder rapidement, même hors ligne.'
  ios: "Pour installer : touche Partager, puis « Sur l'écran d'accueil »."
  install: 'Installer'
  dismiss: 'Fermer'
</i18n>
