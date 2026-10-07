<template>
  <UDropdownMenu :items="items">
    <UButton
      variant="ghost"
      color="neutral"
      size="sm"
      icon="i-lucide-languages"
      :aria-label="t('label')">
      <span class="text-xs uppercase">{{ locale }}</span>
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const LANGUAGE_NAMES: Record<string, string> = { en: 'English', fr: 'Français' }

const items = computed(() => [
  locales.value.map((l) => ({
    label: LANGUAGE_NAMES[l.code] ?? l.code,
    icon: locale.value === l.code ? 'i-lucide-check' : undefined,
    onSelect: () => setLocale(l.code),
  })),
])
</script>

<i18n lang="yaml">
en:
  label: 'Change language'
fr:
  label: 'Changer de langue'
</i18n>
