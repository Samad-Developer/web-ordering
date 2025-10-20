import { toTitleCase } from "../string/toTitleCase";

interface MenuItem {
  Order: number;
  Id: string;
  Name: string;
  Image: string;
  Items: any[];
}

export const extractCategoryNames = (menu: MenuItem[]): string[] => {
  return menu
    .filter(item => item.Name && item.Name.trim() !== '')
    .map(item => toTitleCase(item.Name))
    .sort((a, b) => a.localeCompare(b));
};