# Calculator PDF Export

This module provides PDF export functionality for calculator pages with Supabase backend integration.

## Features

- Exports calculator results to PDF with company logo
- Captures and includes chart visualizations
- Stores PDFs in Supabase Storage
- Tracks export metadata in Supabase database
- Automatic download after generation

## Usage

### 1. In your calculator component:

```tsx
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'

export default function MyCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('My Calculator')
  
  const [values, setValues] = useState({ /* inputs */ })
  const [results, setResults] = useState({ /* results */ })

  return (
    <div>
      {/* Add export button */}
      <ExportPDFButton 
        calculatorData={getExportData(values, results)}
      />
      
      {/* Wrap your chart with ref */}
      <div ref={chartRef}>
        {/* Your chart component */}
      </div>
    </div>
  )
}
```

### 2. Database Setup

Run the migration to create the necessary tables and storage bucket:

```bash
# Apply migration to Supabase
supabase db push
```

Or manually run the SQL in `supabase/migrations/001_create_calculator_exports.sql`

## Database Schema

### Table: `calculator_exports`
- `id` - UUID primary key
- `calculator_type` - Type of calculator (e.g., "VA Purchase")
- `file_path` - Path to PDF in storage
- `inputs` - JSONB of calculator inputs
- `results` - JSONB of calculator results
- `created_at` - Timestamp
- `user_id` - Optional user reference

### Storage Bucket: `calculator-exports`
- Public bucket for storing generated PDFs
- Files are accessible via public URL

## Customization

### Modify PDF Layout

Edit `lib/pdf/exportCalculatorPDF.ts` to customize:
- Logo size and position
- Page layout
- Result formatting
- Chart positioning

### Add Authentication

To restrict exports to authenticated users, update the RLS policies in the migration file.

## Dependencies

- `jspdf` - PDF generation
- `html2canvas` - Chart capture
- `@supabase/supabase-js` - Backend integration
