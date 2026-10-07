import type { Options } from 'qr-code-styling'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import {
  DEFAULT_QR_STYLE,
  useQrCode,
  type QrStyle,
} from '../../app/composables/useQrCode'

// Records every instance so tests can assert what the preview is told to render
const instances: FakeQrCode[] = []

class FakeQrCode {
  updates: Options[] = []
  appended: unknown[] = []
  constructor(public options: Options) {
    instances.push(this)
  }
  update(options: Options) {
    this.updates.push(options)
    this.options = options
  }
  append(el: unknown) {
    this.appended.push(el)
  }
  getRawData = vi.fn(async () => new Blob(['qr']))
}

vi.mock('qr-code-styling', () => ({ default: FakeQrCode }))

const fakeContainer = () =>
  ({ replaceChildren: vi.fn() }) as unknown as HTMLElement

// Lets the lazy `import('qr-code-styling')` and the watcher flush settle
const settle = async () => {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

function setup(initialUrl: string | null = 'https://example.com/') {
  const container = ref<HTMLElement | null>(fakeContainer())
  const data = ref<string | null>(initialUrl)
  const style = ref<QrStyle>({ ...DEFAULT_QR_STYLE })
  const qr = useQrCode(container, data, style)
  return { container, data, style, qr }
}

const lastOptions = () => {
  const instance = instances.at(-1)!
  return instance.updates.at(-1) ?? instance.options
}

describe('useQrCode preview', () => {
  beforeEach(() => {
    instances.length = 0
  })

  it('renders the QR code once with the default style', async () => {
    const { container } = setup()
    await settle()

    expect(instances).toHaveLength(1)
    expect(instances[0]!.appended).toEqual([container.value])
    expect(lastOptions()).toMatchObject({
      data: 'https://example.com/',
      dotsOptions: { color: '#000000', type: 'square' },
      backgroundOptions: { color: '#ffffff' },
    })
  })

  // Regression: when the URL is set once (prefilled via ?url= or pasted), no later
  // change of the URL re-runs the watcher, so style changes were silently ignored.
  it.each([
    [
      'code color',
      (style: QrStyle) => (style.color = '#ff0000'),
      { dotsOptions: { color: '#ff0000' } },
    ],
    [
      'background',
      (style: QrStyle) => (style.background = '#ffff00'),
      { backgroundOptions: { color: '#ffff00' } },
    ],
    [
      'module style',
      (style: QrStyle) => (style.dotsType = 'dots'),
      { dotsOptions: { type: 'dots' } },
    ],
  ])(
    'applies a %s change made after the first render',
    async (_label, mutate, expected) => {
      const { style } = setup()
      await settle()

      mutate(style.value)
      await settle()

      expect(instances).toHaveLength(1)
      expect(instances[0]!.updates.length).toBeGreaterThan(0)
      expect(lastOptions()).toMatchObject(expected)
    },
  )

  it('applies a style replaced as a whole (reset button)', async () => {
    const { style } = setup()
    await settle()
    style.value.color = '#ff0000'
    await settle()

    style.value = { ...DEFAULT_QR_STYLE }
    await settle()

    expect(lastOptions()).toMatchObject({ dotsOptions: { color: '#000000' } })
  })

  it('applies a new URL', async () => {
    const { data } = setup()
    await settle()

    data.value = 'https://nuxt.com/'
    await settle()

    expect(lastOptions()).toMatchObject({ data: 'https://nuxt.com/' })
  })

  it('keeps applying style changes after the URL was cleared and typed again', async () => {
    const { data, style, container } = setup()
    await settle()

    data.value = null
    await settle()
    expect(container.value!.replaceChildren).toHaveBeenCalled()

    data.value = 'https://example.com/'
    await settle()
    style.value.color = '#00ff00'
    await settle()

    expect(lastOptions()).toMatchObject({ dotsOptions: { color: '#00ff00' } })
  })

  it('renders nothing while there is no valid URL', async () => {
    setup(null)
    await settle()

    expect(instances).toHaveLength(0)
  })

  it('updates the preview exactly once per style change', async () => {
    const { style } = setup()
    await settle()

    style.value.color = '#ff0000'
    await settle()

    expect(instances[0]!.updates).toHaveLength(1)
  })
})

describe('useQrCode export', () => {
  beforeEach(() => {
    instances.length = 0
  })

  it('exports a high-resolution PNG with the current style, independent from the preview', async () => {
    const { style, qr } = setup()
    await settle()
    style.value.color = '#ff0000'
    await settle()

    await qr.getBlob('png')

    const exporter = instances.at(-1)!
    expect(instances).toHaveLength(2)
    expect(exporter.options).toMatchObject({
      type: 'canvas',
      width: 1024,
      height: 1024,
      dotsOptions: { color: '#ff0000' },
    })
    expect(exporter.getRawData).toHaveBeenCalledWith('png')
  })

  it('exports an SVG', async () => {
    const { qr } = setup()
    await settle()

    await qr.getBlob('svg')

    expect(instances.at(-1)!.options).toMatchObject({ type: 'svg' })
    expect(instances.at(-1)!.getRawData).toHaveBeenCalledWith('svg')
  })

  it('refuses to export without data', async () => {
    const { qr } = setup(null)

    await expect(qr.getBlob('png')).rejects.toThrow('No data to encode')
  })
})
