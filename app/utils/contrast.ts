const MIN_SCANNABLE_RATIO = 3

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(value.slice(i, i + 2), 16) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two #rrggbb colors (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  ) as [number, number]
  return (lighter + 0.05) / (darker + 0.05)
}

/** Many readers fail on inverted codes or low contrast: modules must be darker than the background. */
export function isScannable(foreground: string, background: string): boolean {
  return (
    relativeLuminance(foreground) < relativeLuminance(background) &&
    contrastRatio(foreground, background) >= MIN_SCANNABLE_RATIO
  )
}
