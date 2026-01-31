// Unit tests for formatting utility functions

import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  parseCurrencyInput,
  parsePercentageInput,
} from '../formatters'

describe('formatCurrency', () => {
  it('should format positive numbers as currency with no decimals by default', () => {
    expect(formatCurrency(1234)).toBe('$1,234')
    expect(formatCurrency(1000000)).toBe('$1,000,000')
  })

  it('should format currency with specified decimal places', () => {
    expect(formatCurrency(1234.56, 2)).toBe('$1,234.56')
    expect(formatCurrency(1234.5, 2)).toBe('$1,234.50')
  })

  it('should handle zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0')
    expect(formatCurrency(0, 2)).toBe('$0.00')
  })

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1234)).toBe('-$1,234')
    expect(formatCurrency(-1234.56, 2)).toBe('-$1,234.56')
  })

  it('should handle very large numbers', () => {
    expect(formatCurrency(999999999)).toBe('$999,999,999')
  })

  it('should handle very small numbers', () => {
    expect(formatCurrency(0.01, 2)).toBe('$0.01')
    expect(formatCurrency(0.99, 2)).toBe('$0.99')
  })
})

describe('formatPercentage', () => {
  it('should format decimal values as percentages with 2 decimals by default', () => {
    expect(formatPercentage(0.05)).toBe('5.00%')
    expect(formatPercentage(0.1)).toBe('10.00%')
    expect(formatPercentage(0.075)).toBe('7.50%')
  })

  it('should format percentages with specified decimal places', () => {
    expect(formatPercentage(0.05, 1)).toBe('5.0%')
    expect(formatPercentage(0.05, 3)).toBe('5.000%')
    expect(formatPercentage(0.05, 0)).toBe('5%')
  })

  it('should handle zero correctly', () => {
    expect(formatPercentage(0)).toBe('0.00%')
    expect(formatPercentage(0, 1)).toBe('0.0%')
  })

  it('should handle values greater than 1', () => {
    expect(formatPercentage(1)).toBe('100.00%')
    expect(formatPercentage(1.5)).toBe('150.00%')
  })

  it('should handle negative percentages', () => {
    expect(formatPercentage(-0.05)).toBe('-5.00%')
  })

  it('should handle very small percentages', () => {
    expect(formatPercentage(0.001)).toBe('0.10%')
    expect(formatPercentage(0.0001, 4)).toBe('0.0100%')
  })
})

describe('formatNumber', () => {
  it('should format numbers with commas and no decimals by default', () => {
    expect(formatNumber(1234)).toBe('1,234')
    expect(formatNumber(1000000)).toBe('1,000,000')
  })

  it('should format numbers with specified decimal places', () => {
    expect(formatNumber(1234.56, 2)).toBe('1,234.56')
    expect(formatNumber(1234.5, 2)).toBe('1,234.50')
    expect(formatNumber(1234.567, 2)).toBe('1,234.57')
  })

  it('should handle zero correctly', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(0, 2)).toBe('0.00')
  })

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234')
    expect(formatNumber(-1234.56, 2)).toBe('-1,234.56')
  })

  it('should round numbers correctly', () => {
    expect(formatNumber(1234.555, 2)).toBe('1,234.56')
    expect(formatNumber(1234.554, 2)).toBe('1,234.55')
  })

  it('should handle numbers less than 1', () => {
    expect(formatNumber(0.5, 2)).toBe('0.50')
    expect(formatNumber(0.123, 3)).toBe('0.123')
  })
})

describe('parseCurrencyInput', () => {
  it('should remove non-numeric characters except decimal', () => {
    expect(parseCurrencyInput('$1,234.56')).toBe('1234.56')
    expect(parseCurrencyInput('1,000,000')).toBe('1000000')
  })

  it('should preserve decimal points', () => {
    expect(parseCurrencyInput('123.45')).toBe('123.45')
    expect(parseCurrencyInput('0.99')).toBe('0.99')
  })

  it('should handle strings with only numbers', () => {
    expect(parseCurrencyInput('1234')).toBe('1234')
  })

  it('should handle empty strings', () => {
    expect(parseCurrencyInput('')).toBe('')
  })

  it('should remove letters and special characters', () => {
    expect(parseCurrencyInput('abc123def')).toBe('123')
    expect(parseCurrencyInput('$1,234.56!')).toBe('1234.56')
  })
})

describe('parsePercentageInput', () => {
  it('should remove non-numeric characters except decimal', () => {
    expect(parsePercentageInput('5.5%')).toBe('5.5')
    expect(parsePercentageInput('10%')).toBe('10')
  })

  it('should preserve decimal points', () => {
    expect(parsePercentageInput('7.25')).toBe('7.25')
  })

  it('should handle strings with only numbers', () => {
    expect(parsePercentageInput('15')).toBe('15')
  })

  it('should handle empty strings', () => {
    expect(parsePercentageInput('')).toBe('')
  })

  it('should remove letters and special characters', () => {
    expect(parsePercentageInput('abc5.5def')).toBe('5.5')
  })
})
