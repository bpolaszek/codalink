<template>
  <UCollapsible>
    <UButton
      variant="ghost"
      color="neutral"
      size="sm"
      icon="i-lucide-palette"
      trailing-icon="i-lucide-chevron-down"
      :label="t('title')" />
    <template #content>
      <div class="space-y-4 pt-3">
        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="t('color')">
            <input
              v-model="style.color"
              type="color"
              class="border-default h-9 w-full cursor-pointer rounded-lg border bg-transparent p-1" />
          </UFormField>
          <UFormField :label="t('background')">
            <input
              v-model="style.background"
              type="color"
              class="border-default h-9 w-full cursor-pointer rounded-lg border bg-transparent p-1" />
          </UFormField>
        </div>

        <UFormField :label="t('shape')">
          <USelect v-model="style.dotsType" :items="shapes" class="w-full" />
        </UFormField>

        <UAlert
          v-if="!scannable"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          :description="t('warning')" />

        <UButton
          variant="link"
          color="neutral"
          size="xs"
          icon="i-lucide-rotate-ccw"
          :label="t('reset')"
          @click="style = { ...DEFAULT_QR_STYLE }" />
      </div>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
const style = defineModel<QrStyle>({ required: true })
const { t } = useI18n()

const shapes = computed(() => [
  { label: t('shapes.square'), value: 'square' },
  { label: t('shapes.rounded'), value: 'rounded' },
  { label: t('shapes.dots'), value: 'dots' },
])

const scannable = computed(() =>
  isScannable(style.value.color, style.value.background),
)
</script>

<i18n lang="yaml">
en:
  title: 'Customize'
  color: 'Code color'
  background: 'Background'
  shape: 'Style'
  shapes:
    square: 'Squares'
    rounded: 'Rounded'
    dots: 'Dots'
  warning: 'Low contrast or inverted colors: some scanners may fail to read this code.'
  reset: 'Reset'
fr:
  title: 'Personnaliser'
  color: 'Couleur du code'
  background: 'Fond'
  shape: 'Style'
  shapes:
    square: 'Carrés'
    rounded: 'Arrondis'
    dots: 'Points'
  warning: 'Contraste faible ou couleurs inversées : certains lecteurs risquent de ne pas lire ce code.'
  reset: 'Réinitialiser'
</i18n>
