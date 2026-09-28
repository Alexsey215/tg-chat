import { describe, expect, it } from 'vitest'
import { formatPhone, isValidPhone, normalizePhone } from './phone'

describe('normalizePhone', () => {
  it('оставляет только цифры', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it('меняет российскую восьмёрку на семёрку', () => {
    expect(normalizePhone('8 999 123 45 67')).toBe('79991234567')
  })

  it('не трогает другие номера из 11 цифр', () => {
    expect(normalizePhone('+1 202 555 0143')).toBe('12025550143')
  })
})

describe('isValidPhone', () => {
  it.each([
    ['79991234567', true],
    ['12025550143', true],
    ['12345', false],
    ['7999123456789012', false],
  ])('%s -> %s', (value, expected) => {
    expect(isValidPhone(value)).toBe(expected)
  })
})

describe('formatPhone', () => {
  it('форматирует российский номер', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
  })

  it('остальные показывает с плюсом', () => {
    expect(formatPhone('12025550143')).toBe('+12025550143')
  })
})
