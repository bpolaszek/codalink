const ALLOWED_PROTOCOLS = ['http:', 'https:']

/**
 * Turns free user input into a canonical http(s) URL, or null if unusable.
 * Bare domains ("example.com") get an https:// prefix.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const hasScheme =
    /^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^[^/]+:\d+(\/|$)/.test(trimmed)
  const candidate = hasScheme ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(candidate)
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return null
    // Require a dot in the host: rejects "localhost" and "not a url"
    if (!url.hostname.includes('.')) return null
    return url.toString()
  } catch {
    return null
  }
}
