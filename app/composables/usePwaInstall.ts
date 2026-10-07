import { useLocalStorage } from '@vueuse/core'

export type InstallMode = 'native' | 'ios' | null

/**
 * Decides whether (and how) to offer installing the app:
 * - `native`: Chromium-based browsers fired `beforeinstallprompt`
 * - `ios`: Safari on iOS has no install API, the user has to use the share sheet
 * Nothing is offered once installed (standalone) or after the user dismissed the hint.
 */
export function usePwaInstall() {
  const { $pwa } = useNuxtApp()
  const dismissed = useLocalStorage('codalink:install-dismissed', false)

  const isStandalone = computed(
    () =>
      import.meta.client &&
      (Boolean($pwa?.isPWAInstalled) ||
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone ===
          true),
  )

  const isIosSafari =
    import.meta.client &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !/crios|fxios|edgios/i.test(navigator.userAgent)

  const mode = computed<InstallMode>(() => {
    if (!import.meta.client || dismissed.value || isStandalone.value)
      return null
    if ($pwa?.showInstallPrompt) return 'native'
    return isIosSafari ? 'ios' : null
  })

  async function install() {
    await $pwa?.install()
  }

  function dismiss() {
    dismissed.value = true
    $pwa?.cancelInstall()
  }

  return { mode, install, dismiss }
}
