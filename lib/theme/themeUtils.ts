import { ThemeColors } from "@/types/theme.types";

function hexToRgb(hex: string): string {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

export function applyThemeToDocument(colors: ThemeColors): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Main
  root.style.setProperty('--color-primary', colors.main.primaryColor);
  root.style.setProperty('--color-primary-rgb', hexToRgb(colors.main.primaryColor));
  root.style.setProperty('--color-secondary', colors.main.secondaryColor);
  root.style.setProperty('--color-secondary-rgb', hexToRgb(colors.main.secondaryColor));
  root.style.setProperty('--color-background', colors.main.backgroundColor);

  // Top bar
  root.style.setProperty('--color-topbar-bg', colors.topBar.background);
  root.style.setProperty('--color-topbar-fg', colors.topBar.foreground);

  // Category
  root.style.setProperty('--color-category-bg', colors.category.background);
  root.style.setProperty('--color-category-fg', colors.category.foreground);
  root.style.setProperty('--color-category-hover', colors.category.hover);
  root.style.setProperty('--color-category-active', colors.category.active);

  // Product
  root.style.setProperty('--color-product-bg', colors.product.background);
  root.style.setProperty('--color-product-name', colors.product.nameColor);
  root.style.setProperty('--color-product-description', colors.product.descriptionColor);
  root.style.setProperty('--color-product-price-bg', colors.product.price.background);
  root.style.setProperty('--color-product-price-fg', colors.product.price.foreground);
  root.style.setProperty('--color-product-add-btn', colors.product.addButton.background);

  // Footer
  root.style.setProperty('--color-footer-bg', colors.footer.background);
  root.style.setProperty('--color-footer-fg', colors.footer.foreground);
}
