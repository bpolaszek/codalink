import { describe, expect, it } from 'vitest'
import { normalizeUrl } from '../../app/utils/url'

describe('normalizeUrl', () => {
  it('keeps valid http(s) urls', () => {
    expect(normalizeUrl('https://example.com/a?b=1')).toBe(
      'https://example.com/a?b=1',
    )
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('prepends https:// to bare domains', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/')
    expect(normalizeUrl('  example.com/path  ')).toBe(
      'https://example.com/path',
    )
  })

  it('rejects empty, non-http and malformed input', () => {
    expect(normalizeUrl('')).toBeNull()
    expect(normalizeUrl('   ')).toBeNull()
    expect(normalizeUrl('javascript:alert(1)')).toBeNull()
    expect(normalizeUrl('ftp://example.com')).toBeNull()
    expect(normalizeUrl('not a url')).toBeNull()
    expect(normalizeUrl('localhost')).toBeNull()
  })
})
