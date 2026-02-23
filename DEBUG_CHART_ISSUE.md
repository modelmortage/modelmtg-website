# Debug Chart Issue - Step by Step

## Test the Export

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open calculator**
   - Go to: http://localhost:3000/calculator/va-purchase
   - Fill in some values

3. **Open browser console**
   - Press F12
   - Go to "Console" tab

4. **Click "Export to PDF"**

5. **Check console output**

## What to Look For

### Good Output (Chart Working)
```
=== PDF Export Debug ===
Chart element: <div class="pieChart">
Chart element type: DIV
Chart element class: pieChart
Chart visible: true
Chart dimensions: 300 x 300
Chart children: 1
========================
Attempting to capture chart...
Chart element before capture: {width: 300, height: 300, display: "block", visibility: "visible"}
Canvas created: 600 x 600
Image data length: 45678
Adding chart to PDF: 120 x 120
Chart added successfully
```

### Bad Output (Chart Not Working)
```
=== PDF Export Debug ===
Chart element: null          ← PROBLEM: ref not attached
========================
No chart element provided
```

OR

```
=== PDF Export Debug ===
Chart element: <div class="pieChart">
Chart dimensions: 0 x 0      ← PROBLEM: chart not visible
========================
```

## Common Issues & Fixes

### Issue 1: Chart element is null

**Cause**: The `chartRef` is not attached to the element

**Check**:
```tsx
// In app/calculator/va-purchase/page.tsx
// Make sure this line exists:
const { chartRef, getExportData } = useCalculatorExport('VA Purchase')

// And this:
<div ref={chartRef} className={styles.pieChart}>
```

**Fix**: Verify the ref is on the correct element

### Issue 2: Chart dimensions are 0 x 0

**Cause**: Chart is hidden or not rendered

**Check**:
- Is the chart visible on the page?
- Is it in a collapsed section?
- Does it have CSS `display: none`?

**Fix**: Make sure chart is visible when exporting

### Issue 3: Canvas created but size is wrong

**Cause**: Chart has unusual dimensions

**Check console for**:
```
Canvas created: 10 x 10    ← Too small
```

**Fix**: Adjust chart container size in CSS

### Issue 4: html2canvas error

**Cause**: Chart uses unsupported CSS or external resources

**Check console for**:
```
Failed to capture chart: Error: ...
```

**Fix**: Simplify chart styles or add CORS headers

## Manual Test

Test html2canvas directly in console:

```javascript
// Get the chart element
const chart = document.querySelector('[class*="pieChart"]')
console.log('Chart found:', chart)
console.log('Chart size:', chart?.offsetWidth, 'x', chart?.offsetHeight)

// Test capture
if (chart) {
  import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
    .then(module => {
      const html2canvas = module.default
      return html2canvas(chart, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: true
      })
    })
    .then(canvas => {
      console.log('Success! Canvas:', canvas.width, 'x', canvas.height)
      // Show the canvas
      canvas.style.border = '2px solid red'
      document.body.appendChild(canvas)
    })
    .catch(err => {
      console.error('Failed:', err)
    })
}
```

This will show the captured chart on the page.

## Check Calculation Issue

The $13 million interest is wrong. Check these values in console:

```javascript
// When on calculator page, check:
console.log('Loan Amount:', results.loanAmount)
console.log('Interest Rate:', values.interestRate)
console.log('Term Months:', results.actualTermMonths)  // Should be 360, not 720
console.log('Total Interest:', results.totalInterestPaid)
```

If `actualTermMonths` is 720 instead of 360, that's the problem.

## Expected Values

For a $180,000 loan at 5% for 30 years:
- Monthly Payment: ~$966
- Total Interest: ~$167,000
- Actual Term: 360 months

If you see:
- Actual Term: 720 months ← WRONG
- Total Interest: $13 million ← WRONG

Then the calculation loop is running twice as long as it should.

## Next Steps

1. Run the test above
2. Copy the console output
3. Share what you see

The debug logs will tell us exactly what's happening with the chart.
