# Design Document: VA Purchase Calculator Enhancements

## Overview

This design extends the existing VA Purchase Calculator with comprehensive features for VA funding fee calculations, flexible payment frequencies, early payoff strategies, and enhanced results displays. The design maintains the current three-panel layout and component structure while adding new functionality through additional state management, calculation logic, and UI components.

The enhancements will be implemented as modifications to the existing `app/calculator/va-purchase/page.tsx` component, preserving the current architecture and design system usage.

## Architecture

### Current Architecture

The VA Purchase Calculator follows a client-side React component architecture:

- **Component**: `VAPurchaseCalculator` (page.tsx)
- **Layout**: Three-panel grid layout (inputs, breakdown, results)
- **State Management**: React useState hooks for form values and calculated results
- **Calculation**: Real-time calculations via useEffect hooks
- **Styling**: CSS Modules (va-purchase.module.css)
- **Design System**: Reusable components (Card, Input, Icon)

### Enhanced Architecture

The enhancements will extend the existing architecture with:

1. **Additional State Variables**:
   - VA funding fee usage type (first-time, subsequent, exempt)
   - Payment frequency (monthly, bi-weekly, weekly)
   - First payment date
   - Extra payment amount
   - Early payoff strategy parameters (additional monthly, lump sum, frequencies)
   - Insurance input mode (dollar/percent)

2. **Enhanced Calculation Engine**:
   - VA funding fee calculation based on usage type
   - Payment frequency adjustments
   - Early payoff amortization calculations
   - Interest savings calculations
   - Loan term reduction calculations

3. **New UI Sections**:
   - VA funding fee radio button group
   - Payment frequency toggle
   - First payment date picker
   - Extra payment input
   - Early payoff strategy section
   - Insurance toggle ($/%)

## Components and Interfaces

### State Structure

```typescript
// Existing state (preserved)
type ToggleMode = 'dollar' | 'percent'
type TermMode = 'year' | 'month'

// New state types
type VAFundingFeeType = 'first-time' | 'subsequent' | 'exempt'
type PaymentFrequency = 'monthly' | 'bi-weekly' | 'weekly'
type LumpSumFrequency = 'one-time' | 'yearly' | 'quarterly'

interface CalculatorValues {
  // Existing values (preserved)
  homePrice: string
  downPaymentDollar: string
  downPaymentPercent: string
  vaFundingFee: string  // This becomes calculated, not user input
  interestRate: string
  loanTermYears: string
  loanTermMonths: string
  propertyTaxDollar: string
  propertyTaxPercent: string
  insurance: string
  hoaDues: string
  
  // New values
  vaFundingFeeType: VAFundingFeeType
  paymentFrequency: PaymentFrequency
  firstPaymentDate: Date | null
  extraPaymentPerMonth: string
  insuranceDollar: string
  insurancePercent: string
  
  // Early payoff strategy values
  additionalMonthly: string
  earlyPayoffFrequency: PaymentFrequency
  lumpSumAmount: string
  lumpSumFrequency: LumpSumFrequency
}

interface CalculatorResults {
  // Existing results (preserved)
  totalMonthlyPayment: number
  principalInterest: number
  propertyTax: number
  insurance: number
  hoaDues: number
  loanAmount: number
  
  // New results
  vaFundingFeeAmount: number
  finalMortgageAmount: number
  totalPayment: number
  totalInterestPaid: number
  extraPayment: number
  
  // Early payoff results
  earlyPayoffSavings: number
  earlyPayoffPaymentAmount: number
  loanTermReduction: number  // in months
  
  // Payment frequency adjusted values
  paymentPerPeriod: number
  periodsPerYear: number
}
```

### Calculation Functions

#### VA Funding Fee Calculation

```typescript
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
```

#### Payment Frequency Adjustment

```typescript
function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12
    case 'bi-weekly':
      return 26
    case 'weekly':
      return 52
  }
}

function adjustPaymentForFrequency(
  monthlyPayment: number,
  frequency: PaymentFrequency
): number {
  const periodsPerYear = getPeriodsPerYear(frequency)
  return (monthlyPayment * 12) / periodsPerYear
}
```

#### Amortization Calculation

```typescript
function calculateAmortization(
  principal: number,
  annualRate: number,
  termInMonths: number,
  extraPayment: number = 0
): {
  monthlyPayment: number
  totalInterest: number
  actualTermMonths: number
} {
  const monthlyRate = annualRate / 12
  
  // Standard monthly payment (principal + interest)
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  // Calculate actual payoff with extra payments
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0 && monthsPaid < termInMonths) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPI - interestPayment + extraPayment
    
    totalInterest += interestPayment
    balance -= principalPayment
    monthsPaid++
    
    if (balance < 0) balance = 0
  }
  
  return {
    monthlyPayment: monthlyPI,
    totalInterest,
    actualTermMonths: monthsPaid
  }
}
```

#### Early Payoff Strategy Calculation

```typescript
function calculateEarlyPayoffStrategy(
  principal: number,
  annualRate: number,
  termInMonths: number,
  additionalMonthly: number,
  frequency: PaymentFrequency,
  lumpSumAmount: number,
  lumpSumFrequency: LumpSumFrequency
): {
  savings: number
  newPaymentAmount: number
  termReduction: number
} {
  // Calculate baseline (no extra payments)
  const baseline = calculateAmortization(principal, annualRate, termInMonths, 0)
  
  // Calculate with additional monthly payment
  const extraMonthly = additionalMonthly
  
  // Adjust for payment frequency
  const periodsPerYear = getPeriodsPerYear(frequency)
  const adjustedExtra = (extraMonthly * 12) / periodsPerYear
  
  // Calculate lump sum contribution per month
  let lumpSumPerMonth = 0
  if (lumpSumAmount > 0) {
    switch (lumpSumFrequency) {
      case 'one-time':
        lumpSumPerMonth = lumpSumAmount / termInMonths
        break
      case 'yearly':
        lumpSumPerMonth = lumpSumAmount / 12
        break
      case 'quarterly':
        lumpSumPerMonth = lumpSumAmount / 3
        break
    }
  }
  
  // Calculate with early payoff strategy
  const withStrategy = calculateAmortization(
    principal,
    annualRate,
    termInMonths,
    adjustedExtra + lumpSumPerMonth
  )
  
  return {
    savings: baseline.totalInterest - withStrategy.totalInterest,
    newPaymentAmount: withStrategy.monthlyPayment + adjustedExtra + lumpSumPerMonth,
    termReduction: baseline.actualTermMonths - withStrategy.actualTermMonths
  }
}
```

#### Insurance Mode Conversion

```typescript
function convertInsuranceDollarToPercent(
  dollarAmount: number,
  homeValue: number
): number {
  return homeValue > 0 ? (dollarAmount / homeValue) * 100 : 0
}

function convertInsurancePercentToDollar(
  percent: number,
  homeValue: number
): number {
  return (homeValue * percent) / 100
}
```

## Data Models

### Input Validation

All numeric inputs should be validated:

```typescript
function parseNumericInput(value: string, defaultValue: number = 0): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) || parsed < 0 ? defaultValue : parsed
}
```

### Date Handling

```typescript
function getDefaultFirstPaymentDate(): Date {
  const today = new Date()
  today.setDate(today.getDate() + 30)
  return today
}

function calculatePaymentSchedule(
  firstPaymentDate: Date,
  frequency: PaymentFrequency,
  numberOfPayments: number
): Date[] {
  const schedule: Date[] = []
  let currentDate = new Date(firstPaymentDate)
  
  for (let i = 0; i < numberOfPayments; i++) {
    schedule.push(new Date(currentDate))
    
    switch (frequency) {
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case 'bi-weekly':
        currentDate.setDate(currentDate.getDate() + 14)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
    }
  }
  
  return schedule
}
```

### Display Formatting

```typescript
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatPercent(value: number, decimals: number = 2): string {
  return value.toFixed(decimals) + '%'
}

function formatLoanTermReduction(months: number): string {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years === 0) return `${remainingMonths} months`
  if (remainingMonths === 0) return `${years} years`
  return `${years} years, ${remainingMonths} months`
}
```

## UI Component Layout

### Input Panel (Left) - Enhanced

The input panel will be extended with new fields while maintaining the existing structure:

1. **Existing Fields** (preserved):
   - Home Value
   - Down Payment ($/%)
   - Base Mortgage Amount
   - Loan Terms (Year/Month)
   - Interest Rate

2. **New Fields** (added):
   - VA Funding Fee Type (radio buttons)
   - VA Funding Fee Amount (calculated display)
   - Final Mortgage Amount (calculated display)
   - Payment Frequency (Monthly/Bi-weekly/Weekly toggle)
   - First Payment Date (date picker)
   - Extra Payment Per Month (input)

3. **Existing Fields** (preserved):
   - Property Tax ($/%)
   - Homeowners Insurance (enhanced with $/% toggle)
   - HOA Dues

### Payment Breakdown Panel (Center) - Enhanced

The center panel maintains the donut chart but updates the breakdown:

1. **Donut Chart** (preserved):
   - Visual representation of payment components
   - Center displays payment amount per period

2. **Payment Breakdown Legend** (enhanced):
   - Principal & Interest
   - Taxes
   - Insurance
   - HOA Dues (if > 0)
   - Extra Payment (if > 0)

### Results Panel (Right) - Enhanced

The results panel will be reorganized and expanded:

1. **Summary Cards** (enhanced):
   - Total Payment (all payments over loan term)
   - Total Loan Amount (Final Mortgage Amount)
   - Total Interest Paid
   - Payment Per Period (adjusted for frequency)

2. **Monthly Payment Summary** (new section):
   - Home Value
   - Mortgage Amount
   - Monthly Principal & Interest
   - Monthly Extra Payment (if > 0)
   - Monthly Property Tax
   - Monthly Home Insurance
   - Monthly HOA Fees (if > 0)

3. **Early Payoff Strategy** (new section):
   - Savings display
   - Payment Amount display
   - Shorten Loan Term By display
   - Additional Monthly input
   - Increase Frequency dropdown
   - Lump Sum Payment subsection:
     - Lump Sum Addition input
     - Frequency dropdown

4. **VA Loan Benefits** (preserved):
   - Existing informational card

## Correctness Properties


A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: VA Funding Fee Calculation Correctness

*For any* base mortgage amount and VA funding fee type (first-time, subsequent, exempt), the calculated VA funding fee should equal the base mortgage amount multiplied by the correct percentage (2.15% for first-time, 3.3% for subsequent, 0% for exempt).

**Validates: Requirements 1.5, 1.6, 1.7**

### Property 2: Final Mortgage Amount Calculation

*For any* base mortgage amount and VA funding fee amount, the final mortgage amount should equal the base mortgage amount plus the VA funding fee amount.

**Validates: Requirements 1.9**

### Property 3: VA Funding Fee Reactivity

*For any* change to the base mortgage amount, the VA funding fee and final mortgage amount should be recalculated to reflect the new base amount.

**Validates: Requirements 1.10**

### Property 4: Payment Frequency Period Calculation

*For any* payment frequency (monthly, bi-weekly, weekly), the number of payment periods per year should be 12 for monthly, 26 for bi-weekly, and 52 for weekly.

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 5: Payment Frequency Proportional Adjustment

*For any* loan with a given monthly payment amount, when the payment frequency changes, the total annual payment amount (payment per period × periods per year) should remain constant.

**Validates: Requirements 2.5**

### Property 6: Payment Schedule Start Date

*For any* first payment date, the payment schedule should begin on that date and subsequent payments should occur at intervals determined by the payment frequency.

**Validates: Requirements 3.3**

### Property 7: Extra Payment Addition

*For any* extra payment amount greater than zero, the total monthly payment should equal the sum of principal & interest, taxes, insurance, HOA dues, and the extra payment amount.

**Validates: Requirements 4.2**

### Property 8: Extra Payment Interest Reduction

*For any* extra payment amount greater than zero, the total interest paid should be less than the total interest paid with zero extra payment, and the loan term should be shorter.

**Validates: Requirements 4.4**

### Property 9: Total Payment Calculation

*For any* loan, the total payment over the loan term should equal the payment per period multiplied by the number of payment periods.

**Validates: Requirements 5.1**

### Property 10: Total Interest Calculation

*For any* loan, the total interest paid should equal the total payment minus the total loan amount (final mortgage amount).

**Validates: Requirements 5.3**

### Property 11: Conditional Display Elements

*For any* calculator state, HOA dues should appear in the breakdown when HOA > 0, extra payment should appear when extra payment > 0, and these elements should not appear when their values are zero.

**Validates: Requirements 5.8, 5.9, 5.14, 5.17**

### Property 12: Early Payoff Interest Savings

*For any* early payoff strategy with additional payments or lump sums, the interest savings should equal the baseline total interest minus the accelerated total interest, and this value should be non-negative.

**Validates: Requirements 6.2**

### Property 13: Early Payoff Payment Amount

*For any* early payoff strategy, the new payment amount should equal the base payment plus additional monthly payment plus the amortized lump sum payment.

**Validates: Requirements 6.3**

### Property 14: Early Payoff Term Reduction

*For any* early payoff strategy with additional payments greater than zero, the loan term should be reduced compared to the baseline term.

**Validates: Requirements 6.4**

### Property 15: Early Payoff Frequency Recalculation

*For any* change to the early payoff frequency, the payment amount and savings should be recalculated to reflect the new frequency's payment schedule.

**Validates: Requirements 6.7**

### Property 16: Lump Sum Impact

*For any* lump sum payment greater than zero, the total interest paid should be less than without the lump sum, and the loan term should be shorter.

**Validates: Requirements 6.11**

### Property 17: Insurance Mode Conversion Round Trip

*For any* insurance amount and home value, converting from dollar to percent and back to dollar should produce the original dollar amount (within rounding tolerance), and converting from percent to dollar and back to percent should produce the original percent.

**Validates: Requirements 7.4, 7.5**

### Property 18: Insurance Percentage Mode Reactivity

*For any* home value change when in percentage mode, the insurance dollar amount should be recalculated as (home value × insurance percent / 100).

**Validates: Requirements 7.6**

### Property 19: Insurance Mode Calculation Equivalence

*For any* insurance amount entered in either dollar or percent mode, the resulting monthly insurance payment should be the same regardless of which input mode was used.

**Validates: Requirements 7.7**

### Property 20: Currency Precision

*For any* calculated currency value, the displayed amount should be rounded to exactly two decimal places.

**Validates: Requirements 8.3**

### Property 21: Percentage Precision

*For any* calculated percentage value, the displayed amount should be rounded to exactly four decimal places.

**Validates: Requirements 8.4**

## Error Handling

### Input Validation

All numeric inputs must be validated to prevent invalid calculations:

1. **Negative Values**: Reject negative values for all monetary inputs (home price, down payment, insurance, etc.)
2. **Zero Home Value**: When home value is zero, percentage-based calculations should default to zero
3. **Zero Interest Rate**: When interest rate is zero, use simple division for payment calculation (principal / term)
4. **Invalid Dates**: When first payment date is invalid or not provided, use default (current date + 30 days)
5. **Excessive Extra Payments**: When extra payment exceeds the monthly principal & interest, cap it at the P&I amount to prevent negative balances

### Calculation Edge Cases

1. **Division by Zero**: Protect against division by zero in percentage calculations when home value is zero
2. **Loan Term Zero**: Prevent calculations when loan term is zero or negative
3. **NaN Results**: Check for NaN results and default to zero with appropriate error handling
4. **Infinite Loops**: Ensure amortization calculations have a maximum iteration limit to prevent infinite loops

### Error Display

When errors occur:
- Display zero values rather than error messages in result fields
- Maintain UI stability (no crashes or blank screens)
- Log errors to console for debugging
- Preserve user input values even when calculations fail

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs
- Both approaches are complementary and necessary for complete validation

### Unit Testing

Unit tests should focus on:

1. **Specific Examples**:
   - First-time VA loan with $300,000 home, 0% down, 30-year term at 5% interest
   - Subsequent VA loan with $500,000 home, 10% down, 15-year term at 4.5% interest
   - Exempt VA loan with $250,000 home, 5% down, 20-year term at 6% interest

2. **Edge Cases**:
   - Zero home value
   - Zero interest rate
   - Zero down payment
   - Maximum loan term (40 years)
   - Minimum loan term (1 year)
   - Extra payment equal to monthly P&I
   - Extra payment exceeding monthly P&I

3. **Integration Points**:
   - Component rendering with various prop combinations
   - State updates triggering recalculations
   - Toggle switches changing calculation modes
   - Date picker integration

4. **Error Conditions**:
   - Invalid numeric inputs (NaN, Infinity)
   - Negative values
   - Missing required fields
   - Invalid date selections

### Property-Based Testing

Property-based tests should be implemented using **fast-check** (for TypeScript/JavaScript) with the following configuration:

- **Minimum 100 iterations per test** to ensure comprehensive input coverage
- **Tag format**: `// Feature: va-purchase-calculator-enhancements, Property {number}: {property_text}`
- Each correctness property must be implemented by a single property-based test

#### Test Generators

Create generators for:

```typescript
// Arbitrary home values: $50,000 to $2,000,000
const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })

// Arbitrary down payment percentages: 0% to 20%
const arbDownPaymentPercent = fc.float({ min: 0, max: 20 })

// Arbitrary interest rates: 2% to 10%
const arbInterestRate = fc.float({ min: 2, max: 10 })

// Arbitrary loan terms: 5 to 40 years
const arbLoanTermYears = fc.integer({ min: 5, max: 40 })

// Arbitrary VA funding fee types
const arbVAFeeType = fc.constantFrom('first-time', 'subsequent', 'exempt')

// Arbitrary payment frequencies
const arbPaymentFrequency = fc.constantFrom('monthly', 'bi-weekly', 'weekly')

// Arbitrary extra payments: $0 to $2,000
const arbExtraPayment = fc.float({ min: 0, max: 2000 })

// Arbitrary lump sum frequencies
const arbLumpSumFrequency = fc.constantFrom('one-time', 'yearly', 'quarterly')
```

#### Property Test Examples

```typescript
// Property 1: VA Funding Fee Calculation Correctness
// Feature: va-purchase-calculator-enhancements, Property 1: VA funding fee calculation correctness
fc.assert(
  fc.property(arbHomeValue, arbDownPaymentPercent, arbVAFeeType, (homeValue, downPercent, feeType) => {
    const baseMortgage = homeValue * (1 - downPercent / 100)
    const expectedRate = feeType === 'first-time' ? 0.0215 : feeType === 'subsequent' ? 0.033 : 0
    const calculatedFee = calculateVAFundingFee(baseMortgage, feeType)
    const expectedFee = baseMortgage * expectedRate
    
    return Math.abs(calculatedFee - expectedFee) < 0.01 // Within 1 cent
  }),
  { numRuns: 100 }
)

// Property 5: Payment Frequency Proportional Adjustment
// Feature: va-purchase-calculator-enhancements, Property 5: Payment frequency proportional adjustment
fc.assert(
  fc.property(arbHomeValue, arbInterestRate, arbLoanTermYears, arbPaymentFrequency, 
    (homeValue, rate, term, frequency) => {
      const monthlyPayment = calculateMonthlyPayment(homeValue, rate, term)
      const adjustedPayment = adjustPaymentForFrequency(monthlyPayment, frequency)
      const periodsPerYear = getPeriodsPerYear(frequency)
      const annualPayment = adjustedPayment * periodsPerYear
      const expectedAnnual = monthlyPayment * 12
      
      return Math.abs(annualPayment - expectedAnnual) < 1.0 // Within $1
    }),
  { numRuns: 100 }
)

// Property 17: Insurance Mode Conversion Round Trip
// Feature: va-purchase-calculator-enhancements, Property 17: Insurance mode conversion round trip
fc.assert(
  fc.property(arbHomeValue, fc.float({ min: 500, max: 5000 }), (homeValue, insuranceDollar) => {
    if (homeValue === 0) return true // Skip division by zero
    
    const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
    const backToDollar = convertInsurancePercentToDollar(percent, homeValue)
    
    return Math.abs(backToDollar - insuranceDollar) < 0.01 // Within 1 cent
  }),
  { numRuns: 100 }
)
```

### Test Organization

Tests should be organized as follows:

```
app/calculator/va-purchase/__tests__/
  ├── page.test.tsx                    # Existing component tests
  ├── calculations.test.ts             # Unit tests for calculation functions
  ├── calculations.property.test.ts    # Property-based tests for calculations
  ├── vaFundingFee.test.ts            # Unit tests for VA funding fee logic
  ├── paymentFrequency.test.ts        # Unit tests for payment frequency logic
  └── earlyPayoff.test.ts             # Unit tests for early payoff calculations
```

### Coverage Goals

- **Line Coverage**: Minimum 90%
- **Branch Coverage**: Minimum 85%
- **Function Coverage**: 100% for all calculation functions
- **Property Coverage**: 100% of all correctness properties must have corresponding property tests

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every pull request
- Include both test types in CI/CD pipeline
- Fail builds if any test fails or coverage drops below thresholds
