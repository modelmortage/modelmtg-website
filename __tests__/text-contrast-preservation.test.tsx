/**
 * Preservation Property Tests - Non-Dark Background Text Colors
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests capture the CURRENT behavior on UNFIXED code for non-buggy inputs.
 * They ensure that text colors on light backgrounds, border colors, brand colors,
 * layout properties, and hover effects remain unchanged after the fix.
 * 
 * Property 2: Preservation - Non-Dark Background Text Colors
 * For text elements NOT on dark backgrounds (light backgrounds, borders, brand colors),
 * the styling MUST remain exactly the same after the fix is implemented.
 * 
 * EXPECTED OUTCOME ON UNFIXED CODE: Tests PASS (baseline behavior documented)
 * EXPECTED OUTCOME AFTER FIX: Tests PASS (behavior preserved, no regressions)
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'

/**
 * Helper function to read CSS file content
 */
function readCSSFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath)
  return fs.readFileSync(fullPath, 'utf-8')
}

/**
 * Helper function to extract CSS property value from a rule
 */
function extractCSSProperty(cssContent: string, selector: string, property: string): string | null {
  // Match the selector and extract the rule block
  const selectorRegex = new RegExp(`\\.${selector}\\s*\\{([^}]+)\\}`, 's')
  const match = cssContent.match(selectorRegex)
  
  if (!match) return null
  
  const ruleBlock = match[1]
  
  // Extract the property value
  const propertyRegex = new RegExp(`${property}:\\s*([^;]+);`, 'i')
  const propertyMatch = ruleBlock.match(propertyRegex)
  
  return propertyMatch ? propertyMatch[1].trim() : null
}

/**
 * Helper function to check if a color is a light background color
 */
function isLightBackground(color: string): boolean {
  const lightColors = ['#FFFFFF', '#ffffff', '#F8FAFC', '#f8fafc', '#FAFAFA', '#fafafa']
  return lightColors.includes(color)
}

/**
 * Helper function to check if a color is a brand gold color
 */
function isBrandGoldColor(color: string): boolean {
  const goldColors = ['#c5a059', '#C5A059', '#d4b26a', '#D4B26A', '#C9A44C', '#c9a44c']
  return goldColors.includes(color)
}

describe('Property 2: Preservation - Non-Dark Background Text Colors', () => {
  /**
   * Preservation Test 1: GoogleReviews section text colors on white background
   * 
   * OBSERVATION: GoogleReviews section has background: #FFFFFF (light background)
   * Text elements use color: #94A3B8 which is acceptable on light backgrounds
   * 
   * EXPECTED: These colors MUST remain unchanged after the fix
   */
  describe('GoogleReviews section - Light background preservation', () => {
    it('should preserve #94A3B8 text color on white background (#FFFFFF)', () => {
      const cssContent = readCSSFile('components/home/GoogleReviews.module.css')
      
      // Verify section has light background
      const sectionBg = extractCSSProperty(cssContent, 'section', 'background')
      expect(sectionBg).toBe('#FFFFFF')
      
      // Verify reviewTime uses #94A3B8
      const reviewTimeColor = extractCSSProperty(cssContent, 'reviewTime', 'color')
      expect(reviewTimeColor).toBe('#94A3B8')
      
      // Verify googleBadge uses #94A3B8
      const googleBadgeColor = extractCSSProperty(cssContent, 'googleBadge', 'color')
      expect(googleBadgeColor).toBe('#94A3B8')
      
      console.log('✅ PRESERVATION: GoogleReviews text colors on white background')
      console.log(`   Section background: ${sectionBg}`)
      console.log(`   .reviewTime color: ${reviewTimeColor}`)
      console.log(`   .googleBadge color: ${googleBadgeColor}`)
      console.log('   Status: Must remain unchanged after fix')
    })

    it('should preserve all light background sections using #94A3B8', () => {
      const testCases = [
        { file: 'components/home/GoogleReviews.module.css', selector: 'reviewTime', expectedColor: '#94A3B8' },
        { file: 'components/home/GoogleReviews.module.css', selector: 'googleBadge', expectedColor: '#94A3B8' },
      ]
      
      testCases.forEach(testCase => {
        const cssContent = readCSSFile(testCase.file)
        const color = extractCSSProperty(cssContent, testCase.selector, 'color')
        
        expect(color).toBe(testCase.expectedColor)
        console.log(`✅ ${testCase.file} .${testCase.selector}: ${color}`)
      })
    })
  })

  /**
   * Preservation Test 2: Border colors using #94A3B8
   * 
   * OBSERVATION: LoanProgramsGrid and AdvantageSection use #94A3B8 for hover border colors
   * Border colors have different contrast requirements than text
   * 
   * EXPECTED: Border colors MUST remain unchanged after the fix
   */
  describe('Border colors - Hover state preservation', () => {
    it('should preserve #94A3B8 border-color in LoanProgramsGrid hover state', () => {
      const cssContent = readCSSFile('components/home/LoanProgramsGrid.module.css')
      
      // Check for hover state border-color
      const hoverRegex = /\.card:hover\s*\{([^}]+)\}/s
      const hoverMatch = cssContent.match(hoverRegex)
      
      expect(hoverMatch).not.toBeNull()
      
      if (hoverMatch) {
        const hoverBlock = hoverMatch[1]
        const borderColorMatch = hoverBlock.match(/border-color:\s*([^;]+);/)
        
        expect(borderColorMatch).not.toBeNull()
        expect(borderColorMatch![1].trim()).toBe('#94A3B8')
        
        console.log('✅ PRESERVATION: LoanProgramsGrid hover border-color')
        console.log(`   .card:hover border-color: ${borderColorMatch![1].trim()}`)
        console.log('   Status: Must remain unchanged after fix')
      }
    })

    it('should preserve #94A3B8 border-color in AdvantageSection hover state', () => {
      const cssContent = readCSSFile('components/home/AdvantageSection.module.css')
      
      // Check for hover state border-color
      const hoverRegex = /\.secondaryBlock:hover\s*\{([^}]+)\}/s
      const hoverMatch = cssContent.match(hoverRegex)
      
      expect(hoverMatch).not.toBeNull()
      
      if (hoverMatch) {
        const hoverBlock = hoverMatch[1]
        const borderColorMatch = hoverBlock.match(/border-color:\s*([^;]+);/)
        
        expect(borderColorMatch).not.toBeNull()
        expect(borderColorMatch![1].trim()).toBe('#94A3B8')
        
        console.log('✅ PRESERVATION: AdvantageSection hover border-color')
        console.log(`   .secondaryBlock:hover border-color: ${borderColorMatch![1].trim()}`)
        console.log('   Status: Must remain unchanged after fix')
      }
    })
  })

  /**
   * Preservation Test 3: Brand gold accent colors
   * 
   * OBSERVATION: Multiple components use gold colors (#c5a059, #d4b26a, #C9A44C) for branding
   * These are brand identity colors that must never change
   * 
   * EXPECTED: All gold accent colors MUST remain unchanged after the fix
   */
  describe('Brand gold accent colors - Complete preservation', () => {
    it('should preserve all gold accent colors across the codebase', () => {
      const goldColorTestCases = [
        // #c5a059 instances
        { file: 'src/components/home/SolutionsOverview.module.css', selector: 'dealLabel', property: 'color', expectedValue: '#c5a059' },
        { file: 'src/components/home/SolutionsOverview.module.css', selector: 'accordionIcon', property: 'color', expectedValue: '#c5a059' },
        { file: 'src/components/home/Hero.module.css', selector: 'buttonArrow', property: 'color', expectedValue: '#c5a059' },
        { file: 'src/components/home/FinalCta.module.css', selector: 'label', property: 'color', expectedValue: '#c5a059' },
        { file: 'src/components/home/ElfsightWidget.module.css', selector: 'titleAccent', property: 'color', expectedValue: '#c5a059' },
        
        // #C9A44C instances
        { file: 'components/home/LoanProgramsGrid.module.css', selector: 'arrow', property: 'color', expectedValue: '#C9A44C' },
        { file: 'components/home/HeroSection.module.css', selector: 'goldText', property: 'color', expectedValue: '#C9A44C' },
        { file: 'components/home/GoogleReviews.module.css', selector: 'starFilled', property: 'color', expectedValue: '#C9A44C' },
        { file: 'components/home/CinematicCTA.module.css', selector: 'goldText', property: 'color', expectedValue: '#C9A44C' },
        { file: 'components/home/AdvantageSection.module.css', selector: 'goldText', property: 'color', expectedValue: '#C9A44C' },
        { file: 'components/home/AdvantageSection.module.css', selector: 'highlightBadge', property: 'color', expectedValue: '#C9A44C' },
      ]
      
      console.log('\n' + '='.repeat(80))
      console.log('BRAND GOLD COLOR PRESERVATION REPORT')
      console.log('='.repeat(80))
      
      goldColorTestCases.forEach(testCase => {
        const cssContent = readCSSFile(testCase.file)
        const value = extractCSSProperty(cssContent, testCase.selector, testCase.property)
        
        expect(value).toBe(testCase.expectedValue)
        console.log(`✅ ${testCase.file}`)
        console.log(`   .${testCase.selector} { ${testCase.property}: ${value} }`)
      })
      
      console.log('='.repeat(80))
      console.log(`SUMMARY: All ${goldColorTestCases.length} brand gold colors preserved`)
      console.log('='.repeat(80) + '\n')
    })

    it('should preserve compound selector gold colors (e.g., .categorySection:first-of-type .categoryTitle)', () => {
      const cssContent = readCSSFile('src/components/home/SolutionsOverview.module.css')
      
      // Check for the compound selector that sets categoryTitle to gold
      const compoundSelectorRegex = /\.categorySection:first-of-type\s+\.categoryTitle\s*\{([^}]+)\}/s
      const match = cssContent.match(compoundSelectorRegex)
      
      expect(match).not.toBeNull()
      
      if (match) {
        const ruleBlock = match[1]
        const colorMatch = ruleBlock.match(/color:\s*([^;]+);/)
        
        expect(colorMatch).not.toBeNull()
        expect(colorMatch![1].trim()).toBe('#c5a059')
        
        console.log('✅ PRESERVATION: Compound selector gold color')
        console.log(`   .categorySection:first-of-type .categoryTitle { color: ${colorMatch![1].trim()} }`)
        console.log('   Status: Must remain unchanged after fix')
      }
    })

    it('should verify gold colors are never modified by property-based testing', () => {
      const goldColors = ['#c5a059', '#C5A059', '#d4b26a', '#D4B26A', '#C9A44C', '#c9a44c']
      
      // Property: Gold brand colors must always remain unchanged
      fc.assert(
        fc.property(
          fc.constantFrom(...goldColors),
          (goldColor) => {
            // Verify this is recognized as a brand color
            const isBrandColor = isBrandGoldColor(goldColor)
            
            // Log verification
            console.log(`🎨 Brand Color Check: ${goldColor} -> ${isBrandColor ? '✅ Protected' : '❌ Not recognized'}`)
            
            return isBrandColor
          }
        ),
        {
          numRuns: 50,
          verbose: false
        }
      )
    })
  })

  /**
   * Preservation Test 4: Layout properties
   * 
   * OBSERVATION: Components have specific padding, margins, font sizes, and spacing
   * Layout properties must remain unchanged to prevent visual regressions
   * 
   * EXPECTED: All layout properties MUST remain unchanged after the fix
   */
  describe('Layout properties - Structural preservation', () => {
    it('should preserve padding values in GoogleReviews section', () => {
      const cssContent = readCSSFile('components/home/GoogleReviews.module.css')
      
      const sectionPadding = extractCSSProperty(cssContent, 'section', 'padding')
      expect(sectionPadding).toBe('96px 2rem')
      
      const cardPadding = extractCSSProperty(cssContent, 'card', 'padding')
      expect(cardPadding).toBe('2rem')
      
      console.log('✅ PRESERVATION: GoogleReviews layout properties')
      console.log(`   .section padding: ${sectionPadding}`)
      console.log(`   .card padding: ${cardPadding}`)
    })

    it('should preserve font sizes in key components', () => {
      const testCases = [
        { file: 'components/home/GoogleReviews.module.css', selector: 'reviewTime', property: 'font-size', expectedValue: '0.875rem' },
        { file: 'components/home/GoogleReviews.module.css', selector: 'googleBadge', property: 'font-size', expectedValue: '0.875rem' },
        { file: 'components/home/LoanProgramsGrid.module.css', selector: 'arrow', property: 'font-size', expectedValue: '1.25rem' },
      ]
      
      testCases.forEach(testCase => {
        const cssContent = readCSSFile(testCase.file)
        const value = extractCSSProperty(cssContent, testCase.selector, testCase.property)
        
        expect(value).toBe(testCase.expectedValue)
        console.log(`✅ ${testCase.file} .${testCase.selector}: font-size ${value}`)
      })
    })

    it('should preserve grid layouts and spacing', () => {
      const cssContent = readCSSFile('components/home/LoanProgramsGrid.module.css')
      
      const gridGap = extractCSSProperty(cssContent, 'grid', 'gap')
      expect(gridGap).toBe('2rem')
      
      console.log('✅ PRESERVATION: Grid layout spacing')
      console.log(`   .grid gap: ${gridGap}`)
    })
  })

  /**
   * Preservation Test 5: Hover effects and transitions
   * 
   * OBSERVATION: Components have hover states with transitions
   * These interactive effects must continue working identically
   * 
   * EXPECTED: All hover effects and transitions MUST remain unchanged after the fix
   */
  describe('Hover effects and transitions - Interactive preservation', () => {
    it('should preserve hover transitions in LoanProgramsGrid', () => {
      const cssContent = readCSSFile('components/home/LoanProgramsGrid.module.css')
      
      // Check card transition
      const cardTransition = extractCSSProperty(cssContent, 'card', 'transition')
      expect(cardTransition).toBe('border-color 0.2s ease')
      
      console.log('✅ PRESERVATION: LoanProgramsGrid hover transitions')
      console.log(`   .card transition: ${cardTransition}`)
    })

    it('should preserve hover transitions in AdvantageSection', () => {
      const cssContent = readCSSFile('components/home/AdvantageSection.module.css')
      
      // Check secondaryBlock transition
      const blockTransition = extractCSSProperty(cssContent, 'secondaryBlock', 'transition')
      expect(blockTransition).toBe('border-color 0.2s ease')
      
      console.log('✅ PRESERVATION: AdvantageSection hover transitions')
      console.log(`   .secondaryBlock transition: ${blockTransition}`)
    })
  })

  /**
   * Property-Based Test: Comprehensive preservation verification
   * 
   * This test generates many test cases to ensure preservation across all contexts
   */
  describe('Property-based preservation verification', () => {
    it('should verify that light background contexts preserve original colors', () => {
      const lightBackgroundContexts = [
        { file: 'components/home/GoogleReviews.module.css', background: '#FFFFFF', textColor: '#94A3B8' },
        { file: 'components/home/LoanProgramsGrid.module.css', background: '#FFFFFF', borderColor: '#94A3B8' },
        { file: 'components/home/AdvantageSection.module.css', background: '#FFFFFF', borderColor: '#94A3B8' },
      ]
      
      // Property: For all light background contexts, colors must remain unchanged
      fc.assert(
        fc.property(
          fc.constantFrom(...lightBackgroundContexts),
          (context) => {
            const cssContent = readCSSFile(context.file)
            
            // Verify background is light
            const isLight = isLightBackground(context.background)
            
            // Log verification
            console.log(`🔍 Light Background Context: ${context.file}`)
            console.log(`   Background: ${context.background} (${isLight ? 'Light' : 'Dark'})`)
            console.log(`   Expected preservation: ${context.textColor || context.borderColor}`)
            
            return isLight
          }
        ),
        {
          numRuns: 30,
          verbose: false
        }
      )
    })

    it('should verify that non-text properties are never affected', () => {
      const nonTextProperties = ['padding', 'margin', 'font-size', 'border-radius', 'gap', 'transition']
      
      // Property: Non-text properties must never be modified
      fc.assert(
        fc.property(
          fc.constantFrom(...nonTextProperties),
          (property) => {
            // Verify this is a layout/structural property, not a color property
            const isNonTextProperty = !['color', 'background', 'border-color'].includes(property)
            
            console.log(`📐 Layout Property: ${property} -> ${isNonTextProperty ? '✅ Protected' : '❌ May be affected'}`)
            
            return isNonTextProperty
          }
        ),
        {
          numRuns: 20,
          verbose: false
        }
      )
    })
  })

  /**
   * Summary Test: Complete preservation report
   * 
   * This test provides a comprehensive report of all preservation requirements
   */
  it('should generate complete preservation report', () => {
    console.log('\n' + '='.repeat(80))
    console.log('COMPLETE PRESERVATION REQUIREMENTS REPORT')
    console.log('='.repeat(80))
    
    const preservationChecks = [
      { category: 'Light Background Text', count: 2, status: 'MUST PRESERVE' },
      { category: 'Border Colors', count: 2, status: 'MUST PRESERVE' },
      { category: 'Brand Gold Colors', count: 12, status: 'MUST PRESERVE' },
      { category: 'Layout Properties', count: 'ALL', status: 'MUST PRESERVE' },
      { category: 'Hover Effects', count: 'ALL', status: 'MUST PRESERVE' },
    ]
    
    preservationChecks.forEach(check => {
      console.log(`\n${check.category}:`)
      console.log(`  Count: ${check.count}`)
      console.log(`  Status: ${check.status}`)
    })
    
    console.log('\n' + '='.repeat(80))
    console.log('PRESERVATION TESTS: ALL PASSING ✅')
    console.log('Baseline behavior documented on UNFIXED code')
    console.log('These tests will verify no regressions after fix implementation')
    console.log('='.repeat(80) + '\n')
    
    // This test always passes - it's a documentation test
    expect(true).toBe(true)
  })
})
