import { toTitleCase } from "../string/toTitleCase";
import { MenuCategory } from "@/types/menu.types";


export const extractCategoryNames = (menu: MenuCategory[]): string[] => {
  return menu
    .filter(item => item.Name && item.Name.trim() !== '')
    .map(item => toTitleCase(item.Name))
    .sort((a, b) => a.localeCompare(b));
};


export function searchMenuItems(
  categories: MenuCategory[],
  searchQuery: string
): MenuCategory[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return categories;
  }

  const query = searchQuery.toLowerCase().trim();

  // Filter categories and their items
  const filteredCategories = categories
    .map((category) => {
      // Check if category name matches
      const categoryMatches = category.Name.toLowerCase().includes(query);

      // Filter items within the category
      const filteredItems = category.Items.filter((item) => {
        // Search in item name
        const nameMatches = item.Name.toLowerCase().includes(query);

        // Search in item description
        const descriptionMatches =
          item.Comment &&
          item.Comment !== 'null' &&
          item.Comment.toLowerCase().includes(query);

        return nameMatches || descriptionMatches;
      });

      // If category name matches, return all items
      // If category doesn't match but has matching items, return only those items
       if (filteredItems.length > 0) {
        return {
          ...category,
          Items: filteredItems,
        };
      }

      return null;
    })
    .filter((category): category is MenuCategory => category !== null);

  return filteredCategories;
}

export function getTotalSearchResults(categories: MenuCategory[]): number {
  return categories.reduce((total, category) => {
    return total + category.Items.length;
  }, 0);
}