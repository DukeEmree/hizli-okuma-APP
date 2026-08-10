import i18n from "@/i18n";

/**
 * Returns the current BCP 47 locale string used by i18next.
 */
const getLocale = () => {
  // If the language string contains an underscore (e.g., tr_TR), convert it to hyphen.
  const lng = i18n.language || 'tr';
  return lng.replace('_', '-');
};

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(getLocale(), options).format(value);
};

export const formatPercentage = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(getLocale(), {
    style: 'percent',
    maximumFractionDigits: 1,
    ...options,
  }).format(value); // Note: value should be 0 to 1 for standard Intl percent
};

export const formatDate = (date: Date | number, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat(getLocale(), options).format(new Date(date));
};

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // A simple mm:ss formatter. For advanced localization, one could use relative time format
  // or i18next specific plurals like "3 minutes", "4 seconds".
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
