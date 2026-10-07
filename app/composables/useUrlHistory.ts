import { useLocalStorage } from '@vueuse/core'

const MAX_HISTORY_ENTRIES = 10

export function useUrlHistory() {
  const entries = useLocalStorage<string[]>('codalink:history', [])

  function add(url: string) {
    entries.value = [
      url,
      ...entries.value.filter((entry) => entry !== url),
    ].slice(0, MAX_HISTORY_ENTRIES)
  }

  function clear() {
    entries.value = []
  }

  return { entries, add, clear }
}
