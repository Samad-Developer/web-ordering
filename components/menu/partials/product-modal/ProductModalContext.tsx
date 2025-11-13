// components/product-modal/ProductModalContext.tsx

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { ProductItem, ProductVariation } from '@/types/product.types';
import { getAvailableFlavorsForSize } from '@/lib/product/productHelper';
import { 
  ProductCustomization, 
  SelectedAddonGroup,
  SelectedAddonOption,
  CustomizationError,
  PriceBreakdown 
} from '@/types/customization.types';


import { 
  calculatePrice, 
  validateCustomization,
  findVariationByCombo,
  getDefaultSize,
  getDefaultFlavor,
} from '@/lib/product/productHelper';


// ============= ACTION TYPES =============

type ProductModalAction =
  | { type: 'SET_SIZE'; payload: number }
  | { type: 'SET_FLAVOR'; payload: number }
  | { 
      type: 'SET_ADDON_OPTION'; 
      payload: { 
        groupId: number; 
        optionId: number; 
        optionName: string;
        price: number;
      } 
    }
  | { 
      type: 'ADD_ADDON_QUANTITY'; 
      payload: { 
        groupId: number; 
        optionId: number; 
        optionName: string;
        price: number;
      } 
    }
  | { 
      type: 'REMOVE_ADDON_QUANTITY'; 
      payload: { 
        groupId: number; 
        optionId: number; 
      } 
    }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'SET_INSTRUCTIONS'; payload: string }
  | { type: 'RESET' };

// ============= STATE TYPES =============

interface ProductModalState {
  customization: ProductCustomization;
  errors: CustomizationError[];
}

// ============= INITIAL STATE =============

function getInitialState(product: ProductItem): ProductModalState {
  // Auto-select if only one size exists
  const defaultSizeId = product.Variations.length === 1 
    ? product.Variations[0].Size.Id 
    : getDefaultSize(product);

  // Auto-select if only one flavor exists for that size
  const defaultFlavorId = defaultSizeId && product.Variations.length === 1
    ? product.Variations[0].Flavour.Id
    : product.Variations[0].Flavour.Id;

  // Find variation ID from combination
  const defaultVariationId = defaultSizeId && defaultFlavorId
    ? findVariationByCombo(product, defaultSizeId, defaultFlavorId)?.Id || null
    : null;

  return {
    customization: {
      selectedSizeId: defaultSizeId,
      selectedFlavorId: defaultFlavorId,
      selectedVariationId: defaultVariationId,
      selectedAddons: {},
      quantity: 1,
      specialInstructions: '',
    },
    errors: [],
  };
}

// ============= REDUCER =============

function productModalReducer(
  state: ProductModalState,
  action: ProductModalAction,
  product: ProductItem
): ProductModalState {
  switch (action.type) {
    case 'SET_SIZE': {
      const newSizeId = action.payload;
      
      // Get available flavors for this size
      const availableFlavors = getAvailableFlavorsForSize(product, newSizeId);
      
      let newFlavorId: number | null = null;
      
      // Auto-select if only ONE flavor available
      if (availableFlavors.length === 1) {
        newFlavorId = availableFlavors[0].id;
      } 
      // Check if current flavor is still available
      else if (availableFlavors.length > 1) {
        const currentFlavorId = state.customization.selectedFlavorId;
        const isCurrentFlavorAvailable = availableFlavors.some(f => f.id === currentFlavorId);
        
        // Keep current flavor if available, otherwise clear it
        newFlavorId = isCurrentFlavorAvailable ? currentFlavorId : null;
      }
      
      // Find variation ID
      const newVariationId = newFlavorId 
        ? findVariationByCombo(product, newSizeId, newFlavorId)?.Id || null
        : null;
      
      return {
        ...state,
        customization: {
          ...state.customization,
          selectedSizeId: newSizeId,
          selectedFlavorId: newFlavorId,
          selectedVariationId: newVariationId,
          // Clear addons when size changes (they might be different)
          selectedAddons: {},
        },
      };
    }

    case 'SET_FLAVOR': {
      const newFlavorId = action.payload;
      const currentSizeId = state.customization.selectedSizeId;
      
      // Can't select flavor without size
      if (!currentSizeId) return state;
      
      // Find variation ID
      const newVariationId = findVariationByCombo(product, currentSizeId, newFlavorId)?.Id || null;
      
      return {
        ...state,
        customization: {
          ...state.customization,
          selectedFlavorId: newFlavorId,
          selectedVariationId: newVariationId,
          selectedAddons: {},
        },
      };
    }

    case 'SET_ADDON_OPTION': {
      const { groupId, optionId, optionName, price } = action.payload;
      
      const variation = product.Variations.find(
        v => v.Id === state.customization.selectedVariationId
      );
      const group = variation?.ItemChoices.find(g => g.Id === groupId);
      
      if (!group) return state;

      const newSelectedGroup: SelectedAddonGroup = {
        groupId,
        groupName: group.Name,
        requiredQuantity: group.Quantity,
        selectedOptions: [{
          optionId,
          optionName,
          quantity: 1,
          price,
        }],
      };

      return {
        ...state,
        customization: {
          ...state.customization,
          selectedAddons: {
            ...state.customization.selectedAddons,
            [groupId]: newSelectedGroup,
          },
        },
      };
    }

    case 'ADD_ADDON_QUANTITY': {
      const { groupId, optionId, optionName, price } = action.payload;
      
      const currentGroup = state.customization.selectedAddons[groupId];
      const variation = product.Variations.find(
        v => v.Id === state.customization.selectedVariationId
      );
      const groupDefinition = variation?.ItemChoices.find(g => g.Id === groupId);
      
      if (!groupDefinition) return state;

      const totalSelected = currentGroup?.selectedOptions.reduce(
        (sum, opt) => sum + opt.quantity, 0
      ) || 0;

      if (totalSelected >= groupDefinition.Quantity) {
        return state;
      }

      let updatedOptions: SelectedAddonOption[];

      if (!currentGroup) {
        updatedOptions = [{
          optionId,
          optionName,
          quantity: 1,
          price,
        }];
      } else {
        const existingOptionIndex = currentGroup.selectedOptions.findIndex(
          opt => opt.optionId === optionId
        );

        if (existingOptionIndex >= 0) {
          updatedOptions = [...currentGroup.selectedOptions];
          updatedOptions[existingOptionIndex] = {
            ...updatedOptions[existingOptionIndex],
            quantity: updatedOptions[existingOptionIndex].quantity + 1,
          };
        } else {
          updatedOptions = [
            ...currentGroup.selectedOptions,
            { optionId, optionName, quantity: 1, price },
          ];
        }
      }

      return {
        ...state,
        customization: {
          ...state.customization,
          selectedAddons: {
            ...state.customization.selectedAddons,
            [groupId]: {
              groupId,
              groupName: groupDefinition.Name,
              requiredQuantity: groupDefinition.Quantity,
              selectedOptions: updatedOptions,
            },
          },
        },
      };
    }

    case 'REMOVE_ADDON_QUANTITY': {
      const { groupId, optionId } = action.payload;
      
      const currentGroup = state.customization.selectedAddons[groupId];
      if (!currentGroup) return state;

      const optionIndex = currentGroup.selectedOptions.findIndex(
        opt => opt.optionId === optionId
      );
      
      if (optionIndex < 0) return state;

      const option = currentGroup.selectedOptions[optionIndex];
      let updatedOptions: SelectedAddonOption[];

      if (option.quantity > 1) {
        updatedOptions = [...currentGroup.selectedOptions];
        updatedOptions[optionIndex] = {
          ...option,
          quantity: option.quantity - 1,
        };
      } else {
        updatedOptions = currentGroup.selectedOptions.filter(
          opt => opt.optionId !== optionId
        );
      }

      if (updatedOptions.length === 0) {
        const { [groupId]: removed, ...remainingGroups } = state.customization.selectedAddons;
        return {
          ...state,
          customization: {
            ...state.customization,
            selectedAddons: remainingGroups,
          },
        };
      }

      return {
        ...state,
        customization: {
          ...state.customization,
          selectedAddons: {
            ...state.customization.selectedAddons,
            [groupId]: {
              ...currentGroup,
              selectedOptions: updatedOptions,
            },
          },
        },
      };
    }

    case 'SET_QUANTITY': {
      return {
        ...state,
        customization: {
          ...state.customization,
          quantity: Math.max(1, action.payload),
        },
      };
    }

    case 'SET_INSTRUCTIONS': {
      return {
        ...state,
        customization: {
          ...state.customization,
          specialInstructions: action.payload,
        },
      };
    }

    case 'RESET': {
      return getInitialState(product);
    }

    default:
      return state;
  }
}

// ============= CONTEXT =============

interface ProductModalContextValue {
  product: ProductItem;
  customization: ProductCustomization;
  currentVariation: ProductVariation | null;
  priceBreakdown: PriceBreakdown;
  errors: CustomizationError[];
  isValid: boolean;
  
  // Actions
  setSize: (sizeId: number) => void;
  setFlavor: (flavorId: number) => void;
  setAddonOption: (groupId: number, optionId: number, optionName: string, price: number) => void;
  addAddonQuantity: (groupId: number, optionId: number, optionName: string, price: number) => void;
  removeAddonQuantity: (groupId: number, optionId: number) => void;
  setQuantity: (quantity: number) => void;
  setInstructions: (instructions: string) => void;
  reset: () => void;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(null);

// ============= PROVIDER =============

interface ProductModalProviderProps {
  product: ProductItem;
  children: ReactNode;
}

export function ProductModalProvider({ product, children }: ProductModalProviderProps) {
  const [state, dispatch] = useReducer(
    (state: ProductModalState, action: ProductModalAction) => 
      productModalReducer(state, action, product),
    product,
    getInitialState
  );

  // Get current variation from size + flavor combo
  const currentVariation = useMemo(() => {
    return findVariationByCombo(
      product,
      state.customization.selectedSizeId,
      state.customization.selectedFlavorId
    );
  }, [product, state.customization.selectedSizeId, state.customization.selectedFlavorId]);

  // Calculate price
  const priceBreakdown = useMemo(() => {
    return calculatePrice(currentVariation, state.customization);
  }, [currentVariation, state.customization]);

  // Validate
  const { errors, isValid } = useMemo(() => {
    return validateCustomization(currentVariation, state.customization);
  }, [currentVariation, state.customization]);

  // Action creators
  const actions = useMemo(
    () => ({
      setSize: (sizeId: number) => 
        dispatch({ type: 'SET_SIZE', payload: sizeId }),
      
      setFlavor: (flavorId: number) =>
        dispatch({ type: 'SET_FLAVOR', payload: flavorId }),
      
      setAddonOption: (groupId: number, optionId: number, optionName: string, price: number) =>
        dispatch({ type: 'SET_ADDON_OPTION', payload: { groupId, optionId, optionName, price } }),
      
      addAddonQuantity: (groupId: number, optionId: number, optionName: string, price: number) =>
        dispatch({ type: 'ADD_ADDON_QUANTITY', payload: { groupId, optionId, optionName, price } }),
      
      removeAddonQuantity: (groupId: number, optionId: number) =>
        dispatch({ type: 'REMOVE_ADDON_QUANTITY', payload: { groupId, optionId } }),
      
      setQuantity: (quantity: number) =>
        dispatch({ type: 'SET_QUANTITY', payload: quantity }),
      
      setInstructions: (instructions: string) =>
        dispatch({ type: 'SET_INSTRUCTIONS', payload: instructions }),
      
      reset: () => dispatch({ type: 'RESET' }),
    }),
    []
  );

  const value: ProductModalContextValue = {
    product,
    customization: state.customization,
    currentVariation,
    priceBreakdown,
    errors,
    isValid,
    ...actions,
  };

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
}

// ============= HOOK =============

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within ProductModalProvider');
  }
  return context;
}