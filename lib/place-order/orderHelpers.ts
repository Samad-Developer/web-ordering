import { CartItem } from "@/types/cart.types";
import { SelectedAddonGroup, SelectedAddonOption } from "@/types/customization.types";
import { ItemChoice, MenuCategory } from "@/types/menu.types";
import { Variation } from "@/types/menu.types";

export function transformCartItemsForAPI(
  cartItems: CartItem[],
  menuData: MenuCategory[] | null
) {
  if (!menuData || !cartItems || cartItems.length === 0) {
    return [];
  }

  return cartItems
    .map((cartItem) => {
      // Find the original menu item
      const menuItem = findMenuItemById(menuData, cartItem.productId);

      if (!menuItem) {
        console.warn(`Menu item not found for product ID: ${cartItem.productId}`);
        return null;
      }

      // Find the selected variation
      const selectedVariation = menuItem.Variations.find(
        (v: Variation) => v.Id === cartItem.variationId
      );

      if (!selectedVariation) {
        console.warn(`Variation not found for ID: ${cartItem.variationId}`);
        return null;
      }

      // Transform selected addons into ItemChoices format
      const itemChoices = transformAddonsToItemChoices(
        cartItem.customization.selectedAddons,
        selectedVariation.ItemChoices
      );

      // Construct the variation with selected addons
      const transformedVariation = {
        Id: selectedVariation.Id,
        Size: selectedVariation.Size,
        Flavour: selectedVariation.Flavour,
        Price: cartItem.priceBreakdown.originalBasePrice,
        Discount: cartItem.discount,
        ItemChoices: itemChoices,
      };

      // Return in API format
      return {
        Id: cartItem.productId,
        CategoryId: menuItem.CategoryId,
        Code: menuItem.Code || "",
        Name: cartItem.productName,
        DepartmentName: menuItem.DepartmentName,
        Price: cartItem.priceBreakdown.originalBasePrice,
        TaxAmount: menuItem.TaxAmount || 0,
        Quantity: cartItem.customization.quantity,
        Image:
          cartItem.productImage === "/placeholder-food.jpg"
            ? "N/A"
            : cartItem.productImage,
        Comment: cartItem.specialInstructions || "",
        IsKot: menuItem.IsKot || false,
        ItemFOC: menuItem.ItemFOC || false,
        Description: menuItem.Comment || "",
        Variations: [transformedVariation],
        Discount: cartItem.discount,
      };
    })
    .filter(Boolean); // Remove any null items
}

/**
 * Find menu item by ID in the menu data structure
 */
function findMenuItemById(menuData: MenuCategory[], itemId: number) {
  if (!menuData || !Array.isArray(menuData)) return null;

  for (const category of menuData) {
    if (!category.Items || !Array.isArray(category.Items)) continue;

    const item = category.Items.find((item) => item.Id === itemId);
    if (item) {
      return item;
    }
  }

  return null;
}

/**
 * Transform selected addons from cart format to API ItemChoices format
 */
function transformAddonsToItemChoices(
  selectedAddons: Record<number, SelectedAddonGroup>,
  originalItemChoices: ItemChoice[]
) {
  if (
    !selectedAddons ||
    Object.keys(selectedAddons).length === 0 ||
    !originalItemChoices ||
    originalItemChoices.length === 0
  ) {
    return [];
  }

  return Object.values(selectedAddons).map((addon) => {
    // Find the original ItemChoice to get MaxChoice
    const originalChoice = originalItemChoices.find(
      (choice) => choice.Id === addon.choiceId
    );

    // Transform selected options
    const selectedItemOptions = addon.selectedOptions.map((option: SelectedAddonOption) => ({
      Id: option.optionId,
      Name: option.optionName,
      Price: option.price,
      Quantity: option.quantity,
    }));

    return {
      Id: addon.choiceId,
      Name: addon.choiceName,
      Quantity: addon.requiredQuantity,
      MaxChoice: originalChoice?.MaxChoice || addon.requiredQuantity,
      ItemOptions: selectedItemOptions,
    };
  });
}