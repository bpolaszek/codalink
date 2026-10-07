<template>
  <main class="mx-auto w-full max-w-xl px-4 pb-12 lg:max-w-4xl">
    <div class="mb-6 space-y-1 text-center">
      <h1 class="text-2xl font-bold sm:text-3xl">{{ t('heading') }}</h1>
      <p class="text-muted">{{ t('subheading') }}</p>
    </div>

    <!-- Mobile: single column in DOM order. Desktop: form on the left, QR card pinned on the right -->
    <div
      class="grid gap-6 lg:grid-cols-2 lg:grid-rows-[repeat(4,auto)_1fr] lg:items-start lg:gap-x-10">
      <UFormField
        class="lg:col-start-1"
        :label="t('label')"
        :error="showError ? t('invalid') : undefined">
        <UInput
          v-model="input"
          type="url"
          size="xl"
          autofocus
          class="w-full"
          icon="i-lucide-link"
          inputmode="url"
          autocomplete="off"
          autocapitalize="none"
          :placeholder="t('placeholder')"
          :aria-label="t('placeholder')">
          <template v-if="input" #trailing>
            <UButton
              variant="link"
              color="neutral"
              size="xs"
              icon="i-lucide-x"
              :aria-label="t('clear')"
              @click="input = ''" />
          </template>
        </UInput>
      </UFormField>

      <UCard
        data-qr
        class="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-5 lg:row-start-1">
        <div class="flex min-h-[200px] items-center justify-center">
          <div
            v-show="url"
            ref="qrContainer"
            class="w-full max-w-[400px] overflow-hidden rounded-lg [&>svg]:h-auto [&>svg]:w-full" />
          <div v-if="!url" class="text-muted flex flex-col items-center gap-2">
            <UIcon name="i-lucide-qr-code" class="size-16" />
            <p class="text-sm">{{ t('empty') }}</p>
          </div>
        </div>
      </UCard>

      <QrActions
        class="lg:col-start-1"
        :get-blob="getBlob"
        :filename="filename"
        :disabled="!url"
        @done="url && history.add(url)" />
      <QrCustomizer v-model="style" class="lg:col-start-1" :disabled="!url" />
      <UrlHistory
        class="lg:col-start-1"
        :entries="history.entries.value"
        @select="input = $event"
        @clear="history.clear()" />
    </div>

    <PwaInstallBanner />
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const history = useUrlHistory()

const input = ref(typeof route.query.url === 'string' ? route.query.url : '')
const style = ref<QrStyle>({ ...DEFAULT_QR_STYLE })
const qrContainer = ref<HTMLElement | null>(null)

const url = computed(() => normalizeUrl(input.value))
const showError = computed(() => input.value.trim() !== '' && !url.value)
const filename = computed(
  () => `codalink-${url.value ? new URL(url.value).hostname : 'qr'}`,
)

// Keep the address bar clean once the ?url= param has been consumed
if (route.query.url) router.replace({ query: {} })

const { getBlob } = useQrCode(qrContainer, url, style)
</script>

<i18n lang="yaml">
en:
  heading: 'Turn any link into a QR code'
  subheading: 'Paste a URL, tweak it, download or share.'
  label: 'URL to convert'
  placeholder: 'https://example.com'
  clear: 'Clear'
  invalid: 'Enter a valid web address (e.g. example.com).'
  empty: 'Your QR code will appear here'
fr:
  heading: "Transforme n'importe quel lien en QR code"
  subheading: 'Colle une URL, personnalise, télécharge ou partage.'
  label: 'URL à convertir'
  placeholder: 'https://exemple.com'
  clear: 'Effacer'
  invalid: 'Saisis une adresse web valide (ex. exemple.com).'
  empty: 'Ton QR code apparaîtra ici'
</i18n>
