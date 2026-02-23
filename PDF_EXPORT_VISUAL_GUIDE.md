# PDF Export - Visual Implementation Guide

## 🎯 What You Get

```
┌─────────────────────────────────────┐
│  [Your Logo]                        │
│                                     │
│  VA Purchase Calculator             │
│  Generated: 02/23/2026              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │    Payment Breakdown Chart    │ │
│  │         (Captured)            │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Calculation Results                │
│  ─────────────────────────────────  │
│  Total Monthly Payment:  $2,450.00  │
│  Principal Interest:     $1,800.00  │
│  Property Tax:             $200.00  │
│  Insurance:                $100.00  │
│  Loan Amount:          $350,000.00  │
│  ...                                │
└─────────────────────────────────────┘
```

## 📊 Architecture

```
User Clicks Export
       ↓
┌──────────────────────────────────────┐
│  Rate Limit Check                    │
│  - Generate browser fingerprint      │
│  - Query last 24h exports            │
│  - Count: 8/15 used                  │
│  - Decision: ALLOW (7 remaining)     │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  ExportPDFButton Component           │
│  - Handles click event               │
│  - Shows loading state               │
│  - Displays remaining exports        │
│  - Shows errors                      │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  useCalculatorExport Hook            │
│  - Provides chartRef                 │
│  - Prepares export data              │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  exportCalculatorPDF Function        │
│  1. Load logo image                  │
│  2. Create PDF with jsPDF            │
│  3. Capture chart with html2canvas   │
│  4. Format and add results           │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  Supabase Integration                │
│  1. Upload PDF to Storage            │
│  2. Save metadata + fingerprint      │
│  3. Generate public URL              │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  Download to User                    │
│  - Automatic download triggered      │
│  - File saved locally                │
│  - Rate limit counter updated        │
└──────────────────────────────────────┘
```

## 🗂️ File Structure

```
mockuprealestate/
├── lib/
│   ├── pdf/
│   │   ├── exportCalculatorPDF.ts    ← Core PDF logic
│   │   ├── rateLimiter.ts            ← Rate limiting (15/day)
│   │   ├── README.md                 ← Module docs
│   │   └── RATE_LIMITING.md          ← Rate limit docs
│   └── supabase/
│       └── client.ts                 ← Supabase config
├── components/
│   └── ExportPDFButton.tsx           ← Export button UI
├── hooks/
│   └── useCalculatorExport.ts        ← React hook
├── supabase/
│   └── migrations/
│       └── 001_create_calculator_exports.sql
├── scripts/
│   ├── setup-pdf-export.sql          ← Run this in Supabase
│   └── add-export-to-calculators.md  ← Guide for other calculators
├── examples/
│   └── add-pdf-export-example.tsx    ← Code example
├── public/
│   └── model-mortage-logo.png        ← Your logo
├── QUICK_START.md                    ← Start here!
├── SETUP_INSTRUCTIONS.md             ← Detailed setup
└── PDF_EXPORT_IMPLEMENTATION.md      ← Complete overview
```

## 🔄 Data Flow

```
Calculator Component
├── values (inputs)
│   ├── homePrice: "300000"
│   ├── downPayment: "60000"
│   └── interestRate: "6.5"
│
└── results (calculations)
    ├── monthlyPayment: 1517.50
    ├── totalInterest: 246300.00
    └── loanAmount: 240000.00

        ↓ getExportData()

CalculatorData Object
├── calculatorType: "VA Purchase"
├── inputs: { homePrice, downPayment, ... }
├── results: { monthlyPayment, totalInterest, ... }
└── chartElement: <div ref={chartRef}>...</div>

        ↓ exportCalculatorPDF()

PDF Document
├── Page 1
│   ├── Logo
│   ├── Title & Date
│   ├── Chart Image
│   └── Results (partial)
└── Page 2 (if needed)
    └── Results (continued)

        ↓ Upload to Supabase

Storage & Database
├── Storage: calculator-exports/calculator-export-1234567890.pdf
└── Database: calculator_exports table
    ├── id: uuid
    ├── calculator_type: "VA Purchase"
    ├── file_path: "calculator-export-1234567890.pdf"
    ├── inputs: { ... }
    └── results: { ... }

        ↓ Return URL

Public URL
https://xbboivceqbyejrfwjrja.supabase.co/storage/v1/object/public/calculator-exports/calculator-export-1234567890.pdf
```

## 🎨 Component Integration

### Before (Calculator without export):
```tsx
export default function Calculator() {
  const [values, setValues] = useState({ ... })
  const [results, setResults] = useState({ ... })

  return (
    <div>
      <h2>Calculator</h2>
      <div className="chart">
        {/* Chart */}
      </div>
      <div className="results">
        {/* Results */}
      </div>
    </div>
  )
}
```

### After (Calculator with export):
```tsx
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'

export default function Calculator() {
  const { chartRef, getExportData } = useCalculatorExport('Calculator')
  const [values, setValues] = useState({ ... })
  const [results, setResults] = useState({ ... })

  return (
    <div>
      <div className="header">
        <h2>Calculator</h2>
        <ExportPDFButton 
          calculatorData={getExportData(values, results)}
        />
      </div>
      <div ref={chartRef} className="chart">
        {/* Chart - will be captured */}
      </div>
      <div className="results">
        {/* Results */}
      </div>
    </div>
  )
}
```

## 🗄️ Database Schema Visual

```
┌─────────────────────────────────────────────────────────┐
│  calculator_exports TABLE                               │
├─────────────────────────────────────────────────────────┤
│  id                UUID (PK)                             │
│  calculator_type   TEXT         "VA Purchase"           │
│  file_path         TEXT         "calculator-export..."  │
│  inputs            JSONB        { homePrice: 300000 }   │
│  results           JSONB        { monthlyPayment: ... } │
│  fingerprint       TEXT         "fp_abc123def456"       │ ← Rate limiting
│  created_at        TIMESTAMPTZ  2026-02-23 10:30:00     │
│  user_id           UUID (FK)    NULL or user reference  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  calculator-exports STORAGE BUCKET                      │
├─────────────────────────────────────────────────────────┤
│  calculator-export-1234567890.pdf                       │
│  calculator-export-1234567891.pdf                       │
│  calculator-export-1234567892.pdf                       │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘

Rate Limit Query (optimized with index):
┌─────────────────────────────────────────────────────────┐
│  SELECT COUNT(*) FROM calculator_exports                │
│  WHERE fingerprint = 'fp_abc123def456'                  │
│    AND created_at > NOW() - INTERVAL '24 hours'         │
│  → Uses: idx_calculator_exports_fingerprint_created     │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Implementation Status

```
Calculators:
├── ✅ VA Purchase      (IMPLEMENTED)
├── ⬜ VA Refinance     (Ready to add)
├── ⬜ Purchase         (Ready to add)
├── ⬜ Refinance        (Ready to add)
├── ⬜ DSCR             (Ready to add)
├── ⬜ Affordability    (Ready to add)
├── ⬜ Rent vs Buy      (Ready to add)
└── ⬜ Fix & Flip       (Ready to add)

Infrastructure:
├── ✅ PDF Generation Library
├── ✅ Supabase Client
├── ✅ Export Button Component
├── ✅ React Hook
├── ✅ Database Migration
├── ✅ Documentation
└── ⬜ Database Setup (Run SQL in Supabase)
```

## 📱 User Experience Flow

```
1. User fills calculator
   ┌─────────────────────┐
   │ Home Price: $300000 │
   │ Down Payment: $60000│
   │ Interest: 6.5%      │
   └─────────────────────┘

2. User sees export button with remaining count
   ┌─────────────────────┐
   │ [📄 Export to PDF]  │
   │ 12 exports remaining│
   └─────────────────────┘

3. User clicks "Export to PDF"
   ┌─────────────────────┐
   │ [📄 Export to PDF]  │ ← Click
   └─────────────────────┘

4. Rate limit check (instant)
   ✓ Fingerprint: fp_abc123
   ✓ Last 24h: 8 exports
   ✓ Remaining: 7
   ✓ Status: ALLOWED

5. Button shows loading
   ┌─────────────────────┐
   │ [⬇️ Exporting...]   │
   └─────────────────────┘

6. PDF generates (2-3 seconds)
   - Logo loaded
   - Chart captured
   - Results formatted
   - Uploaded to Supabase
   - Fingerprint saved

7. Download starts automatically
   ┌─────────────────────┐
   │ ✅ Download started │
   │ 7 exports remaining │
   └─────────────────────┘

8. File saved to Downloads folder
   📄 va-purchase-calculator-1234567890.pdf

--- If user hits limit (15 exports) ---

9. Button becomes disabled
   ┌─────────────────────┐
   │ [⚠️ Limit Reached]  │
   │ Daily limit reached.│
   │ Resets in 3 hours   │
   └─────────────────────┘
```

## 🎯 Next Steps Checklist

```
Setup Phase:
□ Run SQL migration in Supabase dashboard
□ Verify storage bucket created
□ Verify table created
□ Test VA Purchase calculator export

Expansion Phase:
□ Add to VA Refinance calculator
□ Add to Purchase calculator
□ Add to Refinance calculator
□ Add to DSCR calculator
□ Add to Affordability calculator
□ Add to Rent vs Buy calculator
□ Add to Fix & Flip calculator

Polish Phase:
□ Customize logo if needed
□ Adjust PDF layout
□ Add custom styling
□ Test all calculators
□ Deploy to production
```

## 🎯 Quick Reference

**Setup:** `QUICK_START.md`
**Details:** `SETUP_INSTRUCTIONS.md`
**Rate Limiting:** `RATE_LIMITING_SUMMARY.md` or `lib/pdf/RATE_LIMITING.md`
**API Docs:** `lib/pdf/README.md`
**Add to Calculators:** `scripts/add-export-to-calculators.md`
**Example Code:** `examples/add-pdf-export-example.tsx`
