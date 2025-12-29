import { ThemeColors } from "@/types/theme.types";

export const defaultThemeColors: ThemeColors = {
  main: {
    primaryColor: "#E7000B",
    secondaryColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  topBar: {
    background: "#111827",
    foreground: "#F9FAFB",
  },

  category: {
    background: "#F3F4F6",
    foreground: "#111827",
    hover: "#E5E7EB",
    active: "#D1D5DB",
  },

  product: {
    background: "#FFFFFF",
    nameColor: "#111827",
    descriptionColor: "#6B7280",

    price: {
      background: "#111827",
      foreground: "#FFFFFF",
    },

    addButton: {
      background: "#22C55E",
    },
  },

  footer: {
    background: "#111827",
    foreground: "#F9FAFB",
  },
};