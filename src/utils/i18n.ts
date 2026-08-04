export const formatCurrency = (
  amount: number,
  currencyCode: string = 'INR',
  locale: string = 'en-IN'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString()}`;
  }
};

export const formatDate = (
  dateString: string | Date,
  locale: string = 'en-IN',
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
};

export const formatNumber = (num: number, locale: string = 'en-IN'): string => {
  return new Intl.NumberFormat(locale).format(num);
};
