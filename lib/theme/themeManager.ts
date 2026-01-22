import { ThemeColors } from '@/types/theme.types';
import { DEFAULT_THEME } from './defaultTheme';

/**
 * Merge API colors with defaults (only non-empty values)
 */
export function mergeThemeColors(apiColors?: Partial<ThemeColors>): ThemeColors {
  if (!apiColors) {
    // console.log('⚠️ No API colors provided, using defaults');
    return DEFAULT_THEME;
  }

  const merged = { ...DEFAULT_THEME };

  // Only override if API value is non-empty
  Object.keys(apiColors).forEach((key) => {
    const value = apiColors[key as keyof ThemeColors];
    if (value && value.trim() !== '') {
      merged[key as keyof ThemeColors] = value;
      // console.log(`✅ Applied: ${key} = ${value}`);
    } else {
      // console.log(`⏭️ Skipped (empty): ${key}, using default: ${merged[key as keyof ThemeColors]}`);
    }
  });

  return merged;
}

/**
 * Convert color name to CSS variable name
 */
function toVarName(colorName: string): string {
  return `--${colorName.toLowerCase().replace(/_/g, '-')}`;
}

/**
 * Apply theme colors to CSS variables
 */
export function applyThemeColors(colors: ThemeColors): void {
  if (typeof document === 'undefined') {
    // console.warn('⚠️ Document not available (SSR), skipping theme application');
    return;
  }

  const root = document.documentElement;

  // console.log('🎨 Starting theme color application...');

  // Apply each color as CSS variable
  Object.entries(colors).forEach(([key, value]) => {
    if (value) {
      const varName = toVarName(key);
      root.style.setProperty(varName, value);
    }
  });

  // console.log('✨ Theme colors applied successfully!');
  
  // ✅ Log final computed values
  // console.log('📊 Computed CSS Variables:');
  // console.log('--category-bar-bg-color:', getComputedStyle(root).getPropertyValue('--category-bar-bg-color'));
  // console.log('--primary-color:', getComputedStyle(root).getPropertyValue('--primary-color'));
  // console.log('--secondary-color:', getComputedStyle(root).getPropertyValue('--secondary-color'));
}

/**
 * Initialize theme
 */
export function initializeTheme(apiColors?: Partial<ThemeColors>): void {
  // console.log('🚀 Initializing theme...');
  const colors = mergeThemeColors(apiColors);
  applyThemeColors(colors);
}