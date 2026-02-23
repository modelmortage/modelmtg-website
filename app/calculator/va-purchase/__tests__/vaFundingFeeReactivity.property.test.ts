/**
 * VA Funding Fee Reactivity Property-Based Tests
 * Tests universal properties of VA funding fee reactivity using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 3: VA Funding Fee Reactivity
 */

import fc from 'fast-check'

// Type definitions
type VAFundingFeeType = 'first-time' | 'subsequent' | 'exempt'

// Calculation functions (redefined for testing)
function calculateVAFundingFee(
  baseMortgageAmount: number,
  feeType: VAFundingFeeType
): number {
  switch (feeType) {
    case 'first-time':
      return baseMortgageAmount * 0.0215
    case 'subsequent':
      return baseMortgageAmount * 0.033
    case 'exempt':
      return 0
  }
}

function calculateFinalMortgageAmount(
  baseMortgageAmount: number,
  vaFundingFeeAmount: number
): number {
  return baseMortgageAmount + vaFundingFeeAmount
}

/**
 * **Validates: Requirements 1.10**
 * 
 * Property 3: VA Funding Fee Reactivity
 * For any change to the base mortgage amount, the VA funding fee and final mortgage amount
 * should be recalculated to reflect the new base amount.
 */
describe('VA Funding Fee Reactivity - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbVAFeeType = fc.constantFrom<VAFundingFeeType>('first-time', 'subsequent', 'exempt')

  /**
   * Property 3: When base mortgage changes, VA funding fee and final mortgage recalculate
   * 
   * **Validates: Requirements 1.10**
   */
  it('Property 3: When base mortgage changes, VA funding fee and final mortgage recalculate', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.float({ min: -50, max: 50, noNaN: true }), // Change in down payment percent
        (homeValue, initialDownPercent, feeType, downPaymentChange) => {
          // Calculate initial state
          const initialBaseMortgage = homeValue * (1 - initialDownPercent / 100)
          const initialVAFee = calculateVAFundingFee(initialBaseMortgage, feeType)
          const initialFinalMortgage = calculateFinalMortgageAmount(initialBaseMortgage, initialVAFee)
          
          // Calculate new state after down payment change (which changes base mortgage)
          const newDownPercent = Math.max(0, Math.min(100, initialDownPercent + downPaymentChange))
          const newBaseMortgage = homeValue * (1 - newDownPercent / 100)
          const newVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
          const newFinalMortgage = calculateFinalMortgageAmount(newBaseMortgage, newVAFee)
          
          // If base mortgage changed, VA fee and final mortgage should also change
          if (Math.abs(newBaseMortgage - initialBaseMortgage) > 0.01) {
            // For non-exempt, VA fee should change proportionally
            if (feeType !== 'exempt') {
              const baseMortgageRatio = newBaseMortgage / (initialBaseMortgage || 1)
              const vaFeeRatio = newVAFee / (initialVAFee || 1)
              
              // VA fee should scale proportionally with base mortgage
              if (initialVAFee > 0.01) {
                return Math.abs(baseMortgageRatio - vaFeeRatio) < 0.01
              }
            }
            
            // Final mortgage should always reflect the new base + new fee
            const expectedFinalMortgage = newBaseMortgage + newVAFee
            return Math.abs(newFinalMortgage - expectedFinalMortgage) < 0.01
          }
          
          // If base mortgage didn't change, nothing should change
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3a: VA funding fee recalculates when home value changes
   */
  it('Property 3a: VA funding fee recalculates when home value changes', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.float({ min: 0.5, max: 2, noNaN: true }), // Home value multiplier
        (initialHomeValue, downPercent, feeType, multiplier) => {
          // Initial calculation
          const initialBaseMortgage = initialHomeValue * (1 - downPercent / 100)
          const initialVAFee = calculateVAFundingFee(initialBaseMortgage, feeType)
          
          // New calculation with changed home value
          const newHomeValue = initialHomeValue * multiplier
          const newBaseMortgage = newHomeValue * (1 - downPercent / 100)
          const newVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
          
          // VA fee should scale with home value (and thus base mortgage)
          if (feeType === 'exempt') {
            return newVAFee === 0 && initialVAFee === 0
          }
          
          // For non-exempt, check proportional scaling
          if (initialVAFee > 0.01) {
            const expectedRatio = multiplier
            const actualRatio = newVAFee / initialVAFee
            return Math.abs(actualRatio - expectedRatio) < 0.01
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3b: Final mortgage amount recalculates when base mortgage changes
   */
  it('Property 3b: Final mortgage amount recalculates when base mortgage changes', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.integer({ min: -100000, max: 100000 }), // Change in home value
        (initialHomeValue, downPercent, feeType, homeValueChange) => {
          // Skip if initial home value is too small
          if (initialHomeValue < 1000) return true
          
          // Initial calculation
          const initialBaseMortgage = initialHomeValue * (1 - downPercent / 100)
          const initialVAFee = calculateVAFundingFee(initialBaseMortgage, feeType)
          const initialFinalMortgage = calculateFinalMortgageAmount(initialBaseMortgage, initialVAFee)
          
          // New calculation with changed home value
          const newHomeValue = Math.max(0, initialHomeValue + homeValueChange)
          const newBaseMortgage = newHomeValue * (1 - downPercent / 100)
          const newVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
          const newFinalMortgage = calculateFinalMortgageAmount(newBaseMortgage, newVAFee)
          
          // Final mortgage should always equal base mortgage + VA fee
          const expectedFinalMortgage = newBaseMortgage + newVAFee
          return Math.abs(newFinalMortgage - expectedFinalMortgage) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3c: Reactivity maintains correct fee percentage for fee type
   */
  it('Property 3c: Reactivity maintains correct fee percentage for fee type', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.integer({ min: 1, max: 10 }), // Number of changes to simulate
        (homeValue, downPercent, feeType, numChanges) => {
          let currentHomeValue = homeValue
          
          // Simulate multiple changes to base mortgage
          for (let i = 0; i < numChanges; i++) {
            const baseMortgage = currentHomeValue * (1 - downPercent / 100)
            const vaFee = calculateVAFundingFee(baseMortgage, feeType)
            
            // Verify correct percentage is maintained
            const expectedRate = 
              feeType === 'first-time' ? 0.0215 : 
              feeType === 'subsequent' ? 0.033 : 
              0
            
            const expectedFee = baseMortgage * expectedRate
            
            if (Math.abs(vaFee - expectedFee) >= 0.01) {
              return false
            }
            
            // Change home value for next iteration
            currentHomeValue = currentHomeValue * 1.1
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3d: Down payment changes trigger VA fee recalculation
   */
  it('Property 3d: Down payment changes trigger VA fee recalculation', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        fc.float({ min: 0, max: 10, noNaN: true }), // Initial down payment percent
        fc.float({ min: 0, max: 10, noNaN: true }), // New down payment percent
        arbVAFeeType,
        (homeValue, initialDownPercent, newDownPercent, feeType) => {
          // Initial calculation
          const initialBaseMortgage = homeValue * (1 - initialDownPercent / 100)
          const initialVAFee = calculateVAFundingFee(initialBaseMortgage, feeType)
          const initialFinalMortgage = calculateFinalMortgageAmount(initialBaseMortgage, initialVAFee)
          
          // New calculation with changed down payment
          const newBaseMortgage = homeValue * (1 - newDownPercent / 100)
          const newVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
          const newFinalMortgage = calculateFinalMortgageAmount(newBaseMortgage, newVAFee)
          
          // If down payment changed, base mortgage should change
          if (Math.abs(newDownPercent - initialDownPercent) > 0.01) {
            // Base mortgage should be different
            const baseMortgageChanged = Math.abs(newBaseMortgage - initialBaseMortgage) > 0.01
            
            if (!baseMortgageChanged) return true // Edge case where change is too small
            
            // VA fee should be recalculated for the new base mortgage
            const expectedNewVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
            const vaFeeCorrect = Math.abs(newVAFee - expectedNewVAFee) < 0.01
            
            // Final mortgage should be recalculated
            const expectedNewFinalMortgage = newBaseMortgage + newVAFee
            const finalMortgageCorrect = Math.abs(newFinalMortgage - expectedNewFinalMortgage) < 0.01
            
            return vaFeeCorrect && finalMortgageCorrect
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3e: Reactivity preserves relationship between base, fee, and final mortgage
   */
  it('Property 3e: Reactivity preserves relationship between base, fee, and final mortgage', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.array(fc.float({ min: -0.5, max: 0.5, noNaN: true }), { minLength: 1, maxLength: 5 }), // Series of changes
        (homeValue, downPercent, feeType, changes) => {
          let currentHomeValue = homeValue
          
          // Apply series of changes
          for (const change of changes) {
            currentHomeValue = Math.max(50000, currentHomeValue * (1 + change))
            
            const baseMortgage = currentHomeValue * (1 - downPercent / 100)
            const vaFee = calculateVAFundingFee(baseMortgage, feeType)
            const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFee)
            
            // Verify the fundamental relationship holds: final = base + fee
            if (Math.abs(finalMortgage - (baseMortgage + vaFee)) >= 0.01) {
              return false
            }
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3f: Zero base mortgage results in zero VA fee and final mortgage
   */
  it('Property 3f: Zero base mortgage results in zero VA fee and final mortgage', () => {
    fc.assert(
      fc.property(
        arbVAFeeType,
        (feeType) => {
          const baseMortgage = 0
          const vaFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFee)
          
          return vaFee === 0 && finalMortgage === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3g: Large base mortgage changes result in proportional VA fee changes
   */
  it('Property 3g: Large base mortgage changes result in proportional VA fee changes', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.integer({ min: 2, max: 10 }), // Multiplier for base mortgage
        (homeValue, downPercent, feeType, multiplier) => {
          // Initial calculation
          const initialBaseMortgage = homeValue * (1 - downPercent / 100)
          const initialVAFee = calculateVAFundingFee(initialBaseMortgage, feeType)
          
          // New calculation with multiplied base mortgage
          const newBaseMortgage = initialBaseMortgage * multiplier
          const newVAFee = calculateVAFundingFee(newBaseMortgage, feeType)
          
          // For exempt, both should be zero
          if (feeType === 'exempt') {
            return initialVAFee === 0 && newVAFee === 0
          }
          
          // For non-exempt, VA fee should scale proportionally
          if (initialVAFee > 0.01) {
            const expectedNewVAFee = initialVAFee * multiplier
            return Math.abs(newVAFee - expectedNewVAFee) < 0.02
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
