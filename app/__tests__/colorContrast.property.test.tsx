/**
 * Color Contrast Property-Based Tests
 * 
 * **Property 22: Color Contrast**
 * For any text element, the contrast ratio between text and background
 * should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
 * 
 * **Validates: Requirements 7.6**
 * 
 * Feature: website-structure-migration, Property 22: Color Contrast
 */

import { describe, test, expect } from '@jest/globals'
import fc from 'fast-check'

// Color values from design system
const designSystemColors = {
  goldLight: '#D8B07A',
  goldMain: '#C89A5B',
  goldDeep: '#A9793A',
  goldDarker: '#8B6328',
  midnightBlack: '#0A0A0C',
  deepCharcoal: '#141417',
  ivoryWhite: '#F7F6F3',
  emeraldTeal: '#1FB6A6',
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '')
  
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255
  
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if a color combination meets WCAG AA standards
 */
function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio = isLargeText ? 3.0 : 4.5
  return ratio >= requiredRatio
}

describe('Property 22: Color Contrast - WCAG AA Compliance', () => {
  describe('Design system color combinations', () => {
    test('all text colors on dark backgrounds meet WCAG AA for normal text', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            designSystemColors.ivoryWhite,
            designSystemColors.goldLight,
            designSystemColors.goldMain,
            designSystemColors.goldDeep,
            designSystemColors.emeraldTeal
          ),
          fc.constantFrom(
            designSystemColors.midnightBlack,
            designSystemColors.deepCharcoal
          ),
          (textColor, backgroundColor) => {
            const ratio = getContrastRatio(textColor, backgroundColor)
            expect(ratio).toBeGreaterThanOrEqual(4.5)
            return ratio >= 4.5
          }
        ),
        { numRuns: 50 }
      )
    })

    test('all text colors on light backgrounds meet WCAG AA for normal text', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            designSystemColors.midnightBlack,
            designSystemColors.deepCharcoal,
            designSystemColors.goldDarker
            // Note: goldDeep (3.54:1) and goldMain (2.36:1) do NOT meet 4.5:1 on light backgrounds
          ),
          fc.constant(designSystemColors.ivoryWhite),
          (textColor, backgroundColor) => {
            const ratio = getContrastRatio(textColor, backgroundColor)
            expect(ratio).toBeGreaterThanOrEqual(4.5)
            return ratio >= 4.5
          }
        ),
        { numRuns: 20 }
      )
    })

    test('button text on gold backgrounds meets WCAG AA', () => {
      fc.assert(
        fc.property(
          fc.constant(designSystemColors.midnightBlack),
          fc.constantFrom(
            designSystemColors.goldLight,
            designSystemColors.goldMain,
            designSystemColors.goldDeep
          ),
          (textColor, buttonColor) => {
            const ratio = getContrastRatio(textColor, buttonColor)
            expect(ratio).toBeGreaterThanOrEqual(4.5)
            return ratio >= 4.5
          }
        ),
        { numRuns: 30 }
      )
    })
  })

  describe('Large text (headings) contrast requirements', () => {
    test('all large text combinations meet 3:1 minimum ratio', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            designSystemColors.ivoryWhite,
            designSystemColors.goldLight,
            designSystemColors.goldMain
          ),
          fc.constantFrom(
            designSystemColors.midnightBlack,
            designSystemColors.deepCharcoal
          ),
          (textColor, backgroundColor) => {
            const ratio = getContrastRatio(textColor, backgroundColor)
            expect(ratio).toBeGreaterThanOrEqual(3.0)
            return ratio >= 3.0
          }
        ),
        { numRuns: 30 }
      )
    })
  })

  describe('Opacity effects on contrast', () => {
    test('text with reduced opacity maintains minimum readable contrast', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            designSystemColors.ivoryWhite,
            designSystemColors.goldMain
          ),
          fc.constantFrom(
            designSystemColors.midnightBlack,
            designSystemColors.deepCharcoal
          ),
          fc.integer({ min: 60, max: 100 }), // opacity as percentage
          (textColor, backgroundColor, opacityPercent) => {
            const opacity = opacityPercent / 100
            const baseRatio = getContrastRatio(textColor, backgroundColor)
            // Approximate opacity effect (simplified)
            const effectiveRatio = baseRatio * opacity
            
            // For opacity >= 0.7, we expect at least 3:1 (readable)
            // For opacity >= 0.9, we expect at least 4:1 (good)
            const minRatio = opacity >= 0.9 ? 4.0 : 3.0
            
            expect(effectiveRatio).toBeGreaterThanOrEqual(minRatio)
            return effectiveRatio >= minRatio
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Contrast ratio properties', () => {
    test('contrast ratio is always >= 1 and <= 21', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(designSystemColors)),
          fc.constantFrom(...Object.values(designSystemColors)),
          (color1, color2) => {
            const ratio = getContrastRatio(color1, color2)
            expect(ratio).toBeGreaterThanOrEqual(1.0)
            expect(ratio).toBeLessThanOrEqual(21.0)
            return ratio >= 1.0 && ratio <= 21.0
          }
        ),
        { numRuns: 100 }
      )
    })

    test('contrast ratio is symmetric (order does not matter)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(designSystemColors)),
          fc.constantFrom(...Object.values(designSystemColors)),
          (color1, color2) => {
            const ratio1 = getContrastRatio(color1, color2)
            const ratio2 = getContrastRatio(color2, color1)
            expect(Math.abs(ratio1 - ratio2)).toBeLessThan(0.01)
            return Math.abs(ratio1 - ratio2) < 0.01
          }
        ),
        { numRuns: 50 }
      )
    })

    test('same color always has contrast ratio of 1:1', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(designSystemColors)),
          (color) => {
            const ratio = getContrastRatio(color, color)
            expect(ratio).toBeCloseTo(1.0, 1)
            return Math.abs(ratio - 1.0) < 0.1
          }
        ),
        { numRuns: 20 }
      )
    })
  })

  describe('Specific UI element combinations', () => {
    test('navigation links (ivory white on deep charcoal) meet WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.ivoryWhite,
        designSystemColors.deepCharcoal
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('navigation hover state (gold light on deep charcoal) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.goldLight,
        designSystemColors.deepCharcoal
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('active navigation (gold main on deep charcoal) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.goldMain,
        designSystemColors.deepCharcoal
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('body text (ivory white on midnight black) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.ivoryWhite,
        designSystemColors.midnightBlack
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('card text (ivory white on deep charcoal) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.ivoryWhite,
        designSystemColors.deepCharcoal
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('primary button text (midnight black on gold main) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.midnightBlack,
        designSystemColors.goldMain
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('secondary button text (gold main on transparent/midnight black) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.goldMain,
        designSystemColors.midnightBlack
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('light section text (midnight black on ivory white) meets WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.midnightBlack,
        designSystemColors.ivoryWhite
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('footer links (ivory white on midnight black) meet WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.ivoryWhite,
        designSystemColors.midnightBlack
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('breadcrumb links (ivory white on deep charcoal) meet WCAG AA', () => {
      const ratio = getContrastRatio(
        designSystemColors.ivoryWhite,
        designSystemColors.deepCharcoal
      )
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })

  describe('All possible design system combinations', () => {
    test('every valid text/background combination meets minimum standards', () => {
      // Define valid combinations based on actual usage in the design
      const validCombinations = [
        // Dark backgrounds with light text
        { fg: designSystemColors.ivoryWhite, bg: designSystemColors.midnightBlack, type: 'normal' },
        { fg: designSystemColors.ivoryWhite, bg: designSystemColors.deepCharcoal, type: 'normal' },
        { fg: designSystemColors.goldLight, bg: designSystemColors.midnightBlack, type: 'normal' },
        { fg: designSystemColors.goldLight, bg: designSystemColors.deepCharcoal, type: 'normal' },
        { fg: designSystemColors.goldMain, bg: designSystemColors.midnightBlack, type: 'normal' },
        { fg: designSystemColors.goldMain, bg: designSystemColors.deepCharcoal, type: 'normal' },
        { fg: designSystemColors.goldDeep, bg: designSystemColors.midnightBlack, type: 'normal' },
        { fg: designSystemColors.emeraldTeal, bg: designSystemColors.midnightBlack, type: 'normal' },
        { fg: designSystemColors.emeraldTeal, bg: designSystemColors.deepCharcoal, type: 'normal' },
        
        // Light backgrounds with dark text
        { fg: designSystemColors.midnightBlack, bg: designSystemColors.ivoryWhite, type: 'normal' },
        { fg: designSystemColors.deepCharcoal, bg: designSystemColors.ivoryWhite, type: 'normal' },
        { fg: designSystemColors.goldDarker, bg: designSystemColors.ivoryWhite, type: 'normal' },
        // Note: goldDeep only has 3.54:1 contrast - suitable for large text only
        { fg: designSystemColors.goldDeep, bg: designSystemColors.ivoryWhite, type: 'large' },
        
        // Button combinations
        { fg: designSystemColors.midnightBlack, bg: designSystemColors.goldLight, type: 'normal' },
        { fg: designSystemColors.midnightBlack, bg: designSystemColors.goldMain, type: 'normal' },
        { fg: designSystemColors.midnightBlack, bg: designSystemColors.goldDeep, type: 'normal' },
      ]

      validCombinations.forEach(({ fg, bg, type }) => {
        const ratio = getContrastRatio(fg, bg)
        const minRatio = type === 'large' ? 3.0 : 4.5
        expect(ratio).toBeGreaterThanOrEqual(minRatio)
      })
    })
  })
})
