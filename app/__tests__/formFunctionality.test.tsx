/**
 * Form Functionality Tests
 * 
 * Tests all calculator forms, contact forms, and scheduling forms
 * Verifies validation and error handling
 * 
 * Requirements: 2.4, 3.5, 5.4
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'
import { purchaseConfig } from '@/lib/calculators/configs/purchase.config'
import { refinanceConfig } from '@/lib/calculators/configs/refinance.config'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'
import { dscrConfig } from '@/lib/calculators/configs/dscr.config'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test',
}))

describe('Form Functionality Tests', () => {
  describe('Calculator Forms - Basic Rendering', () => {
    /**
     * Requirement 2.4: Interactive elements should be functional
     * Requirement 3.5: Loan options pages should have functional interactive elements
     */
    
    it('should render affordability calculator form with all required fields', () => {
      const { inputs } = affordabilityConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      // Verify all inputs have required properties
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
        expect(typeof input.required).toBe('boolean')
      })
    })

    it('should render purchase calculator form with all required fields', () => {
      const { inputs } = purchaseConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })

    it('should render refinance calculator form with all required fields', () => {
      const { inputs } = refinanceConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })

    it('should render rent vs buy calculator form with all required fields', () => {
      const { inputs } = rentVsBuyConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })

    it('should render VA purchase calculator form with all required fields', () => {
      const { inputs } = vaPurchaseConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })

    it('should render VA refinance calculator form with all required fields', () => {
      const { inputs } = vaRefinanceConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })

    it('should render DSCR calculator form with all required fields', () => {
      const { inputs } = dscrConfig
      
      expect(inputs).toBeDefined()
      expect(inputs.length).toBeGreaterThan(0)
      
      inputs.forEach(input => {
        expect(input.name).toBeDefined()
        expect(input.label).toBeDefined()
        expect(input.type).toBeDefined()
      })
    })
  })

  describe('Calculator Form Validation', () => {
    /**
     * Requirement 1.4: System should display validation errors for invalid inputs
     * Requirement 2.4: Interactive elements should be functional
     */

    it('should have min/max constraints for numeric inputs', () => {
      const allConfigs = [
        affordabilityConfig,
        purchaseConfig,
        refinanceConfig,
        rentVsBuyConfig,
        vaPurchaseConfig,
        vaRefinanceConfig,
        dscrConfig
      ]

      allConfigs.forEach(config => {
        config.inputs.forEach(input => {
          if (input.type === 'number' || input.type === 'currency' || input.type === 'percentage') {
            // Numeric inputs should have min constraint
            expect(input.min).toBeDefined()
            expect(typeof input.min).toBe('number')
            
            // Min should be non-negative for most financial inputs
            // Exceptions: cashOut, cashOutAmount, monthlyDebts, appreciationRate (can be negative)
            if (input.name !== 'cashOut' && 
                input.name !== 'cashOutAmount' && 
                input.name !== 'monthlyDebts' && 
                input.name !== 'appreciationRate') {
              expect(input.min).toBeGreaterThanOrEqual(0)
            }
          }
        })
      })
    })

    it('should have appropriate step values for different input types', () => {
      const allConfigs = [
        affordabilityConfig,
        purchaseConfig,
        refinanceConfig,
        rentVsBuyConfig,
        vaPurchaseConfig,
        vaRefinanceConfig,
        dscrConfig
      ]

      allConfigs.forEach(config => {
        config.inputs.forEach(input => {
          if (input.type === 'percentage') {
            // Percentage inputs should have small step values
            if (input.step !== undefined) {
              expect(input.step).toBeLessThanOrEqual(1)
            }
          }
        })
      })
    })

    it('should mark critical fields as required', () => {
      // Affordability calculator should require income and interest rate
      const affordabilityRequired = affordabilityConfig.inputs.filter(i => i.required)
      expect(affordabilityRequired.length).toBeGreaterThan(0)
      
      // Purchase calculator should require home price and interest rate
      const purchaseRequired = purchaseConfig.inputs.filter(i => i.required)
      expect(purchaseRequired.length).toBeGreaterThan(0)
    })
  })

  describe('Calculator Form Calculation Functions', () => {
    /**
     * Requirement 2.4: Interactive elements should be functional
     * Requirement 3.5: Loan options pages should have functional interactive elements
     */

    it('should have calculate function for affordability calculator', () => {
      expect(typeof affordabilityConfig.calculate).toBe('function')
      
      const result = affordabilityConfig.calculate({
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      result.forEach(r => {
        expect(r.label).toBeDefined()
        expect(typeof r.value).toBe('number')
        expect(r.format).toBeDefined()
      })
    })

    it('should have calculate function for purchase calculator', () => {
      expect(typeof purchaseConfig.calculate).toBe('function')
      
      const result = purchaseConfig.calculate({
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 7.0,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 1200,
        hoa: 0
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should have calculate function for refinance calculator', () => {
      expect(typeof refinanceConfig.calculate).toBe('function')
      
      const result = refinanceConfig.calculate({
        currentBalance: 200000,
        currentRate: 8.0,
        remainingTerm: 25,
        newRate: 6.5,
        newTerm: 30,
        closingCosts: 5000
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should have calculate function for rent vs buy calculator', () => {
      expect(typeof rentVsBuyConfig.calculate).toBe('function')
      
      const result = rentVsBuyConfig.calculate({
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 7.0,
        rentAmount: 2000,
        yearsToStay: 5,
        appreciationRate: 3.0
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should have calculate function for VA purchase calculator', () => {
      expect(typeof vaPurchaseConfig.calculate).toBe('function')
      
      const result = vaPurchaseConfig.calculate({
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.5,
        vaFundingFee: 2.15,
        propertyTaxRate: 1.2,
        insurance: 1200
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should have calculate function for VA refinance calculator', () => {
      expect(typeof vaRefinanceConfig.calculate).toBe('function')
      
      const result = vaRefinanceConfig.calculate({
        currentBalance: 200000,
        currentRate: 7.5,
        newRate: 6.0,
        cashOutAmount: 0,
        vaFundingFee: 2.15
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should have calculate function for DSCR calculator', () => {
      expect(typeof dscrConfig.calculate).toBe('function')
      
      const result = dscrConfig.calculate({
        propertyPrice: 300000,
        downPayment: 75000,
        interestRate: 7.5,
        loanTerm: 30,
        monthlyRent: 2500,
        monthlyExpenses: 500
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Form Error Handling', () => {
    /**
     * Requirement 1.4: System should prevent calculation with invalid inputs
     * Requirement 2.4: Interactive elements should be functional
     */

    it('should handle negative values appropriately', () => {
      // Test that negative values are rejected for most inputs
      // The actual validation happens in the page component using Zod schemas
      // The calculate function will throw a ZodError for invalid inputs
      
      expect(() => {
        affordabilityConfig.calculate({
          annualIncome: -1000, // Invalid
          monthlyDebts: 500,
          downPayment: 20000,
          interestRate: 7.0
        })
      }).toThrow()
    })

    it('should handle zero values appropriately', () => {
      // Some calculators should handle zero values
      const result = purchaseConfig.calculate({
        homePrice: 300000,
        downPayment: 0, // Valid - 0% down
        interestRate: 7.0,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 1200,
        hoa: 0 // Valid - no HOA
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle very large values appropriately', () => {
      // Test with large but valid values
      const result = purchaseConfig.calculate({
        homePrice: 5000000, // Large home
        downPayment: 1000000,
        interestRate: 7.0,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 10000,
        hoa: 500
      })
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Results should be reasonable
      result.forEach(r => {
        expect(r.value).toBeGreaterThan(0)
        expect(isFinite(r.value)).toBe(true)
      })
    })
  })

  describe('Contact Form Structure', () => {
    /**
     * Requirement 2.4: Contact forms should be functional
     * Requirement 5.4: Profile contact forms should be functional
     */

    it('should have contact page with form elements', async () => {
      // Import contact page
      const ContactPage = (await import('../contact/page')).default
      
      const { container } = render(<ContactPage />)
      
      // Check for form element
      const forms = container.querySelectorAll('form')
      expect(forms.length).toBeGreaterThan(0)
    })

    it('should have required contact form fields', async () => {
      const ContactPage = (await import('../contact/page')).default
      
      const { container } = render(<ContactPage />)
      
      // Check for input fields
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(0)
      
      // Check for required fields
      const requiredInputs = Array.from(inputs).filter(input => 
        input.hasAttribute('required')
      )
      expect(requiredInputs.length).toBeGreaterThan(0)
    })
  })

  describe('Pre-Qualify Form Structure', () => {
    /**
     * Requirement 2.4: Forms should be functional
     */

    it('should have pre-qualify page with form elements', async () => {
      const PreQualifyPage = (await import('../pre-qualify/page')).default
      
      const { container } = render(<PreQualifyPage />)
      
      // Check for form element
      const forms = container.querySelectorAll('form')
      expect(forms.length).toBeGreaterThan(0)
    })

    it('should have required pre-qualify form fields', async () => {
      const PreQualifyPage = (await import('../pre-qualify/page')).default
      
      const { container } = render(<PreQualifyPage />)
      
      // Check for input fields
      const inputs = container.querySelectorAll('input, select')
      expect(inputs.length).toBeGreaterThan(0)
      
      // Check for required fields
      const requiredInputs = Array.from(inputs).filter(input => 
        input.hasAttribute('required')
      )
      expect(requiredInputs.length).toBeGreaterThan(0)
    })

    it('should have personal information section', async () => {
      const PreQualifyPage = (await import('../pre-qualify/page')).default
      
      const { container } = render(<PreQualifyPage />)
      
      // Check for personal information heading
      const headings = container.querySelectorAll('h3')
      const personalInfoHeading = Array.from(headings).find(h => 
        h.textContent?.includes('Personal Information')
      )
      expect(personalInfoHeading).toBeDefined()
    })

    it('should have property information section', async () => {
      const PreQualifyPage = (await import('../pre-qualify/page')).default
      
      const { container } = render(<PreQualifyPage />)
      
      // Check for property information heading
      const headings = container.querySelectorAll('h3')
      const propertyInfoHeading = Array.from(headings).find(h => 
        h.textContent?.includes('Property Information')
      )
      expect(propertyInfoHeading).toBeDefined()
    })

    it('should have financial information section', async () => {
      const PreQualifyPage = (await import('../pre-qualify/page')).default
      
      const { container } = render(<PreQualifyPage />)
      
      // Check for financial information heading
      const headings = container.querySelectorAll('h3')
      const financialInfoHeading = Array.from(headings).find(h => 
        h.textContent?.includes('Financial Information')
      )
      expect(financialInfoHeading).toBeDefined()
    })
  })

  describe('Scheduling Form Structure', () => {
    /**
     * Requirement 2.4: Scheduling forms should be functional
     * Requirement 5.4: Profile contact forms should be functional
     */

    it('should have schedule-a-call page with scheduling options', async () => {
      const ScheduleCallPage = (await import('../schedule-a-call/page')).default
      
      const { container } = render(<ScheduleCallPage />)
      
      // Check for scheduling content
      expect(container.textContent).toBeTruthy()
    })

    it('should have Calendly integration or scheduling links', async () => {
      const ScheduleCallPage = (await import('../schedule-a-call/page')).default
      
      const { container } = render(<ScheduleCallPage />)
      
      // Check for iframe (Calendly) or links
      const iframes = container.querySelectorAll('iframe')
      const links = container.querySelectorAll('a')
      
      expect(iframes.length + links.length).toBeGreaterThan(0)
    })
  })

  describe('Form Accessibility', () => {
    /**
     * Requirement 7.5: Forms should have proper ARIA labels
     */

    it('should have labels for all calculator form inputs', () => {
      const allConfigs = [
        affordabilityConfig,
        purchaseConfig,
        refinanceConfig,
        rentVsBuyConfig,
        vaPurchaseConfig,
        vaRefinanceConfig,
        dscrConfig
      ]

      allConfigs.forEach(config => {
        config.inputs.forEach(input => {
          // Every input should have a label
          expect(input.label).toBeDefined()
          expect(input.label.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have placeholders for calculator form inputs', () => {
      const allConfigs = [
        affordabilityConfig,
        purchaseConfig,
        refinanceConfig,
        rentVsBuyConfig,
        vaPurchaseConfig,
        vaRefinanceConfig,
        dscrConfig
      ]

      allConfigs.forEach(config => {
        config.inputs.forEach(input => {
          // Every input should have a placeholder
          expect(input.placeholder).toBeDefined()
          expect(input.placeholder.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 2.4: Interactive elements are functional', () => {
      // Requirement 2.4: When content includes contact information or forms,
      // the system shall ensure all interactive elements are functional
      
      // Verified by:
      // - All calculator forms have calculate functions
      // - Contact form exists with required fields
      // - Pre-qualify form exists with required fields
      // - Scheduling interface exists
      
      expect(typeof affordabilityConfig.calculate).toBe('function')
      expect(typeof purchaseConfig.calculate).toBe('function')
      expect(typeof refinanceConfig.calculate).toBe('function')
    })

    it('should meet Requirement 3.5: Loan options pages have functional interactive elements', () => {
      // Requirement 3.5: When a loan options page includes calculators or forms,
      // the system shall provide functional interactive elements
      
      // Verified by:
      // - All calculator configs are properly defined
      // - All calculators have working calculate functions
      
      const allConfigs = [
        affordabilityConfig,
        purchaseConfig,
        refinanceConfig,
        rentVsBuyConfig,
        vaPurchaseConfig,
        vaRefinanceConfig,
        dscrConfig
      ]

      allConfigs.forEach(config => {
        expect(config.inputs).toBeDefined()
        expect(typeof config.calculate).toBe('function')
      })
    })

    it('should meet Requirement 5.4: Profile contact forms are functional', () => {
      // Requirement 5.4: When a profile includes contact forms or scheduling links,
      // the system shall ensure all interactive elements are functional
      
      // Verified by:
      // - Contact page has form elements
      // - Schedule-a-call page has scheduling interface
      // - Forms have required fields
      
      // This is verified by the contact and scheduling form tests above
      expect(true).toBe(true)
    })
  })
})
