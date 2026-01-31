// Shared calculator form component

import React from 'react'
import { CalculatorInput } from '@/lib/types/calculator'

interface CalculatorFormProps {
  inputs: CalculatorInput[]
  values: Record<string, string>
  errors: Record<string, string>
  onChange: (name: string, value: string) => void
  onCalculate: () => void
  title?: string
}

export default function CalculatorForm({
  inputs,
  values,
  errors,
  onChange,
  onCalculate,
  title = 'Your Information'
}: CalculatorFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate()
  }

  return (
    <div style={{
      background: 'var(--deep-charcoal)',
      padding: '2.5rem',
      borderRadius: '4px',
      border: '1px solid rgba(200, 154, 91, 0.1)'
    }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>{title}</h3>
      
      <form onSubmit={handleSubmit}>
        {inputs.map((input) => (
          <div key={input.name} style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--ivory-white)',
              fontSize: '0.9375rem'
            }}>
              {input.label}
              {input.required && <span style={{ color: 'var(--gold-main)' }}> *</span>}
            </label>
            
            {input.type === 'number' || input.type === 'currency' || input.type === 'percentage' ? (
              <input
                type="number"
                name={input.name}
                value={values[input.name] || ''}
                onChange={(e) => onChange(input.name, e.target.value)}
                placeholder={input.placeholder}
                min={input.min}
                max={input.max}
                step={input.step || (input.type === 'percentage' ? '0.1' : '1')}
                required={input.required}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'var(--midnight-black)',
                  border: errors[input.name] 
                    ? '1px solid #e74c3c' 
                    : '1px solid rgba(200, 154, 91, 0.2)',
                  borderRadius: '4px',
                  color: 'var(--ivory-white)',
                  fontSize: '1rem'
                }}
              />
            ) : null}
            
            {errors[input.name] && (
              <p style={{
                color: '#e74c3c',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                marginBottom: 0
              }}>
                {errors[input.name]}
              </p>
            )}
            
            {input.helpText && !errors[input.name] && (
              <p style={{
                color: 'var(--ivory-white)',
                opacity: 0.6,
                fontSize: '0.8125rem',
                marginTop: '0.25rem',
                marginBottom: 0
              }}>
                {input.helpText}
              </p>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Calculate
        </button>
      </form>
    </div>
  )
}
