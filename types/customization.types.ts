// lib/types/customization.types.ts

export interface ProductCustomization {
  // Separate size and flavor selection (NEW!)
  selectedSizeId: number | null;
  selectedFlavorId: number | null;
  
  // Computed variation ID from size + flavor combination
  selectedVariationId: number | null;
  
  // For each AddonGroup, store selected options
  // Key: AddonGroup.Id, Value: Selected addon group data
  selectedAddons: Record<number, SelectedAddonGroup>;
  
  // Total quantity of this configured item
  quantity: number;
  
  // Special instructions
  specialInstructions?: string;
}

export interface SelectedAddonGroup {
  groupId: number;           // AddonGroup.Id (renamed from choiceId)
  groupName: string;         // For display (e.g., "Burgers", "Drinks")
  requiredQuantity: number;  // How many must be selected
  selectedOptions: SelectedAddonOption[]; // What user selected
}

export interface SelectedAddonOption {
  optionId: number;          // AddonOption.Id
  optionName: string;        // For display
  quantity: number;          // How many of this option (for multi-quantity addons)
  price: number;             // Price per unit
}

export interface CustomizationError {
  groupId: number;           // AddonGroup.Id (renamed from choiceId)
  message: string;
}

export interface PriceBreakdown {
  basePrice: number;         // Base price from selected variation (renamed from variationPrice)
  addonsTotal: number;       // Sum of all addon upgrades (renamed from choicesTotal)
  subtotal: number;          // basePrice + addonsTotal
  total: number;             // subtotal * quantity
}