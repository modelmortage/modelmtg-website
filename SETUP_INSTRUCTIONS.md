# PDF Export Setup Instructions

## Quick Setup

### 1. Apply Database Migration

Go to your Supabase Dashboard SQL Editor:
https://supabase.com/dashboard/project/xbboivceqbyejrfwjrja/sql

Copy and paste the contents of `scripts/setup-pdf-export.sql` and run it.

This will:
- Create the `calculator-exports` storage bucket
- Create the `calculator_exports` table
- Set up proper indexes and RLS policies

### 2. Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to any calculator page (e.g., `/calculator/va-purchase`)

3. Fill in some values and click the "Export to PDF" button

4. The PDF will be generated with:
   - Your company logo
   - The payment breakdown chart
   - All calculation results
   - Automatically downloaded to your computer

### 3. Verify in Supabase

Check your Supabase dashboard:
- **Storage**: https://supabase.com/dashboard/project/xbboivceqbyejrfwjrja/storage/buckets
  - You should see the `calculator-exports` bucket with uploaded PDFs

- **Table Editor**: https://supabase.com/dashboard/project/xbboivceqbyejrfwjrja/editor
  - Check the `calculator_exports` table for export metadata

## Adding to Other Calculators

To add PDF export to other calculator pages:

1. Import the necessary components:
   ```tsx
   import ExportPDFButton from '@/components/ExportPDFButton'
   import { useCalculatorExport } from '@/hooks/useCalculatorExport'
   ```

2. Use the hook in your component:
   ```tsx
   const { chartRef, getExportData } = useCalculatorExport('Calculator Name')
   ```

3. Add the export button:
   ```tsx
   <ExportPDFButton 
     calculatorData={getExportData(values, results)}
   />
   ```

4. Wrap your chart element with the ref:
   ```tsx
   <div ref={chartRef}>
     {/* Your chart */}
   </div>
   ```

## Customization

### Logo
- Replace `/public/model-mortage-logo.png` with your logo
- Adjust size in `lib/pdf/exportCalculatorPDF.ts` (line 23)

### PDF Layout
- Edit `lib/pdf/exportCalculatorPDF.ts` to customize formatting

### Storage Settings
- Modify bucket settings in Supabase Dashboard > Storage
- Update RLS policies for authentication requirements

## Troubleshooting

### PDF not downloading
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Ensure storage bucket is public

### Rate limit error at database level
- This is expected after 15 exports
- The database RLS policy enforces the limit
- Wait 24 hours or clear old exports from database

### Security warning in Supabase
- If you see "RLS Policy Always True" warning
- Run `scripts/update-rls-policy.sql` to fix
- See `RLS_SECURITY_FIX.md` for details

### Chart not appearing in PDF
- Verify the `chartRef` is attached to the correct element
- Check that the element is visible when export is triggered

### Upload fails
- Check Supabase storage policies
- Verify bucket exists and is public
- Check file size limits (default 50MB)
