/**
 * Format price as Sri Lankan Rupees (LKR)
 * @param price - The price to format
 * @returns Formatted price string with LKR currency symbol
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format with commas for thousands
  return `Rs ${numPrice.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format price range for products with discount
 * @param originalPrice - Original price
 * @param discountPrice - Discounted price (optional)
 * @returns Formatted price or price range
 */
export function formatPriceRange(
  originalPrice: number | string,
  discountPrice?: number | string | null
): { original: string; discount?: string } {
  const original = formatPrice(originalPrice);

  if (discountPrice) {
    return {
      original,
      discount: formatPrice(discountPrice),
    };
  }

  return { original };
}
