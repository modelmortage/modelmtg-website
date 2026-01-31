/**
 * Property-based tests for calculator interface completeness
 * Feature: website-structure-migration, Property 2: Calculator Interface Completeness
 * 
 * **Validates: Requirements 1.2**
 * 
 * Property 2: Calculator Interface Completeness
 * For any calculator page, the rendered interface should contain all required input fields 
 * as defined in the calculator configuration.
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'
import { purchaseConfig } from '@/lib/calculators/configs/purchase.config'
import { refinanceConfig } from '@/lib/calculators/configs/refinance.config'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'
import { dscrConfig } from '@/lib/calculators/configs/dscr.config'
import type { CalculatorConfig } from '@/lib/types/calculator'

// Import calculator pages
import AffordabilityCalculator from '@/app/calculator/affordability/page'
import PurchaseCalculator from '@/app/calculator/purchase/page'
import RefinanceCalculator from '@/app/calculator/refinance/page'
import RentVsBuyCalculator from '@/app/calculator/rent-vs-buy/page'
import VAPurchaseCalculator from '@/app/calculator/va-purchase/page'
import VARefinanceCalculator from '@/app/calculator/va-refinance/page'
import DSCRCalculator from '@/app/calculator/dscr/page'

// Map of calculator configs to their page components
const calculatorMap: Array<{
  config: CalculatorConfig
  component: React.ComponentType
  name: string
}> = [
  { config: affordabilityConfig, component: AffordabilityCalculator, name: 'Affordability' },
  { config: purchaseConfig, component: PurchaseCalculator, name: 'Purchase' },
  { config: refinanceConfig, component: RefinanceCalculator, name: 'Refinance' },
  { config: rentVsBuyConfig, component: RentVsBuyCalculator, name: 'Rent vs Buy' },
  { config: vaPurchaseConfig, component: VAPurchaseCalculator, name: 'VA Purchase' },
  { config: vaRefinanceConfig, component: VARefinanceCalculator, name: 'VA Refinance' },
  { config: dscrConfig, component: DSCRCalculator, name: 'DSCR' }
]

describe('Calculator Interface Completeness - Property-Based Tests', () => {
  describe('Property 2: Calculator Interface Completeness', () => {
    it('should render all required input fields for any calculator', () => {
      // For each calculator in our system
      calculatorMap.forEach(({ config, component: Component, name }) => {
        // Render the calculator page
        const { container } = render(<Component />)
        
        // Verify that all input fields from the config are present in the rendered interface
        config.inputs.forEach(input => {
          // Try to find the actual input field by name attribute (more reliable than label text)
          const inputElement = container.querySelector(`input[name="${input.name}"]`)
          
          // Assert that the input field exists
          expect(inputElement).toBeInTheDocument()
          
          // Verify the input has the correct name attribute
          if (inputElement) {
            expect(inputElement).toHaveAttribute('name', input.name)
          }
          
          // Also verify the label exists by looking for a label element containing the text
          const labels = container.querySelectorAll('label')
          const labelExists = Array.from(labels).some(label => 
            label.textContent?.includes(input.label)
          )
          expect(labelExists).toBe(true)
        })
        
        // Clean up after each calculator test
        container.remove()
      })
    })
    
    it('should render the correct number of input fields for each calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Count the number of input fields in the config
        const expectedInputCount = config.inputs.length
        
        // Count the number of rendered input fields (excluding buttons)
        const renderedInputs = container.querySelectorAll('input[type="number"], input[type="text"]')
        
        // Assert that the count matches
        expect(renderedInputs.length).toBe(expectedInputCount)
        
        container.remove()
      })
    })
    
    it('should mark required fields appropriately for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Check each input field
        config.inputs.forEach(input => {
          const inputElement = container.querySelector(`input[name="${input.name}"]`)
          
          if (inputElement && input.required) {
            // Required fields should have the required attribute or aria-required
            const isRequired = 
              inputElement.hasAttribute('required') || 
              inputElement.getAttribute('aria-required') === 'true'
            
            expect(isRequired).toBe(true)
          }
        })
        
        container.remove()
      })
    })
    
    it('should render input fields with correct placeholder text for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Check each input field
        config.inputs.forEach(input => {
          const inputElement = container.querySelector(`input[name="${input.name}"]`) as HTMLInputElement
          
          if (inputElement && input.placeholder) {
            // Verify placeholder matches config
            expect(inputElement.placeholder).toBe(input.placeholder)
          }
        })
        
        container.remove()
      })
    })
    
    it('should render input fields with default values when specified for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Check each input field
        config.inputs.forEach(input => {
          const inputElement = container.querySelector(`input[name="${input.name}"]`) as HTMLInputElement
          
          if (inputElement && input.defaultValue !== undefined) {
            // Verify default value is set (convert both to numbers for comparison to handle formatting)
            const actualValue = parseFloat(inputElement.value)
            const expectedValue = typeof input.defaultValue === 'number' 
              ? input.defaultValue 
              : parseFloat(String(input.defaultValue))
            
            expect(actualValue).toBe(expectedValue)
          }
        })
        
        container.remove()
      })
    })
    
    it('should render help text for input fields when specified for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Check each input field
        config.inputs.forEach(input => {
          if (input.helpText) {
            // Try to find the help text in the document
            // Help text is rendered as a paragraph with specific styling
            const helpTextElement = screen.queryByText(input.helpText)
            
            // Assert that help text is present (it should be visible initially before any errors)
            expect(helpTextElement).toBeInTheDocument()
          }
        })
        
        container.remove()
      })
    })
    
    it('should render a calculate button for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Look for a calculate button
        const calculateButton = screen.queryByRole('button', { name: /calculate/i })
        
        // Assert that the calculate button exists
        expect(calculateButton).toBeInTheDocument()
        
        container.remove()
      })
    })
    
    it('should render calculator title and description for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Verify title is present (it's rendered in an h1 with the icon)
        const titleElement = screen.queryByText(config.title)
        expect(titleElement).toBeInTheDocument()
        
        // Verify description is present (it's rendered in a paragraph)
        const descriptionElement = screen.queryByText(config.description)
        expect(descriptionElement).toBeInTheDocument()
        
        container.remove()
      })
    })
    
    it('should maintain consistent interface structure across all calculators', () => {
      // Verify all calculators have the same basic structure
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // All calculators should have:
        // 1. A form with inputs
        const inputs = container.querySelectorAll('input[type="number"]')
        expect(inputs.length).toBeGreaterThan(0)
        
        // 2. A calculate button
        const calculateButton = screen.queryByRole('button', { name: /calculate/i })
        expect(calculateButton).toBeInTheDocument()
        
        // 3. The correct number of inputs matching the config
        expect(inputs.length).toBe(config.inputs.length)
        
        container.remove()
      })
    })
    
    it('should use property-based testing to verify interface completeness for random calculator selection', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: calculatorMap.length - 1 }), // Random calculator index
          (calculatorIndex) => {
            const { config, component: Component, name } = calculatorMap[calculatorIndex]
            
            const { container } = render(<Component />)
            
            // Verify all inputs from config are present
            let allInputsPresent = true
            config.inputs.forEach(input => {
              const inputElement = container.querySelector(`input[name="${input.name}"]`)
              if (!inputElement) {
                allInputsPresent = false
              }
            })
            
            container.remove()
            
            expect(allInputsPresent).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should verify that input field names match config for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        // Get all input elements
        const inputs = container.querySelectorAll('input[name]')
        const inputNames = Array.from(inputs).map(input => input.getAttribute('name'))
        
        // Get all expected input names from config
        const expectedNames = config.inputs.map(input => input.name)
        
        // Verify all expected names are present
        expectedNames.forEach(expectedName => {
          expect(inputNames).toContain(expectedName)
        })
        
        container.remove()
      })
    })
    
    it('should verify input types are appropriate for the field type for any calculator', () => {
      calculatorMap.forEach(({ config, component: Component, name }) => {
        const { container } = render(<Component />)
        
        config.inputs.forEach(input => {
          const inputElement = container.querySelector(`input[name="${input.name}"]`) as HTMLInputElement
          
          if (inputElement) {
            // All calculator inputs should be number inputs
            const inputType = inputElement.getAttribute('type')
            expect(inputType).toBe('number')
          }
        })
        
        container.remove()
      })
    })
    
    it('should verify all calculators have unique input field names within their config', () => {
      calculatorMap.forEach(({ config, name }) => {
        const inputNames = config.inputs.map(input => input.name)
        const uniqueNames = new Set(inputNames)
        
        // All input names should be unique within a calculator
        expect(uniqueNames.size).toBe(inputNames.length)
      })
    })
    
    it('should verify all required inputs are marked as required in config', () => {
      calculatorMap.forEach(({ config, name }) => {
        config.inputs.forEach(input => {
          // All inputs in our calculators should be required
          expect(input.required).toBe(true)
        })
      })
    })
    
    it('should verify input validation constraints are defined for any calculator', () => {
      calculatorMap.forEach(({ config, name }) => {
        config.inputs.forEach(input => {
          // All inputs should have min/max constraints defined
          expect(input.min).toBeDefined()
          expect(input.max).toBeDefined()
          
          // Min should be less than or equal to max
          expect(input.min).toBeLessThanOrEqual(input.max!)
        })
      })
    })
  })
})
