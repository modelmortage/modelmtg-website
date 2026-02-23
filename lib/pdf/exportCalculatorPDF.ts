import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { supabase } from '../supabase/client'
import { checkRateLimit, getFingerprint } from './rateLimiter'

export interface CalculatorData {
  calculatorType: string
  inputs: Record<string, any>
  results: Record<string, any>
  chartElement?: HTMLElement
  chartData?: {
    segments: Array<{
      label: string
      value: number
      color: string
    }>
  }
}

export async function exportCalculatorPDF(data: CalculatorData): Promise<string> {
  // Check rate limit before proceeding - TEMPORARILY DISABLED FOR TESTING
  // const rateLimitResult = await checkRateLimit()
  // 
  // if (!rateLimitResult.allowed) {
  //   throw new Error(rateLimitResult.message || 'Rate limit exceeded')
  // }

  // Debug: Log chart element
  console.log('=== PDF Export Debug ===')
  console.log('Chart element:', data.chartElement)
  console.log('Chart element type:', data.chartElement?.tagName)
  console.log('Chart element class:', data.chartElement?.className)
  console.log('Chart visible:', data.chartElement?.offsetParent !== null)
  console.log('Chart dimensions:', data.chartElement?.offsetWidth, 'x', data.chartElement?.offsetHeight)
  console.log('Chart children:', data.chartElement?.children.length)
  console.log('========================')

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = 15

  // Add logo - improved loading and sizing
  try {
    const logoImg = await loadImage('/model-mortage-logo.png')
    // Square logo sizing
    const logoSize = 25 // 25mm x 25mm square
    const logoX = (pageWidth - logoSize) / 2
    pdf.addImage(logoImg, 'PNG', logoX, yPosition, logoSize, logoSize)
    yPosition += logoSize + 10
  } catch (error) {
    console.error('Failed to load logo:', error)
    // Add text fallback if logo fails
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Model Mortgage', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 12
  }

  // Add title
  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(40, 40, 40)
  pdf.text(`${data.calculatorType} Calculator`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 8

  // Add date
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(120, 120, 120)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 12

  // Add chart if available - optimized size for single page
  if (data.chartElement && data.chartData) {
    console.log('Attempting to capture chart...')
    try {
      // Create a canvas to draw the donut chart manually
      const chartCanvas = document.createElement('canvas')
      const chartSize = 480 // Chart area size
      const legendHeight = data.chartData.segments.length * 35 + 40 // Space for legend
      chartCanvas.width = chartSize
      chartCanvas.height = chartSize + legendHeight
      const ctx = chartCanvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }
      
      // Fill background with white
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height)
      
      console.log('Chart data:', data.chartData)
      
      // Calculate total and percentages
      const total = data.chartData.segments.reduce((sum, seg) => sum + seg.value, 0)
      
      // Draw the donut chart
      const centerX = chartSize / 2
      const centerY = chartSize / 2
      const outerRadius = chartSize / 2 - 20
      const innerRadius = outerRadius * 0.7
      
      let currentAngle = -90 // Start at top
      
      // Draw each segment
      data.chartData.segments.forEach(segment => {
        const percentage = segment.value / total
        const angleSize = percentage * 360
        const endAngle = currentAngle + angleSize
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius, 
          currentAngle * Math.PI / 180, 
          endAngle * Math.PI / 180)
        ctx.arc(centerX, centerY, innerRadius, 
          endAngle * Math.PI / 180, 
          currentAngle * Math.PI / 180, true)
        ctx.closePath()
        ctx.fillStyle = segment.color
        ctx.fill()
        
        currentAngle = endAngle
      })
      
      // Draw white center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      
      // Add text in center
      const centerText = data.chartElement.querySelector('[class*="centerAmount"]')
      if (centerText) {
        const label = centerText.querySelector('[class*="centerLabel"]')?.textContent || ''
        const value = centerText.querySelector('[class*="centerValue"]')?.textContent || ''
        const perMonth = centerText.querySelector('[class*="centerPerMonth"]')?.textContent || ''
        
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Draw label
        ctx.fillStyle = '#6b7280'
        ctx.font = '18px sans-serif'
        ctx.fillText(label, centerX, centerY - 40)
        
        // Draw value
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 36px sans-serif'
        ctx.fillText(value, centerX, centerY)
        
        // Draw per month
        ctx.fillStyle = '#9ca3af'
        ctx.font = '16px sans-serif'
        ctx.fillText(perMonth, centerX, centerY + 35)
      }
      
      // Add legend below the chart
      const legendStartY = chartSize + 20 // Start below the chart
      const legendItemHeight = 35
      const dotSize = 12
      const legendX = 40
      
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      
      data.chartData.segments.forEach((segment, index) => {
        const y = legendStartY + (index * legendItemHeight)
        
        // Draw colored dot
        ctx.beginPath()
        ctx.arc(legendX, y, dotSize / 2, 0, 2 * Math.PI)
        ctx.fillStyle = segment.color
        ctx.fill()
        
        // Draw label
        ctx.fillStyle = '#4b5563'
        ctx.font = '16px sans-serif'
        ctx.fillText(segment.label, legendX + 20, y)
        
        // Draw value (right-aligned)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 18px sans-serif'
        ctx.fillText(`$${segment.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, chartSize - 40, y)
        ctx.textAlign = 'left'
      })
      
      console.log('Canvas chart drawn successfully')
      
      const imgData = chartCanvas.toDataURL('image/jpeg', 0.95)
      console.log('Image data length:', imgData.length)
      
      // Validate image data
      if (!imgData || imgData.length < 100 || !imgData.startsWith('data:image/')) {
        throw new Error('Invalid image data generated from chart')
      }
      
      // Calculate optimal chart size to fit on page
      const maxChartHeight = 120
      const maxChartWidth = 160
      let chartWidth = maxChartWidth
      let chartHeight = (chartCanvas.height * chartWidth) / chartCanvas.width
      
      // If height exceeds max, scale down
      if (chartHeight > maxChartHeight) {
        chartHeight = maxChartHeight
        chartWidth = (chartCanvas.width * chartHeight) / chartCanvas.height
      }
      
      console.log('Adding chart to PDF:', chartWidth, 'x', chartHeight, 'at position', yPosition)
      
      // Center the chart
      const chartX = (pageWidth - chartWidth) / 2
      
      try {
        pdf.addImage(imgData, 'JPEG', chartX, yPosition, chartWidth, chartHeight, undefined, 'FAST')
        console.log('Chart added successfully at x:', chartX, 'y:', yPosition)
        yPosition += chartHeight + 10
      } catch (addImageError) {
        console.error('Failed to add image to PDF:', addImageError)
        throw addImageError
      }
    } catch (error) {
      console.error('Failed to capture chart:', error)
      // Add a note if chart capture fails
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text('(Chart could not be captured)', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
    }
  } else {
    console.log('No chart element provided')
  }

  // Add results section - compact layout
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(40, 40, 40)
  pdf.text('Calculation Results', margin, yPosition)
  yPosition += 8

  // Draw a subtle line
  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 6

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(60, 60, 60)

  // Filter and format important results first
  const importantKeys = [
    'totalMonthlyPayment',
    'principalInterest',
    'propertyTax',
    'insurance',
    'hoaDues',
    'loanAmount',
    'vaFundingFeeAmount',
    'finalMortgageAmount',
    'totalInterestPaid'
  ]

  const sortedResults = Object.entries(data.results).sort(([keyA], [keyB]) => {
    const indexA = importantKeys.indexOf(keyA)
    const indexB = importantKeys.indexOf(keyB)
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // Two-column layout for compact display
  const columnWidth = (pageWidth - 3 * margin) / 2
  let column = 0
  let columnY = yPosition

  sortedResults.forEach(([key, value]) => {
    const label = formatLabel(key)
    const formattedValue = formatValue(value)
    
    const xPos = margin + (column * (columnWidth + margin))
    
    // Label
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(`${label}:`, xPos, columnY)
    
    // Value - bold and darker
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(40, 40, 40)
    pdf.text(formattedValue, xPos + columnWidth, columnY, { align: 'right' })
    
    columnY += 6
    
    // Switch to second column or move to next row
    if (columnY > pageHeight - 20) {
      // If we're running out of space, stop adding more
      return
    }
    
    if (column === 0) {
      column = 1
      columnY = yPosition
    } else {
      column = 0
      yPosition = columnY
    }
  })

  // Add footer
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(150, 150, 150)
  pdf.text('This is an estimate. Actual terms may vary.', pageWidth / 2, pageHeight - 10, { align: 'center' })
  
  // Add contact info in footer
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(60, 60, 60)
  pdf.text('Matthew Bramow', pageWidth / 2, pageHeight - 20, { align: 'center' })
  pdf.text('(832) 727-4128', pageWidth / 2, pageHeight - 15, { align: 'center' })

  console.log('PDF generation complete, creating blob...')
  
  // Generate PDF blob
  const pdfBlob = pdf.output('blob')
  console.log('PDF blob created, size:', pdfBlob.size, 'bytes')
  
  // Upload to Supabase Storage
  const fileName = `calculator-export-${Date.now()}.pdf`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('calculator-exports')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      cacheControl: '3600'
    })

  if (uploadError) {
    throw new Error(`Failed to upload PDF: ${uploadError.message}`)
  }

  // Save metadata to database with fingerprint for rate limiting
  const { error: dbError } = await supabase
    .from('calculator_exports')
    .insert({
      calculator_type: data.calculatorType,
      file_path: uploadData.path,
      inputs: data.inputs,
      results: data.results,
      fingerprint: getFingerprint(),
      created_at: new Date().toISOString()
    })

  if (dbError) {
    console.error('Failed to save export metadata:', dbError)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('calculator-exports')
    .getPublicUrl(uploadData.path)

  console.log('PDF export complete! URL:', urlData.publicUrl)
  
  return urlData.publicUrl
}

function loadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        // Use actual image dimensions
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Fill with white background first
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw image
        ctx.drawImage(img, 0, 0)
        
        // Convert to high quality PNG
        const dataUrl = canvas.toDataURL('image/png', 1.0)
        resolve(dataUrl)
      } catch (err) {
        reject(err)
      }
    }
    
    img.onerror = (err) => {
      console.error('Image load error:', err)
      reject(new Error('Failed to load image'))
    }
    
    // Try to load the image
    img.src = src
  })
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatValue(value: any): string {
  if (typeof value === 'number') {
    // Format currency values
    if (value >= 100 || value === 0) {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    // Format small numbers (like percentages or counts)
    return value.toFixed(2)
  }
  return String(value)
}
