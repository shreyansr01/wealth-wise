/**
 * Number formatting utilities for Indian financial system (en-IN).
 */

export function formatWithCommas(value: string): string {
  // Remove any non-digit characters except for decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  if (!cleanValue) return '';

  const parts = cleanValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let formattedInteger = integerPart;
  if (integerPart.length > 3) {
    const lastThree = integerPart.slice(-3);
    const leading = integerPart.slice(0, -3);
    const formattedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formattedInteger = `${formattedLeading},${lastThree}`;
  }

  if (cleanValue.includes('.')) {
    return `${formattedInteger}.${decimalPart !== undefined ? decimalPart.slice(0, 2) : ''}`;
  }

  return formattedInteger;
}

export function removeCommas(value: string): string {
  return value.replace(/,/g, '');
}

export function formatLargeNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "₹0";

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return "₹0";

  const isNegative = numValue < 0;
  const roundedValue = Math.floor(Math.abs(numValue));

  return `${isNegative ? '-' : ''}₹${roundedValue.toLocaleString('en-IN')}`;
}
