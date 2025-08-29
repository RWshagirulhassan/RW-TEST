export function formatToIndianRupeesShort(numStr: string): string {
  const num = parseFloat(numStr)
  if (isNaN(num)) return 'Invalid number'

  const absNum = Math.abs(num)

  if (absNum >= 1e7) {
    // Crore
    return `${(num / 1e7).toFixed(2).replace(/\.00$/, '')} cr`
  }
  if (absNum >= 1e5) {
    // Lakh
    return `${(num / 1e5).toFixed(2).replace(/\.00$/, '')} lakh`
  }
  if (absNum >= 1e3) {
    // Thousand
    return `${(num / 1e3).toFixed(2).replace(/\.00$/, '')}k`
  }
  // Less than thousand
  return num.toString()
}
