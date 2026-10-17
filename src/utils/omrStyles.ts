import { ColorScheme } from '../types/omr';

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  bubbleBorder: string;
  bubbleBg: string;
  watermark: string;
  accent: string;
}

export const getColorPalette = (scheme: ColorScheme): ColorPalette => {
  switch (scheme) {
    case 'black':
      return {
        primary: '#111827',
        primaryLight: '#f3f4f6',
        primaryBorder: '#1f2937',
        bubbleBorder: '#374151',
        bubbleBg: '#ffffff',
        watermark: 'rgba(0, 0, 0, 0.06)',
        accent: '#111827',
      };
    case 'blue':
      return {
        primary: '#1e3a8a',
        primaryLight: '#eff6ff',
        primaryBorder: '#2563eb',
        bubbleBorder: '#3b82f6',
        bubbleBg: '#ffffff',
        watermark: 'rgba(30, 58, 138, 0.08)',
        accent: '#1d4ed8',
      };
    case 'green':
      return {
        primary: '#14532d',
        primaryLight: '#f0fdf4',
        primaryBorder: '#16a34a',
        bubbleBorder: '#22c55e',
        bubbleBg: '#ffffff',
        watermark: 'rgba(20, 83, 45, 0.08)',
        accent: '#15803d',
      };
    case 'maroon':
    default:
      // Authentic Bangladesh Board pinkish-maroon / magenta tone
      return {
        primary: '#881337',
        primaryLight: '#fff1f2',
        primaryBorder: '#9f1239',
        bubbleBorder: '#be123c',
        bubbleBg: '#ffffff',
        watermark: 'rgba(159, 18, 57, 0.09)',
        accent: '#9f1239',
      };
  }
};

export const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? bengaliDigits[parsed] : char;
    })
    .join('');
};
