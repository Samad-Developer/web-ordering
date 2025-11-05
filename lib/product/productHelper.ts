import { ProductVariation } from '@/types/product.types';
import { 
  ProductConfiguration, 
  PriceBreakdown,
  ConfigurationError 
} from '@/types/configuration.types';


export function calculatePrice(
  variation: ProductVariation | null,
  configuration: ProductConfiguration
): PriceBreakdown {
  if (!variation) {
    return {
      variationPrice: 0,
      choicesTotal: 0,
      subtotal: 0,
      total: 0,
    };
  }

  const variationPrice = variation.Price;

  // Calculate total from all choice upgrades (where price > 0)
  const choicesTotal = Object.values(configuration.selectedChoices).reduce(
    (total, choice) => {
      return total + choice.selectedOptions.reduce(
        (choiceTotal, option) => choiceTotal + (option.price * option.quantity),
        0
      );
    },
    0
  );

  const subtotal = variationPrice + choicesTotal;
  const total = subtotal * configuration.quantity;

  return {
    variationPrice,
    choicesTotal,
    subtotal,
    total,
  };
}

export function validateConfiguration(
  variation: ProductVariation | null,
  configuration: ProductConfiguration
): { errors: ConfigurationError[]; isValid: boolean } {
  const errors: ConfigurationError[] = [];

  if (!variation) {
    errors.push({
      choiceId: -1,
      message: 'Please select a size',
    });
    return { errors, isValid: false };
  }

  // Validate each ItemChoice
  for (const choice of variation.ItemChoices) {
    const selectedChoice = configuration.selectedChoices[choice.Id];
    
    if (!selectedChoice) {
      errors.push({
        choiceId: choice.Id,
        message: `Please select ${choice.Quantity} ${choice.Name}`,
      });
      continue;
    }

    // Count total selected quantity
    const totalSelected = selectedChoice.selectedOptions.reduce(
      (sum, opt) => sum + opt.quantity,
      0
    );

    if (totalSelected < choice.Quantity) {
      const remaining = choice.Quantity - totalSelected;
      errors.push({
        choiceId: choice.Id,
        message: `Please select ${remaining} more ${choice.Name}`,
      });
    }

    if (totalSelected > choice.Quantity) {
      errors.push({
        choiceId: choice.Id,
        message: `Too many ${choice.Name} selected`,
      });
    }
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}

export function getVariationDisplayName(variation: ProductVariation): string {
  return `${variation.Size.Name} - ${variation.Flavour.Name}`;
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`;
}