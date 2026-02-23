import { useRef, useCallback, useEffect } from 'react'
import { CalculatorData } from '@/lib/pdf/exportCalculatorPDF'

export function useCalculatorExport(calculatorType: string) {
  const chartRef = useRef<HTMLDivElement>(null)

  // Debug: Log when ref changes
  useEffect(() => {
    console.log('Chart ref updated:', chartRef.current)
    if (chartRef.current) {
      console.log('Chart ref dimensions:', chartRef.current.offsetWidth, 'x', chartRef.current.offsetHeight)
    }
  }, [chartRef.current])

  const getExportData = useCallback((inputs: Record<string, any>, results: Record<string, any>): CalculatorData => {
    console.log('getExportData called, chartRef.current:', chartRef.current)
    return {
      calculatorType,
      inputs,
      results,
      chartElement: chartRef.current || undefined
    }
  }, [calculatorType])

  return {
    chartRef,
    getExportData
  }
}
