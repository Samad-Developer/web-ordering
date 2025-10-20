import { toTitleCase } from "../string/toTitleCase";
import { MenuCategory } from "@/types/menu.types";


export const extractCategoryNames = (menu: MenuCategory[]): string[] => {
  return menu
    .filter(item => item.Name && item.Name.trim() !== '')
    .map(item => toTitleCase(item.Name))
    .sort((a, b) => a.localeCompare(b));
};