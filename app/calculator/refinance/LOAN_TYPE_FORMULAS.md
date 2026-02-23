# Refinance Calculator - Loan Type Formulas

This document explains the PMI/MIP calculation formulas for each loan type in the refinance calculator.

## Overview

The refinance calculator supports five loan types, each with different mortgage insurance requirements:

1. **Conventional**
2. **FHA**
3. **VA**
4. **USDA**
5. **Jumbo**

## Formula Details

### 1. Conventional Loans

**PMI (Private Mortgage Insurance)**

- **When Required**: Typically required when LTV (Loan-to-Value) > 80%
- **Manual Input**: User can specify exact PMI amount in "PMI (Yearly)" field
- **Auto-Calculation**: If no manual input, estimates at **0.5% annually** of loan balance
- **Formula**: 
  ```
  Monthly PMI = (Loan Balance × 0.005) / 12
  ```
- **Example**: $200,000 loan = $83.33/month PMI
- **Removal**: Can be removed once equity reaches 20% (LTV ≤ 80%)

### 2. FHA Loans

**MIP (Mortgage Insurance Premium)**

- **When Required**: Required for all FHA loans
- **Manual Input**: User can specify exact MIP amount in "PMI (Yearly)" field
- **Auto-Calculation**: If no manual input, uses standard **0.85% annually** of loan balance
- **Formula**:
  ```
  Monthly MIP = (Loan Balance × 0.0085) / 12
  ```
- **Example**: $200,000 loan = $141.67/month MIP
- **Removal**: 
  - If down payment ≥ 10%: Can be removed after 11 years
  - If down payment < 10%: Required for life of loan
- **Note**: FHA also has an upfront MIP (1.75% of loan amount) not included in monthly payment

### 3. VA Loans

**No Monthly PMI/MIP**

- **When Required**: Never - VA loans do not have monthly mortgage insurance
- **Manual Input**: Ignored for VA loans
- **Auto-Calculation**: Always $0
- **Formula**:
  ```
  Monthly PMI = 0
  ```
- **Note**: VA loans have a one-time funding fee (varies by usage and down payment) that's paid upfront or rolled into the loan, but no monthly insurance premium

### 4. USDA Loans

**Guarantee Fee**

- **When Required**: Required for all USDA loans
- **Manual Input**: User can specify exact fee amount in "PMI (Yearly)" field
- **Auto-Calculation**: If no manual input, uses standard **0.35% annually** of loan balance
- **Formula**:
  ```
  Monthly Guarantee Fee = (Loan Balance × 0.0035) / 12
  ```
- **Example**: $200,000 loan = $58.33/month guarantee fee
- **Removal**: Required for life of loan
- **Note**: USDA also has an upfront guarantee fee (1% of loan amount) not included in monthly payment

### 5. Jumbo Loans

**PMI (Private Mortgage Insurance)**

- **When Required**: Typically not required if borrower has 20%+ equity
- **Manual Input**: User can specify exact PMI amount in "PMI (Yearly)" field
- **Auto-Calculation**: Defaults to **$0** (assumes sufficient equity)
- **Formula**:
  ```
  Monthly PMI = Manual Input / 12 (or 0 if not provided)
  ```
- **Example**: If user enters $2,400/year = $200/month PMI
- **Note**: Jumbo loans have stricter qualification requirements and typically require larger down payments, so PMI is less common

## Principal & Interest Calculation

All loan types use the same P&I formula:

```
Monthly P&I = L × [r(1 + r)^n] / [(1 + r)^n - 1]

Where:
L = Loan Balance
r = Monthly Interest Rate (Annual Rate / 12)
n = Number of Payments (Term in months)
```

**Special Case - Zero Interest Rate**:
```
Monthly P&I = Loan Balance / Term in Months
```

## Total Monthly Payment

```
Total Monthly Payment = P&I + Property Tax + Insurance + PMI/MIP + HOA Dues
```

## Savings Calculations

**Monthly Savings**:
```
Monthly Savings = Current Monthly Payment - New Monthly Payment
```

**Break-Even Point**:
```
Break-Even Months = Closing Costs / Monthly Savings
```

**Total Savings Over Life of Loan**:
```
Total Savings = (Monthly Savings × New Loan Term in Months) - Closing Costs
```

## Important Notes

1. **Manual PMI Input**: Users can always override auto-calculated PMI/MIP by entering a value in the "PMI (Yearly)" field
2. **LTV Limitations**: The calculator doesn't track home value, so it can't automatically determine if PMI is required based on LTV
3. **Upfront Fees**: FHA upfront MIP (1.75%) and USDA upfront guarantee fee (1%) are not included in monthly payment calculations
4. **VA Funding Fee**: VA one-time funding fee (varies 1.4%-3.6%) is not included in monthly payment calculations
5. **Rate Accuracy**: PMI/MIP rates are estimates and may vary based on credit score, LTV, and lender

## Testing

All formulas are validated in `__tests__/loanTypeFormulas.test.ts` with 15 test cases covering:
- Manual PMI input handling
- Auto-calculation for each loan type
- P&I calculations
- Savings calculations
- Edge cases (zero interest rate, etc.)
