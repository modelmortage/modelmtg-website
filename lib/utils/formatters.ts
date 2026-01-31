// Formatting utility functions

/**
 * Format a number as currency (USD)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a number as a percentage
 * @param value - The numeric value to format (e.g., 0.05 for 5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "5.00%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format a number with commas and decimal places
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a currency input value (removes non-numeric characters except decimal)
 * @param value - The input string to format
 * @returns Cleaned numeric string
 */
export function parseCurrencyInput(value: string): string {
  return value.replace(/[^0-9.]/g, '')
}

/**
 * Format a percentage input value (removes non-numeric characters except decimal)
 * @param value - The input string to format
 * @returns Cleaned numeric string
 */
export function parsePercentageInput(value: string): string {
  return value.replace(/[^0-9.]/g, '')
}
