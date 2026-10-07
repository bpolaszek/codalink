import type { DotType, Options } from 'qr-code-styling'

export type QrFormat = 'png' | 'svg'

export interface QrStyle {
  color: string
  background: string
  dotsType: DotType
}

export const DEFAULT_QR_STYLE: QrStyle = {
  color: '#000000',
  background: '#ffffff',
  dotsType: 'square',
}

const PREVIEW_SIZE = 400
const EXPORT_SIZE = 1024

function buildOptions(data: string, style: QrStyle, size: number): Options {
  return {
    width: size,
    height: size,
    type: 'svg',
    data,
    margin: 0,
    qrOptions: { errorCorrectionLevel: 'M' },
    dotsOptions: { color: style.color, type: style.dotsType },
    cornersSquareOptions: {
      color: style.color,
      type: style.dotsType === 'square' ? 'square' : 'extra-rounded',
    },
    cornersDotOptions: { color: style.color },
    backgroundOptions: { color: style.background },
  }
}

/**
 * Renders a live QR code into `container` and exposes a high-resolution export.
 * qr-code-styling touches the DOM, so it is loaded lazily on the client only.
 */
export function useQrCode(
  container: Ref<HTMLElement | null>,
  data: Ref<string | null>,
  style: Ref<QrStyle>,
) {
  let preview: InstanceType<typeof import('qr-code-styling').default> | null =
    null

  watchEffect(async () => {
    const el = container.value
    const value = data.value
    const currentStyle = style.value
    if (!el || !value) {
      if (el) el.replaceChildren()
      preview = null
      return
    }
    if (preview) {
      preview.update(buildOptions(value, currentStyle, PREVIEW_SIZE))
      return
    }
    const { default: QRCodeStyling } = await import('qr-code-styling')
    preview = new QRCodeStyling(buildOptions(value, currentStyle, PREVIEW_SIZE))
    el.replaceChildren()
    preview.append(el)
  })

  async function getBlob(format: QrFormat): Promise<Blob> {
    if (!data.value) throw new Error('No data to encode')
    const { default: QRCodeStyling } = await import('qr-code-styling')
    const exporter = new QRCodeStyling({
      ...buildOptions(data.value, style.value, EXPORT_SIZE),
      type: format === 'png' ? 'canvas' : 'svg',
    })
    const raw = await exporter.getRawData(format)
    if (!raw) throw new Error('QR export failed')
    return raw as Blob
  }

  return { getBlob }
}
