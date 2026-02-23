'use client'

import { useState, useEffect } from 'react'
import { FaFilePdf, FaDownload, FaExclamationTriangle } from 'react-icons/fa'
import { checkRateLimit, formatTimeRemaining, RateLimitResult } from '@/lib/pdf/rateLimiter'
import type { CalculatorData } from '@/lib/pdf/exportCalculatorPDF'

interface ExportPDFButtonProps {
  getCalculatorData: () => CalculatorData  // Changed: function instead of data
  className?: string
}

export default function ExportPDFButton({ getCalculatorData, className = '' }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitResult | null>(null)

  // Check rate limit on mount and after each export
  useEffect(() => {
    // TEMPORARILY DISABLED FOR TESTING
    // checkRateLimitStatus()
    setRateLimitInfo({ allowed: true, remaining: 999, resetTime: null })
  }, [])

  const checkRateLimitStatus = async () => {
    try {
      const result = await checkRateLimit()
      setRateLimitInfo(result)
    } catch (err) {
      console.error('Failed to check rate limit:', err)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setError(null)

    try {
      // Get fresh data at export time (not render time)
      const calculatorData = getCalculatorData()
      console.log('=== Export Button Debug ===')
      console.log('Calculator type:', calculatorData.calculatorType)
      console.log('Chart element:', calculatorData.chartElement)
      console.log('Chart element visible:', calculatorData.chartElement?.offsetParent !== null)
      console.log('===========================')

      const { exportCalculatorPDF } = await import('@/lib/pdf/exportCalculatorPDF')
      const pdfUrl = await exportCalculatorPDF(calculatorData)
      console.log('PDF URL received:', pdfUrl)

      // Download the PDF
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${calculatorData.calculatorType}-calculator-${Date.now()}.pdf`
      link.target = '_blank' // Open in new tab as fallback
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('Download link clicked')

      // Refresh rate limit info after successful export
      // TEMPORARILY DISABLED FOR TESTING
      // await checkRateLimitStatus()
    } catch (err) {
      console.error('Export failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const isRateLimited = rateLimitInfo ? !rateLimitInfo.allowed : false

  return (
    <div className={className}>
      <button
        onClick={handleExport}
        disabled={isExporting || isRateLimited}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title={isRateLimited ? rateLimitInfo?.message : 'Export calculator results to PDF'}
      >
        {isExporting ? (
          <>
            <FaDownload className="animate-bounce" />
            <span>Exporting...</span>
          </>
        ) : isRateLimited ? (
          <>
            <FaExclamationTriangle />
            <span>Limit Reached</span>
          </>
        ) : (
          <>
            <FaFilePdf />
            <span>Export to PDF</span>
          </>
        )}
      </button>

      {/* Rate limit info */}
      {rateLimitInfo && rateLimitInfo.allowed && rateLimitInfo.remaining < 999 && (
        <p className="mt-1 text-xs text-gray-600">
          {rateLimitInfo.remaining} export{rateLimitInfo.remaining !== 1 ? 's' : ''} remaining today
        </p>
      )}

      {/* Rate limit exceeded message */}
      {isRateLimited && rateLimitInfo?.resetTime && (
        <p className="mt-2 text-sm text-orange-600">
          Daily limit reached. Resets in {formatTimeRemaining(rateLimitInfo.resetTime)}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
