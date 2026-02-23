# Adding PDF Export to All Calculators

This guide shows how to add PDF export to each calculator type.

## Calculator Types to Update

Based on your file structure, here are the calculators that can have PDF export added:

1. ✅ **VA Purchase** - Already implemented
2. **VA Refinance** - `/app/calculator/va-refinance/page.tsx`
3. **Purchase** - `/app/calculator/purchase/page.tsx`
4. **Refinance** - `/app/calculator/refinance/page.tsx`
5. **DSCR** - `/app/calculator/dscr/page.tsx`
6. **Affordability** - `/app/calculator/affordability/page.tsx`
7. **Rent vs Buy** - `/app/calculator/rent-vs-buy/page.tsx`
8. **Fix & Flip** - `/app/calculator/fix-flip/page.tsx`

## Steps for Each Calculator

### 1. Add Imports

At the top of the calculator file, add:

```tsx
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
```

### 2. Initialize Hook

Inside the component function, add:

```tsx
const { chartRef, getExportData } = useCalculatorExport('Calculator Name')
```

Replace 'Calculator Name' with the appropriate name:
- 'VA Refinance'
- 'Purchase'
- 'Refinance'
- 'DSCR'
- 'Affordability'
- 'Rent vs Buy'
- 'Fix & Flip'

### 3. Add Export Button

Find where you want the button (usually near the title or results) and add:

```tsx
<ExportPDFButton 
  calculatorData={getExportData(values, results)}
/>
```

### 4. Attach Chart Reference

Find your chart/visualization element and add the ref:

```tsx
<div ref={chartRef} className={styles.pieChart}>
  {/* existing chart code */}
</div>
```

## Example: Adding to Purchase Calculator

```tsx
// app/calculator/purchase/page.tsx

'use client'

import { useState, useEffect } from 'react'
// ... other imports
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'

export default function PurchaseCalculator() {
  // Add this line
  const { chartRef, getExportData } = useCalculatorExport('Purchase')
  
  const [values, setValues] = useState({ /* ... */ })
  const [results, setResults] = useState({ /* ... */ })

  return (
    <div>
      {/* Add export button */}
      <div className="header">
        <h2>Purchase Calculator</h2>
        <ExportPDFButton 
          calculatorData={getExportData(values, results)}
        />
      </div>

      {/* Attach ref to chart */}
      <div ref={chartRef} className="chart">
        {/* chart content */}
      </div>
    </div>
  )
}
```

## Testing Checklist

For each calculator after adding export:

- [ ] Button appears and is clickable
- [ ] PDF generates without errors
- [ ] Logo appears in PDF
- [ ] Chart is captured correctly
- [ ] All results are included
- [ ] PDF downloads automatically
- [ ] File appears in Supabase Storage
- [ ] Metadata saved to database

## Customization Per Calculator

If a calculator needs special formatting in the PDF:

1. Create a custom export function in `lib/pdf/`
2. Extend the `CalculatorData` interface
3. Add calculator-specific formatting logic

Example:

```tsx
// lib/pdf/exportDSCRCalculatorPDF.ts
export async function exportDSCRCalculatorPDF(data: DSCRCalculatorData) {
  // Custom DSCR formatting
  // Include rental income breakdown
  // Add DSCR ratio visualization
}
```
