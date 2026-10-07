<template>
  <section v-if="entries.length" class="space-y-2">
    <div class="flex items-center justify-between">
      <h2 class="text-muted text-sm font-medium">{{ t('title') }}</h2>
      <UButton
        size="xs"
        variant="link"
        color="neutral"
        :label="t('clear')"
        @click="emit('clear')" />
    </div>
    <ul class="flex flex-wrap gap-2">
      <li v-for="entry in entries" :key="entry" class="max-w-full">
        <UButton
          size="xs"
          variant="soft"
          color="neutral"
          class="max-w-full"
          @click="emit('select', entry)">
          <span class="truncate">{{ entry.replace(/^https?:\/\//, '') }}</span>
        </UButton>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{ entries: string[] }>()
const emit = defineEmits<{ select: [url: string]; clear: [] }>()
const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  title: 'Recent'
  clear: 'Clear'
fr:
  title: 'Récents'
  clear: 'Effacer'
</i18n>
