# Implementation Plan: VA Purchase Calculator Enhancements

## Overview

This implementation plan extends the existing VA Purchase Calculator with comprehensive enhancements including VA funding fee calculations, payment frequency options, early payoff strategies, and enhanced results displays. The implementation will modify the existing component at `app/calculator/va-purchase/page.tsx` while preserving the current design and functionality.

## Tasks

- [x] 1. Add VA Funding Fee state and calculation logic
  - Add state for VA funding fee type (first-time, subsequent, exempt)
  - Implement `calculateVAFundingFee` function
  - Add state for calculated VA funding fee amount
  - Add state for final mortgage amount
  - Update calculation logic to compute VA funding fee based on selected type
  - Update calculation logic to compute final mortgage amount (base + fee)
  - _Requirements: 1.5, 1.6, 1.7, 1.9, 1.10_

- [x] 1.1 Write property test for VA funding fee calculation
  - **Property 1: VA Funding Fee Calculation Correctness**
  - **Validates: Requirements 1.5, 1.6, 1.7**

- [x] 1.2 Write property test for final mortgage amount calculation
  - **Property 2: Final Mortgage Amount Calculation**
  - **Validates: Requirements 1.9**

- [x] 1.3 Write property test for VA funding fee reactivity
  - **Property 3: VA Funding Fee Reactivity**
  - **Validates: Requirements 1.10**

- [x] 2. Add VA Funding Fee UI components
  - Add radio button group labeled "This is my..." to input panel
  - Add three radio options: "First Time Use of a VA Loan" (default), "I have used a VA loan before", "I am exempt from the VA funding fee"
  - Add display field for calculated VA Funding Fee amount
  - Add display field for Final Mortgage Amount
  - Wire radio buttons to state changes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.8_

- [x] 3. Add payment frequency state and calculation logic
  - Add state for payment frequency (monthly, bi-weekly, weekly)
  - Implement `getPeriodsPerYear` function
  - Implement `adjustPaymentForFrequency` function
  - Update calculation logic to adjust payments based on frequency
  - Update display labels to show frequency-specific text (per month, per bi-weekly period, per week)
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 3.1 Write property test for payment frequency period calculation
  - **Property 4: Payment Frequency Period Calculation**
  - **Validates: Requirements 2.2, 2.3, 2.4**

- [x] 3.2 Write property test for payment frequency proportional adjustment
  - **Property 5: Payment Frequency Proportional Adjustment**
  - **Validates: Requirements 2.5**

- [x] 4. Add payment frequency UI components
  - Add toggle control with three options: "Monthly", "Bi-weekly", "Weekly"
  - Wire toggle to payment frequency state
  - Update payment breakdown display to show payment per period
  - Update center panel donut chart label to show frequency-specific text
  - _Requirements: 2.1_

- [x] 5. Add first payment date functionality
  - Add state for first payment date
  - Implement `getDefaultFirstPaymentDate` function (current date + 30 days)
  - Implement `calculatePaymentSchedule` function
  - Add date picker input field labeled "First Payment Date"
  - Wire date picker to state
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5.1 Write property test for payment schedule start date
  - **Property 6: Payment Schedule Start Date**
  - **Validates: Requirements 3.3**

- [x] 6. Add extra payment functionality
  - Add state for extra payment per month
  - Update total monthly payment calculation to include extra payment
  - Update payment breakdown to include extra payment line item (when > 0)
  - Implement enhanced `calculateAmortization` function with extra payment parameter
  - Update total interest and loan term calculations to account for extra payments
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6.1 Write property test for extra payment addition
  - **Property 7: Extra Payment Addition**
  - **Validates: Requirements 4.2**

- [x] 6.2 Write property test for extra payment interest reduction
  - **Property 8: Extra Payment Interest Reduction**
  - **Validates: Requirements 4.4**

- [x] 7. Add extra payment UI components
  - Add input field labeled "Extra Payment Per Month" to input panel
  - Wire input to extra payment state
  - Add "Extra Payment" line item to payment breakdown legend (conditional on > 0)
  - Update donut chart to include extra payment segment (when > 0)
  - _Requirements: 4.1_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Enhance results display with comprehensive payment information
  - Update "All Payment" card to show total payment over loan term
  - Update "Total Loan Amount" card to show final mortgage amount
  - Update "Total Interest Paid" calculation to use final mortgage amount
  - Add payment breakdown section with all components (P&I, Taxes, Insurance, HOA, Extra Payment)
  - Ensure HOA Dues only appears when > 0
  - Ensure Extra Payment only appears when > 0
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

- [x] 9.1 Write property test for total payment calculation
  - **Property 9: Total Payment Calculation**
  - **Validates: Requirements 5.1**

- [x] 9.2 Write property test for total interest calculation
  - **Property 10: Total Interest Calculation**
  - **Validates: Requirements 5.3**

- [x] 9.3 Write property test for conditional display elements
  - **Property 11: Conditional Display Elements**
  - **Validates: Requirements 5.8, 5.9, 5.14, 5.17**

- [x] 10. Add monthly payment summary section
  - Create new Card component in results panel for monthly payment summary
  - Add "Home Value" display
  - Add "Mortgage Amount" (Final Mortgage Amount) display
  - Add "Monthly Principal & Interest" display
  - Add "Monthly Extra Payment" display (conditional on > 0)
  - Add "Monthly Property Tax" display
  - Add "Monthly Home Insurance" display
  - Add "Monthly HOA Fees" display (conditional on > 0)
  - _Requirements: 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17_

- [x] 11. Add early payoff strategy state and calculation logic
  - Add state for additional monthly payment
  - Add state for early payoff frequency
  - Add state for lump sum amount
  - Add state for lump sum frequency
  - Implement `calculateEarlyPayoffStrategy` function
  - Add state for early payoff results (savings, payment amount, term reduction)
  - Update calculation logic to compute early payoff metrics
  - _Requirements: 6.2, 6.3, 6.4, 6.7, 6.11, 6.12_

- [x] 11.1 Write property test for early payoff interest savings
  - **Property 12: Early Payoff Interest Savings**
  - **Validates: Requirements 6.2**

- [x] 11.2 Write property test for early payoff payment amount
  - **Property 13: Early Payoff Payment Amount**
  - **Validates: Requirements 6.3**

- [x] 11.3 Write property test for early payoff term reduction
  - **Property 14: Early Payoff Term Reduction**
  - **Validates: Requirements 6.4**

- [x] 11.4 Write property test for early payoff frequency recalculation
  - **Property 15: Early Payoff Frequency Recalculation**
  - **Validates: Requirements 6.7**

- [x] 11.5 Write property test for lump sum impact
  - **Property 16: Lump Sum Impact**
  - **Validates: Requirements 6.11**

- [x] 12. Add early payoff strategy UI section
  - Create new Card component in results panel for "Early Payoff Strategy"
  - Add "Savings" display showing interest saved
  - Add "Payment Amount" display showing new payment with strategy
  - Add "Shorten Loan Term By" display showing months/years saved
  - Add input field labeled "Additional Monthly"
  - Add dropdown labeled "Increase Frequency" with options: Monthly, Bi-weekly, Weekly
  - Add "Lump Sum Payment" subsection
  - Add input field labeled "Lump Sum Addition"
  - Add dropdown labeled "Frequency" with options: One time, Yearly, Quarterly
  - Wire all inputs to state
  - _Requirements: 6.1, 6.5, 6.6, 6.8, 6.9, 6.10_

- [x] 13. Add homeowners insurance toggle functionality
  - Add state for insurance input mode (dollar/percent)
  - Add state for insurance dollar amount
  - Add state for insurance percent amount
  - Implement `convertInsuranceDollarToPercent` function
  - Implement `convertInsurancePercentToDollar` function
  - Add useEffect hook to sync insurance values when mode changes
  - Add useEffect hook to recalculate insurance dollar when home value changes (in percent mode)
  - Update monthly payment calculation to use insurance amount regardless of mode
  - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 13.1 Write property test for insurance mode conversion round trip
  - **Property 17: Insurance Mode Conversion Round Trip**
  - **Validates: Requirements 7.4, 7.5**

- [x] 13.2 Write property test for insurance percentage mode reactivity
  - **Property 18: Insurance Percentage Mode Reactivity**
  - **Validates: Requirements 7.6**

- [x] 13.3 Write property test for insurance mode calculation equivalence
  - **Property 19: Insurance Mode Calculation Equivalence**
  - **Validates: Requirements 7.7**

- [x] 14. Add homeowners insurance toggle UI
  - Add toggle control for homeowners insurance with two options: "$" and "%"
  - Update existing insurance input to show dollar or percent based on mode
  - Wire toggle to insurance mode state
  - Ensure toggle matches existing design patterns (similar to down payment toggle)
  - _Requirements: 7.1_

- [x] 15. Add calculation precision and error handling
  - Implement `formatCurrency` function to round to 2 decimal places
  - Implement `formatPercent` function to round to 4 decimal places
  - Apply currency formatting to all monetary displays
  - Apply percent formatting to all percentage displays
  - Add validation to prevent negative values in all monetary inputs
  - Add error handling for division by zero (when home value is 0)
  - Add error handling for zero interest rate (use simple division)
  - Add error handling for invalid dates (use default)
  - Add error handling for excessive extra payments (cap at P&I)
  - _Requirements: 8.3, 8.4, 8.5_

- [x] 15.1 Write property test for currency precision
  - **Property 20: Currency Precision**
  - **Validates: Requirements 8.3**

- [x] 15.2 Write property test for percentage precision
  - **Property 21: Percentage Precision**
  - **Validates: Requirements 8.4**

- [x] 15.3 Write unit tests for error handling edge cases
  - Test zero home value
  - Test zero interest rate
  - Test invalid dates
  - Test excessive extra payments
  - _Requirements: 8.5_

- [x] 16. Update CSS for new components
  - Add styles for VA funding fee radio button group
  - Add styles for payment frequency toggle
  - Add styles for date picker
  - Add styles for monthly payment summary card
  - Add styles for early payoff strategy section
  - Ensure all new styles match existing design system
  - Ensure responsive behavior is maintained
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 17. Final checkpoint - Ensure all tests pass and UI is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- All enhancements preserve the existing three-panel layout and design system
- The implementation modifies the existing component rather than creating new files
