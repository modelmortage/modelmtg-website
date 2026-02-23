# PDF Export - Quick Start Guide

## 🎯 Setup (5 minutes)

### Step 1: Run SQL Migration
1. Open: https://supabase.com/dashboard/project/xbboivceqbyejrfwjrja/sql
2. Copy contents of `scripts/setup-pdf-export.sql`
3. Paste and execute

**Security Note**: The migration includes a secure RLS policy with:
- Fingerprint validation
- Calculator type whitelist
- File path validation
- Database-level rate limiting (15/24h)

**If you already ran the old migration**: Run `scripts/update-rls-policy.sql` to fix the security warning.

### Step 2: Test It
```bash
npm run dev
```
Visit: http://localhost:3000/calculator/va-purchase
Click "Export to PDF" button

**Test rate limiting:**
- Watch the "X exports remaining" counter
- Export multiple times to see it decrease
- Button becomes disabled at 15 exports

### Step 3: Verify
- Check Supabase Storage for PDF files
- Check `calculator_exports` table for metadata
- Verify `fingerprint` column exists

## 🔧 Add to Another Calculator (2 minutes)

### 1. Add imports:
```tsx
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
```

### 2. Add hook:
```tsx
const { chartRef, getExportData } = useCalculatorExport('Calculator Name')
```

### 3. Add button:
```tsx
<ExportPDFButton calculatorData={getExportData(values, results)} />
```

### 4. Add ref to chart:
```tsx
<div ref={chartRef}>{/* chart */}</div>
```

## 📋 Checklist

- [ ] SQL migration executed in Supabase
- [ ] Storage bucket `calculator-exports` exists
- [ ] Table `calculator_exports` created with `fingerprint` column
- [ ] VA Purchase calculator tested
- [ ] PDF downloads successfully
- [ ] Logo appears in PDF
- [ ] Chart captured correctly
- [ ] Rate limiting works (shows remaining exports)
- [ ] Limit enforced at 15 exports

## 🎨 Customize

**Logo:** Replace `/public/model-mortage-logo.png`

**PDF Layout:** Edit `lib/pdf/exportCalculatorPDF.ts`

**Button Style:** Edit `components/ExportPDFButton.tsx`

**Rate Limit:** Edit `lib/pdf/rateLimiter.ts` (change MAX_EXPORTS_PER_DAY)

## 📚 Full Documentation

- `RLS_SECURITY_FIX.md` - Security policy fix (IMPORTANT!)
- `RATE_LIMITING_SUMMARY.md` - Rate limiting overview
- `PDF_LAYOUT_IMPROVEMENTS.md` - Layout improvements
- `PDF_EXPORT_IMPLEMENTATION.md` - Complete overview
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `scripts/add-export-to-calculators.md` - Add to all calculators
- `lib/pdf/README.md` - API documentation
- `lib/pdf/RATE_LIMITING.md` - Rate limiting details

## 🚨 Common Issues

**Build fails:** Run `npm install` again

**PDF blank:** Check that chart element has content

**Upload fails:** Verify SQL migration ran successfully

**No button:** Check imports and hook initialization

**Rate limit not working:** Check fingerprint column exists in database

**False rate limit:** Different browsers get different fingerprints (expected)

## ✅ You're Done!

The VA Purchase calculator now has PDF export with rate limiting (15/day). Follow the guide to add it to the other 7 calculators.

**Rate Limiting Features:**
- 15 exports per user per 24 hours
- Shows remaining exports
- Clear feedback when limit reached
- Automatic reset after 24 hours
