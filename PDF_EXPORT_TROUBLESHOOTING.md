# PDF Export Troubleshooting Guide

## Issue: Logo Looks Weird

### Symptoms
- Logo appears stretched or distorted
- Logo has wrong aspect ratio
- Logo appears pixelated

### Solutions

1. **Check Logo File**
   - Verify `/public/model-mortage-logo.png` exists
   - Check file is not corrupted
   - Recommended size: 800x300px or similar aspect ratio

2. **Logo Dimensions in Code**
   ```typescript
   // In lib/pdf/exportCalculatorPDF.ts
   const logoHeight = 20  // Adjust this
   const logoWidth = 70   // Adjust this
   ```
   
3. **Test Logo Loading**
   - Open browser console when exporting
   - Look for "Failed to load logo" error
   - Check if logo loads on the page itself

4. **Fallback Text**
   - If logo fails, "Model Mortgage" text appears instead
   - This indicates logo loading issue

## Issue: Pie Chart Not Showing

### Symptoms
- PDF shows "(Chart could not be captured)" message
- Chart area is blank
- Chart appears but is cut off

### Solutions

1. **Verify Chart Ref is Attached**
   ```tsx
   // In calculator page
   const { chartRef, getExportData } = useCalculatorExport('VA Purchase')
   
   // Chart element must have ref
   <div ref={chartRef} className={styles.pieChart}>
     {/* Chart content */}
   </div>
   ```

2. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Click Export button
   - Look for errors in console:
     - "Chart element: null" = ref not attached
     - "Chart element dimensions: 0 x 0" = element not visible
     - html2canvas errors = rendering issue

3. **Verify Chart is Visible**
   - Chart must be visible on screen when exporting
   - If chart is in a collapsed section, expand it first
   - Chart must have actual dimensions (not 0x0)

4. **Wait for Chart to Render**
   - The code waits 100ms for animations
   - If chart has slow animations, increase timeout:
   ```typescript
   await new Promise(resolve => setTimeout(resolve, 500)) // Increase to 500ms
   ```

5. **Check Chart Element Structure**
   ```tsx
   // Correct structure
   <div ref={chartRef} className={styles.pieChart}>
     <div className={styles.donut}>
       {/* Donut chart content */}
     </div>
   </div>
   ```

## Debugging Steps

### 1. Enable Debug Logging

The code already logs to console:
```typescript
console.log('Chart element:', data.chartElement)
console.log('Chart element dimensions:', ...)
```

Check console output:
- `Chart element: null` → Ref not attached
- `Chart element: <div>` → Ref attached correctly
- `Chart element dimensions: 300 x 300` → Chart has size
- `Chart element dimensions: 0 x 0` → Chart not visible

### 2. Test Chart Capture Manually

In browser console:
```javascript
// Get the chart element
const chart = document.querySelector('.pieChart')
console.log('Chart:', chart)
console.log('Dimensions:', chart.offsetWidth, 'x', chart.offsetHeight)

// Test html2canvas
import('html2canvas').then(html2canvas => {
  html2canvas.default(chart).then(canvas => {
    console.log('Canvas created:', canvas.width, 'x', canvas.height)
    document.body.appendChild(canvas)
  })
})
```

### 3. Check CSS Styles

Chart must be visible:
```css
.pieChart {
  display: block; /* Not 'none' */
  visibility: visible; /* Not 'hidden' */
  opacity: 1; /* Not 0 */
  width: auto; /* Has actual width */
  height: auto; /* Has actual height */
}
```

### 4. Test Logo Loading

In browser console:
```javascript
const img = new Image()
img.onload = () => console.log('Logo loaded:', img.width, 'x', img.height)
img.onerror = () => console.error('Logo failed to load')
img.src = '/model-mortage-logo.png'
```

## Common Issues & Fixes

### Issue: "Chart could not be captured"

**Cause**: html2canvas failed to render the chart

**Fix**:
1. Check if chart uses external images (CORS issue)
2. Verify chart doesn't use CSS filters or complex transforms
3. Try simplifying chart styles temporarily

### Issue: Logo appears as black rectangle

**Cause**: Logo has transparency but PDF background is white

**Fix**: The code now fills white background before drawing logo
```typescript
ctx.fillStyle = '#ffffff'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.drawImage(img, 0, 0)
```

### Issue: Chart is tiny in PDF

**Cause**: Chart dimensions are too small

**Fix**: Adjust chart size in code:
```typescript
const maxChartHeight = 90  // Increase this
const maxChartWidth = 130  // Increase this
```

### Issue: Chart is blurry

**Cause**: Low resolution capture

**Fix**: Already using `scale: 2` for high quality:
```typescript
html2canvas(element, {
  scale: 2,  // 2x resolution
  // ...
})
```

## Testing Checklist

Before reporting an issue, verify:

- [ ] Logo file exists at `/public/model-mortage-logo.png`
- [ ] Chart ref is attached: `<div ref={chartRef}>`
- [ ] Chart is visible on screen when exporting
- [ ] Browser console shows no errors
- [ ] Chart element has dimensions (not 0x0)
- [ ] Tried in different browser (Chrome, Firefox, Edge)
- [ ] Cleared browser cache
- [ ] Restarted dev server

## Quick Fixes

### Fix 1: Increase Chart Capture Timeout
```typescript
// In lib/pdf/exportCalculatorPDF.ts
await new Promise(resolve => setTimeout(resolve, 500)) // Was 100
```

### Fix 2: Adjust Logo Size
```typescript
// In lib/pdf/exportCalculatorPDF.ts
const logoHeight = 25  // Increase
const logoWidth = 80   // Increase
```

### Fix 3: Force Chart Visibility
```typescript
// Before capturing
if (data.chartElement) {
  data.chartElement.style.display = 'block'
  data.chartElement.style.visibility = 'visible'
  // Then capture...
}
```

### Fix 4: Use Different Image Format
```typescript
// Try JPEG instead of PNG
const imgData = canvas.toDataURL('image/jpeg', 0.95)
pdf.addImage(imgData, 'JPEG', x, y, width, height)
```

## Getting Help

If issues persist:

1. **Check Console Logs**
   - Open DevTools (F12)
   - Go to Console tab
   - Export PDF
   - Copy any error messages

2. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Export PDF
   - Check if logo file loads (200 status)

3. **Test in Incognito Mode**
   - Rules out extension conflicts
   - Rules out cache issues

4. **Provide Details**
   - Browser and version
   - Console error messages
   - Screenshot of chart on page
   - Screenshot of PDF output

## Advanced Debugging

### Enable Verbose Logging

Add more logs to `exportCalculatorPDF.ts`:
```typescript
console.log('Starting PDF export...')
console.log('Chart element:', data.chartElement)
console.log('Chart visible:', data.chartElement?.offsetParent !== null)
console.log('Chart dimensions:', data.chartElement?.offsetWidth, 'x', data.chartElement?.offsetHeight)

// After html2canvas
console.log('Canvas created:', canvas.width, 'x', canvas.height)
console.log('Image data length:', imgData.length)
```

### Test Chart Capture Separately

Create a test button:
```tsx
<button onClick={async () => {
  const chart = chartRef.current
  if (chart) {
    const canvas = await html2canvas(chart)
    const img = canvas.toDataURL()
    const link = document.createElement('a')
    link.download = 'chart-test.png'
    link.href = img
    link.click()
  }
}}>
  Test Chart Capture
</button>
```

This downloads just the chart as PNG to verify html2canvas works.
