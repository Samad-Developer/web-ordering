// lib/types/configuration.types.ts

export interface ProductConfiguration {
  // Selected variation (size + flavor combination)
  selectedVariationId: number | null;
  
  // For each ItemChoice, store selected options
  // Key: ItemChoice.Id, Value: Array of selected ItemOption.Id
  selectedChoices: Record<number, SelectedChoice>;
  
  // Total quantity of this configured item
  quantity: number;
  
  // Special instructions
  specialInstructions?: string;
}

export interface SelectedChoice {
  choiceId: number; // ItemChoice.Id
  choiceName: string; // For display
  requiredQuantity: number; // How many must be selected
  selectedOptions: SelectedOption[]; // What user selected
}

export interface SelectedOption {
  optionId: number; // ItemOption.Id
  optionName: string;
  quantity: number; // How many of this option (for multi-quantity choices)
  price: number;
}

export interface ConfigurationError {
  choiceId: number;
  message: string;
}

export interface PriceBreakdown {
  variationPrice: number; // Base price from selected variation
  choicesTotal: number; // Sum of all choice upgrades (where price > 0)
  subtotal: number; // variationPrice + choicesTotal
  total: number; // subtotal * quantity
}