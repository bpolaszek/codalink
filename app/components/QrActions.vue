<template>
  <div class="space-y-3">
    <UTabs
      v-model="format"
      :items="formats"
      :content="false"
      :disabled="disabled"
      size="sm"
      class="w-full" />
    <div class="flex gap-2 *:flex-1">
      <UButton
        block
        :disabled="disabled"
        icon="i-lucide-download"
        :label="t('download')"
        :loading="busy"
        @click="run(download)" />
      <UButton
        v-if="canCopy"
        block
        :disabled="disabled"
        variant="soft"
        icon="i-lucide-copy"
        :label="t('copy')"
        @click="run(copy)" />
      <UButton
        v-if="canShare"
        block
        :disabled="disabled"
        variant="soft"
        icon="i-lucide-share-2"
        :label="t('share')"
        @click="run(share)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  getBlob: (format: QrFormat) => Promise<Blob>
  filename: string
  disabled?: boolean
}>()
const emit = defineEmits<{ done: [] }>()

const { t } = useI18n()
const toast = useToast()

const format = ref<QrFormat>('png')
const busy = ref(false)
const formats = [
  { label: 'PNG', value: 'png' },
  { label: 'SVG', value: 'svg' },
]

const canCopy =
  import.meta.client &&
  typeof ClipboardItem !== 'undefined' &&
  !!navigator.clipboard?.write
const canShare = import.meta.client && typeof navigator.share === 'function'

const fileName = () => `${props.filename}.${format.value}`

async function run(action: () => Promise<void>) {
  busy.value = true
  try {
    await action()
    emit('done')
  } catch (error) {
    // User dismissing the share sheet is not an error
    if (error instanceof DOMException && error.name === 'AbortError') return
    toast.add({ title: t('error'), color: 'error' })
  } finally {
    busy.value = false
  }
}

async function download() {
  const url = URL.createObjectURL(await props.getBlob(format.value))
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: fileName(),
  })
  link.click()
  URL.revokeObjectURL(url)
}

async function copy() {
  // Clipboard only reliably supports PNG; the promise is passed as-is so Safari keeps the user gesture
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': props.getBlob('png') }),
  ])
  toast.add({ title: t('copied'), icon: 'i-lucide-check', color: 'success' })
}

async function share() {
  const file = new File([await props.getBlob(format.value)], fileName(), {
    type: format.value === 'png' ? 'image/png' : 'image/svg+xml',
  })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] })
  } else {
    await navigator.share({ title: 'CodaLink', text: props.filename })
  }
}
</script>

<i18n lang="yaml">
en:
  download: 'Download'
  copy: 'Copy'
  share: 'Share'
  copied: 'Image copied'
  error: 'Something went wrong. Please try again.'
fr:
  download: 'Télécharger'
  copy: 'Copier'
  share: 'Partager'
  copied: 'Image copiée'
  error: "Une erreur s'est produite. Réessayez."
</i18n>
