# Requirements Document

## Introduction

This document specifies the requirements for enhancing the VA Purchase Calculator with comprehensive features including VA funding fee calculations, payment frequency options, early payoff strategies, and enhanced results displays. The enhancements will provide veterans and service members with more accurate loan calculations and better tools for understanding their mortgage options.

## Glossary

- **VA_Calculator**: The VA Purchase Calculator system at app/calculator/va-purchase/page.tsx
- **VA_Funding_Fee**: A one-time fee charged by the Department of Veterans Affairs to help offset the cost of the VA loan program
- **Base_Mortgage_Amount**: The home value minus the down payment, before adding the VA funding fee
- **Final_Mortgage_Amount**: The Base_Mortgage_Amount plus the VA_Funding_Fee
- **Payment_Frequency**: The interval at which mortgage payments are made (monthly, bi-weekly, or weekly)
- **Extra_Payment**: Additional principal payment made beyond the required payment amount
- **Early_Payoff_Strategy**: A plan to pay off the mortgage faster through extra payments or increased payment frequency
- **Lump_Sum_Payment**: A one-time or recurring large payment applied to the principal
- **Payment_Schedule**: The calculated timeline of all payments based on the first payment date and payment frequency

## Requirements

### Requirement 1: VA Funding Fee Calculation

**User Story:** As a veteran using a VA loan, I want the calculator to automatically determine my VA funding fee based on my loan usage history, so that I can see accurate total loan costs.

#### Acceptance Criteria

1. WHEN the calculator loads, THE VA_Calculator SHALL display a radio button group labeled "This is my..." with three options
2. THE VA_Calculator SHALL provide the option "First Time Use of a VA Loan" as the default selected option
3. THE VA_Calculator SHALL provide the option "I have used a VA loan before"
4. THE VA_Calculator SHALL provide the option "I am exempt from the VA funding fee"
5. WHEN "First Time Use of a VA Loan" is selected, THE VA_Calculator SHALL calculate the VA_Funding_Fee as 2.15% of the Base_Mortgage_Amount
6. WHEN "I have used a VA loan before" is selected, THE VA_Calculator SHALL calculate the VA_Funding_Fee as 3.3% of the Base_Mortgage_Amount
7. WHEN "I am exempt from the VA funding fee" is selected, THE VA_Calculator SHALL set the VA_Funding_Fee to 0%
8. THE VA_Calculator SHALL display the calculated VA_Funding_Fee amount in dollars
9. THE VA_Calculator SHALL calculate the Final_Mortgage_Amount as Base_Mortgage_Amount plus VA_Funding_Fee
10. WHEN the Base_Mortgage_Amount changes, THE VA_Calculator SHALL recalculate the VA_Funding_Fee and Final_Mortgage_Amount

### Requirement 2: Payment Frequency Options

**User Story:** As a borrower, I want to choose different payment frequencies, so that I can see how bi-weekly or weekly payments affect my loan payoff timeline.

#### Acceptance Criteria

1. THE VA_Calculator SHALL provide a toggle control with three options: "Monthly", "Bi-weekly", and "Weekly"
2. WHEN "Monthly" is selected, THE VA_Calculator SHALL calculate payments based on 12 payments per year
3. WHEN "Bi-weekly" is selected, THE VA_Calculator SHALL calculate payments based on 26 payments per year
4. WHEN "Weekly" is selected, THE VA_Calculator SHALL calculate payments based on 52 payments per year
5. WHEN the Payment_Frequency changes, THE VA_Calculator SHALL recalculate all payment amounts proportionally
6. WHEN the Payment_Frequency changes, THE VA_Calculator SHALL update the payment breakdown display to show the new payment amount per period
7. THE VA_Calculator SHALL display the payment frequency label alongside payment amounts (e.g., "per month", "per bi-weekly period", "per week")

### Requirement 3: First Payment Date

**User Story:** As a borrower, I want to specify when my first payment will be due, so that I can see an accurate payment schedule.

#### Acceptance Criteria

1. THE VA_Calculator SHALL provide a date picker input field labeled "First Payment Date"
2. WHEN a date is selected, THE VA_Calculator SHALL store the first payment date
3. THE VA_Calculator SHALL use the first payment date to calculate the Payment_Schedule
4. WHEN the first payment date is not specified, THE VA_Calculator SHALL use the current date plus 30 days as the default

### Requirement 4: Extra Payment Functionality

**User Story:** As a borrower, I want to add extra payments to my monthly payment, so that I can see how additional principal payments reduce my loan term and interest.

#### Acceptance Criteria

1. THE VA_Calculator SHALL provide an input field labeled "Extra Payment Per Month"
2. WHEN an Extra_Payment amount is entered, THE VA_Calculator SHALL add it to the total monthly payment calculation
3. THE VA_Calculator SHALL include the Extra_Payment in the payment breakdown display
4. WHEN Extra_Payment is greater than zero, THE VA_Calculator SHALL recalculate the total interest paid and loan payoff timeline
5. THE VA_Calculator SHALL display the Extra_Payment as a separate line item in the payment breakdown

### Requirement 5: Enhanced Results Display

**User Story:** As a borrower, I want to see comprehensive payment information including total payments, loan amount, and interest paid, so that I can understand the full cost of my loan.

#### Acceptance Criteria

1. THE VA_Calculator SHALL display "Total Payment" showing the sum of all payments over the loan term
2. THE VA_Calculator SHALL display "Total Loan Amount" showing the Final_Mortgage_Amount
3. THE VA_Calculator SHALL display "Total Interest Paid" showing the difference between Total Payment and Total Loan Amount
4. THE VA_Calculator SHALL display a payment breakdown section with all payment components
5. THE VA_Calculator SHALL include "Principal & Interest" in the payment breakdown
6. THE VA_Calculator SHALL include "Taxes" in the payment breakdown
7. THE VA_Calculator SHALL include "Insurance" in the payment breakdown
8. THE VA_Calculator SHALL include "HOA Dues" in the payment breakdown when HOA dues are greater than zero
9. THE VA_Calculator SHALL include "Extra Payment" in the payment breakdown when Extra_Payment is greater than zero
10. THE VA_Calculator SHALL display a monthly payment summary section
11. THE VA_Calculator SHALL show "Home Value" in the monthly payment summary
12. THE VA_Calculator SHALL show "Mortgage Amount" (Final_Mortgage_Amount) in the monthly payment summary
13. THE VA_Calculator SHALL show "Monthly Principal & Interest" in the monthly payment summary
14. THE VA_Calculator SHALL show "Monthly Extra Payment" in the monthly payment summary when Extra_Payment is greater than zero
15. THE VA_Calculator SHALL show "Monthly Property Tax" in the monthly payment summary
16. THE VA_Calculator SHALL show "Monthly Home Insurance" in the monthly payment summary
17. THE VA_Calculator SHALL show "Monthly HOA Fees" in the monthly payment summary when HOA dues are greater than zero

### Requirement 6: Early Payoff Strategy Section

**User Story:** As a borrower, I want to explore early payoff strategies with additional payments and lump sum contributions, so that I can see how much interest I can save and how much faster I can pay off my loan.

#### Acceptance Criteria

1. THE VA_Calculator SHALL provide an "Early Payoff Strategy" section
2. THE VA_Calculator SHALL display "Savings" showing the interest saved compared to the standard payment schedule
3. THE VA_Calculator SHALL display "Payment Amount" showing the new payment amount with early payoff strategies applied
4. THE VA_Calculator SHALL display "Shorten Loan Term By" showing the time saved in months and years
5. THE VA_Calculator SHALL provide an input field labeled "Additional Monthly" for extra monthly payment amounts
6. THE VA_Calculator SHALL provide a dropdown labeled "Increase Frequency" with options: "Monthly", "Bi-weekly", "Weekly"
7. WHEN "Increase Frequency" is changed, THE VA_Calculator SHALL recalculate the payment amount and savings based on the new frequency
8. THE VA_Calculator SHALL provide a "Lump Sum Payment" subsection
9. THE VA_Calculator SHALL provide an input field labeled "Lump Sum Addition" for one-time or recurring lump sum amounts
10. THE VA_Calculator SHALL provide a dropdown labeled "Frequency" with options: "One time", "Yearly", "Quarterly"
11. WHEN a lump sum payment is specified, THE VA_Calculator SHALL include it in the early payoff calculations
12. WHEN early payoff strategies are applied, THE VA_Calculator SHALL recalculate the total interest paid, loan term, and savings
13. THE VA_Calculator SHALL update all displays to reflect the early payoff strategy calculations

### Requirement 7: Homeowners Insurance Input Enhancement

**User Story:** As a borrower, I want to enter homeowners insurance as either a yearly dollar amount or a percentage of home value, so that I can input the information in the format I have available.

#### Acceptance Criteria

1. THE VA_Calculator SHALL provide a toggle control for homeowners insurance with two options: "$" and "%"
2. WHEN "$" is selected, THE VA_Calculator SHALL accept homeowners insurance as a yearly dollar amount
3. WHEN "%" is selected, THE VA_Calculator SHALL accept homeowners insurance as a percentage of home value
4. WHEN the toggle mode changes from "$" to "%", THE VA_Calculator SHALL convert the dollar amount to a percentage based on the home value
5. WHEN the toggle mode changes from "%" to "$", THE VA_Calculator SHALL convert the percentage to a dollar amount based on the home value
6. WHEN the home value changes, THE VA_Calculator SHALL recalculate the insurance dollar amount if the percentage mode is active
7. THE VA_Calculator SHALL use the insurance amount in monthly payment calculations regardless of input mode

### Requirement 8: Calculation Accuracy and Real-Time Updates

**User Story:** As a borrower, I want all calculations to update automatically when I change any input, so that I can see immediate results without manual recalculation.

#### Acceptance Criteria

1. WHEN any input value changes, THE VA_Calculator SHALL recalculate all dependent values automatically
2. THE VA_Calculator SHALL update all displays within 100 milliseconds of an input change
3. THE VA_Calculator SHALL maintain calculation accuracy to two decimal places for currency values
4. THE VA_Calculator SHALL maintain calculation accuracy to four decimal places for percentage values
5. WHEN calculations result in invalid values (negative numbers, division by zero), THE VA_Calculator SHALL display zero or handle the error gracefully

### Requirement 9: User Interface Consistency

**User Story:** As a user, I want the enhanced features to match the existing calculator design and behavior, so that I have a consistent and intuitive experience.

#### Acceptance Criteria

1. THE VA_Calculator SHALL use the existing Input component for all new input fields
2. THE VA_Calculator SHALL use the existing Card component for all new display sections
3. THE VA_Calculator SHALL use the existing toggle button styles for all new toggle controls
4. THE VA_Calculator SHALL maintain the existing three-panel layout (inputs, breakdown, results)
5. THE VA_Calculator SHALL use consistent spacing, typography, and colors with the existing design
6. THE VA_Calculator SHALL maintain responsive behavior on mobile and tablet devices
7. WHEN new sections are added, THE VA_Calculator SHALL integrate them logically within the existing layout structure
