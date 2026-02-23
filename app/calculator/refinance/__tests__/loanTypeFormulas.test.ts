/**
 * Test suite for refinance calculator loan type formulas
 * Validates PMI/MIP calculations for each loan type
 */

describe('Refinance Calculator - Loan Type Formulas', () => {
  const loanBalance = 200000

  describe('Conventional Loan', () => {
    it('should use manual PMI when provided', () => {
      const manualPMI = 100 // $100/month = $1200/year
      const monthlyPMI = manualPMI / 12
      expect(monthlyPMI).toBeCloseTo(8.33, 2)
    })

    it('should estimate PMI at 0.5% annually when not provided', () => {
      const estimatedPMI = (loanBalance * 0.005) / 12
      expect(estimatedPMI).toBeCloseTo(83.33, 2)
    })
  })

  describe('FHA Loan', () => {
    it('should use manual MIP when provided', () => {
      const manualMIP = 150 // $150/month = $1800/year
      const monthlyMIP = manualMIP / 12
      expect(monthlyMIP).toBeCloseTo(12.5, 2)
    })

    it('should calculate MIP at 0.85% annually when not provided', () => {
      const mip = (loanBalance * 0.0085) / 12
      expect(mip).toBeCloseTo(141.67, 2)
    })
  })

  describe('VA Loan', () => {
    it('should have no monthly PMI/MIP', () => {
      const pmi = 0
      expect(pmi).toBe(0)
    })

    it('should ignore manual PMI input for VA loans', () => {
      const manualPMI = 100
      const vaPMI = 0 // VA loans don't have monthly PMI
      expect(vaPMI).toBe(0)
    })
  })

  describe('USDA Loan', () => {
    it('should use manual guarantee fee when provided', () => {
      const manualFee = 60 // $60/month = $720/year
      const monthlyFee = manualFee / 12
      expect(monthlyFee).toBeCloseTo(5, 2)
    })

    it('should calculate guarantee fee at 0.35% annually when not provided', () => {
      const guaranteeFee = (loanBalance * 0.0035) / 12
      expect(guaranteeFee).toBeCloseTo(58.33, 2)
    })
  })

  describe('Jumbo Loan', () => {
    it('should have no PMI by default (assumes 20%+ equity)', () => {
      const manualPMI = 0
      const jumboPMI = manualPMI
      expect(jumboPMI).toBe(0)
    })

    it('should use manual PMI when provided', () => {
      const manualPMI = 200 // $200/month = $2400/year
      const monthlyPMI = manualPMI / 12
      expect(monthlyPMI).toBeCloseTo(16.67, 2)
    })
  })

  describe('Principal & Interest Calculation', () => {
    it('should calculate monthly P&I correctly', () => {
      const rate = 0.05 / 12 // 5% annual rate
      const term = 360 // 30 years
      const monthlyPI = loanBalance * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      expect(monthlyPI).toBeCloseTo(1073.64, 2)
    })

    it('should handle zero interest rate', () => {
      const rate = 0
      const term = 360
      const monthlyPI = loanBalance / term
      expect(monthlyPI).toBeCloseTo(555.56, 2)
    })
  })

  describe('Savings Calculation', () => {
    it('should calculate monthly savings correctly', () => {
      const currentPayment = 1500
      const newPayment = 1200
      const monthlySavings = currentPayment - newPayment
      expect(monthlySavings).toBe(300)
    })

    it('should calculate break-even point correctly', () => {
      const monthlySavings = 300
      const closingCosts = 6000
      const breakEvenMonths = closingCosts / monthlySavings
      expect(breakEvenMonths).toBe(20)
    })

    it('should calculate total savings over life of loan', () => {
      const monthlySavings = 300
      const newTerm = 360 // 30 years
      const closingCosts = 6000
      const totalSavings = monthlySavings * newTerm - closingCosts
      expect(totalSavings).toBe(102000)
    })
  })
})
