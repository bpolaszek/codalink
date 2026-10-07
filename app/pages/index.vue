<template>
  <main class="mx-auto w-full max-w-xl space-y-6 px-4 pb-12">
    <div class="space-y-1 text-center">
      <h1 class="text-2xl font-bold sm:text-3xl">{{ t('heading') }}</h1>
      <p class="text-muted">{{ t('subheading') }}</p>
    </div>

    <UFormField :error="showError ? t('invalid') : undefined">
      <UInput
        v-model="input"
        type="url"
        size="xl"
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

    <UCard>
      <div class="flex min-h-[280px] items-center justify-center">
        <div
          v-show="url"
          ref="qrContainer"
          class="flex size-[280px] max-w-full items-center justify-center overflow-hidden rounded-lg [&>svg]:max-w-full" />
        <div v-if="!url" class="text-muted flex flex-col items-center gap-2">
          <UIcon name="i-lucide-qr-code" class="size-16" />
          <p class="text-sm">{{ t('empty') }}</p>
        </div>
      </div>
    </UCard>

    <template v-if="url">
      <QrActions
        :get-blob="getBlob"
        :filename="filename"
        @done="history.add(url)" />
    </template>
    <QrCustomizer v-model="style" />
    <UrlHistory
      :entries="history.entries.value"
      @select="input = $event"
      @clear="history.clear()" />
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
  placeholder: 'https://example.com'
  clear: 'Clear'
  invalid: 'Enter a valid web address (e.g. example.com).'
  empty: 'Your QR code will appear here'
fr:
  heading: "Transforme n'importe quel lien en QR code"
  subheading: 'Colle une URL, personnalise, télécharge ou partage.'
  placeholder: 'https://exemple.com'
  clear: 'Effacer'
  invalid: 'Saisis une adresse web valide (ex. exemple.com).'
  empty: 'Ton QR code apparaîtra ici'
</i18n>
