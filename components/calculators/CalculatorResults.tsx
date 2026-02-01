// Shared calculator results component

import React from 'react'
import { CalculatorResult } from '@/lib/types/calculator'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters'

interface CalculatorResultsProps {
  results: CalculatorResult[] | null
  loading?: boolean
  title?: string
  emptyMessage?: string
}

export default function CalculatorResults({
  results,
  loading = false,
  title = 'Your Results',
  emptyMessage = 'Enter your information and click Calculate to see results'
}: CalculatorResultsProps) {
  const formatValue = (result: CalculatorResult): string => {
    switch (result.format) {
      case 'currency':
        return formatCurrency(result.value)
      case 'percentage':
        return formatPercentage(result.value)
      case 'number':
        return formatNumber(result.value, 2)
      default:
        return String(result.value)
    }
  }

  const highlightedResult = results?.find(r => r.highlight)
  const otherResults = results?.filter(r => !r.highlight)

  return (
    <div style={{
      background: 'var(--deep-charcoal)',
      padding: '2.5rem',
      borderRadius: '4px',
      border: '1px solid rgba(200, 154, 91, 0.1)'
    }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>{title}</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ opacity: 0.6 }}>Calculating...</p>
        </div>
      ) : results && results.length > 0 ? (
        <>
          {/* Highlighted Result */}
          {highlightedResult && (
            <div style={{
              background: 'var(--midnight-black)',
              padding: '2rem',
              borderRadius: '4px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '0.875rem',
                opacity: 0.7,
                marginBottom: '0.5rem',
                color: 'var(--ivory-white)'
              }}>
                {highlightedResult.label}
              </p>
              <p style={{
                fontSize: '2.5rem',
                color: 'var(--gold-main)',
                fontWeight: 'bold',
                margin: 0
              }}>
                {formatValue(highlightedResult)}
              </p>
              {highlightedResult.description && (
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.7,
                  marginTop: '0.5rem',
                  marginBottom: 0,
                  color: 'var(--ivory-white)'
                }}>
                  {highlightedResult.description}
                </p>
              )}
            </div>
          )}

          {/* Other Results */}
          {otherResults && otherResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              {otherResults.map((result, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: index < otherResults.length - 1 
                    ? '1px solid rgba(200, 154, 91, 0.1)' 
                    : 'none'
                }}>
                  <div>
                    <span style={{
                      opacity: 0.8,
                      color: 'var(--ivory-white)',
                      display: 'block'
                    }}>
                      {result.label}
                    </span>
                    {result.description && (
                      <span style={{
                        fontSize: '0.8125rem',
                        opacity: 0.6,
                        color: 'var(--ivory-white)',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        {result.description}
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontWeight: 600,
                    color: 'var(--ivory-white)',
                    fontSize: '1.125rem'
                  }}>
                    {formatValue(result)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(200, 154, 91, 0.1)',
            borderRadius: '4px',
            borderLeft: '3px solid var(--gold-main)'
          }}>
            <p style={{
              fontSize: '0.9375rem',
              margin: 0,
              color: 'var(--ivory-white)'
            }}>
              💡 These estimates are for informational purposes only. Actual loan terms may vary based on 
              credit score, property details, and lender requirements.
            </p>
          </div>
        </>
      ) : (
        <p style={{
          opacity: 0.6,
          textAlign: 'center',
          padding: '3rem 0',
          color: 'var(--ivory-white)'
        }}>
          {emptyMessage}
        </p>
      )}
    </div>
  )
}
