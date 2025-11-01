/**
 * Currency formatter utility for Indian Rupees (INR)
 * Used consistently across the entire application
 */

/**
 * Format a number as Indian Rupees (INR)
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places (default: false)
 * @returns Formatted currency string (e.g., "₹50,000" or "₹50,000.50")
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  if (!amount && amount !== 0) return "₹0"
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount)
  } catch (error) {
    console.error('[Currency] Error formatting amount:', amount, error)
    // Fallback formatting
    return `₹${Math.round(amount).toLocaleString('en-IN')}`
  }
}

/**
 * Alias for formatCurrency - commonly used for salary display
 */
export const formatSalary = formatCurrency

/**
 * Format currency with always showing decimals (for precise amounts like transactions)
 */
export function formatCurrencyPrecise(amount: number): string {
  return formatCurrency(amount, true)
}

/**
 * Parse currency string back to number
 * Removes ₹ symbol and commas
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0
  
  try {
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''))
  } catch {
    return 0
  }
}

/**
 * Format for compact display (e.g., "₹50K", "₹1.2M")
 */
export function formatCurrencyCompact(amount: number): string {
  if (!amount && amount !== 0) return "₹0"
  
  const absAmount = Math.abs(amount)
  
  if (absAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr` // Crore
  }
  if (absAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L` // Lakh
  }
  if (absAmount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K` // Thousand
  }
  
  return formatCurrency(amount, false)
}

export default {
  formatCurrency,
  formatSalary,
  formatCurrencyPrecise,
  parseCurrency,
  formatCurrencyCompact,
}
