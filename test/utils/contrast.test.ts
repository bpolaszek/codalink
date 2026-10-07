import { describe, expect, it } from 'vitest'
import { contrastRatio, isScannable } from '../../app/utils/contrast'

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for identical colors', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5)
  })
})

describe('isScannable', () => {
  it('accepts dark on light with enough contrast', () => {
    expect(isScannable('#000000', '#ffffff')).toBe(true)
    expect(isScannable('#4f46e5', '#ffffff')).toBe(true)
  })

  it('rejects low contrast', () => {
    expect(isScannable('#cccccc', '#ffffff')).toBe(false)
  })

  it('rejects inverted codes (light modules on dark background)', () => {
    expect(isScannable('#ffffff', '#000000')).toBe(false)
  })
})
