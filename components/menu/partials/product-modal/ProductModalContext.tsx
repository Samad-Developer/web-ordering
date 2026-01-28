import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import { ProductItem, ProductVariation } from "@/types/product.types";
import { getAvailableFlavorsForSize } from "@/lib/product/productHelper";
import {
  ProductCustomization,
  SelectedAddonGroup,
  SelectedAddonOption,
  CustomizationError,
  PriceBreakdown,
} from "@/types/customization.types";

import {
  calculatePrice,
  validateCustomization,
  findVariationByCombo,
  getDefaultSize,
  getDefaultFlavor,
} from "@/lib/product/productHelper";

// ============= ACTION TYPES =============

type ProductModalAction =
  | { type: "SET_SIZE"; payload: number }
  | { type: "SET_FLAVOR"; payload: number }
  | {
      type: "SET_ADDON_OPTION";
      payload: {
        choiceId: number;
        optionId: number;
        optionName: string;
        price: number;
      };
    }
  | {
      type: "ADD_ADDON_QUANTITY";
      payload: {
        choiceId: number;
        optionId: number;
        optionName: string;
        price: number;
      };
    }
  | {
      type: "REMOVE_ADDON_QUANTITY";
      payload: {
        choiceId: number;
        optionId: number;
      };
    }
  | { type: "SET_QUANTITY"; payload: number }
  | { type: "SET_INSTRUCTIONS"; payload: string }
  | { type: "RESET" };

// ============= STATE TYPES =============

interface ProductModalState {
  customization: ProductCustomization;
  errors: CustomizationError[];
}

// ============= INITIAL STATE =============

function getInitialState(product: ProductItem): ProductModalState {
  // Auto-select if only one size exists
  const defaultSizeId =
    product.Variations.length === 1
      ? product.Variations[0].Size.Id
      : getDefaultSize(product);

  // Auto-select if only one flavor exists for that size
  const defaultFlavorId =
    defaultSizeId && product.Variations.length === 1
      ? product.Variations[0].Flavour.Id
      : product.Variations[0].Flavour.Id;

  // Find variation ID from combination
  const defaultVariationId =
    defaultSizeId && defaultFlavorId
      ? findVariationByCombo(product, defaultSizeId, defaultFlavorId)?.Id ||
        null
      : null;

  return {
    customization: {
      selectedSizeId: defaultSizeId,
      selectedFlavorId: defaultFlavorId,
      selectedVariationId: defaultVariationId,
      selectedAddons: {},
      quantity: 1,
      specialInstructions: "",
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
    case "SET_SIZE": {
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
        const isCurrentFlavorAvailable = availableFlavors.some(
          (f) => f.id === currentFlavorId
        );

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

    case "SET_FLAVOR": {
      const newFlavorId = action.payload;
      const currentSizeId = state.customization.selectedSizeId;

      // Can't select flavor without size
      if (!currentSizeId) return state;

      // Find variation ID
      const newVariationId =
        findVariationByCombo(product, currentSizeId, newFlavorId)?.Id || null;

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

    case "SET_ADDON_OPTION": {
      const { choiceId, optionId, optionName, price } = action.payload;

      const variation = product.Variations.find(
        (v) => v.Id === state.customization.selectedVariationId
      );
      const choice = variation?.ItemChoices.find(
        (choice) => choice.Id === choiceId
      );

      if (!choice) return state;

      const newSelectedGroup: SelectedAddonGroup = {
        choiceId,
        choiceName: choice.Name,
        requiredQuantity: choice.MaxChoice,
        selectedOptions: [
          {
            optionId,
            optionName,
            quantity: 1,
            price,
          },
        ],
      };

      return {
        ...state,
        customization: {
          ...state.customization,
          selectedAddons: {
            ...state.customization.selectedAddons,
            [choiceId]: newSelectedGroup,
          },
        },
      };
    }

    case "ADD_ADDON_QUANTITY": {
      const { choiceId, optionId, optionName, price } = action.payload;

      const currentChoice = state.customization.selectedAddons[choiceId];
      const variation = product.Variations.find(
        (v) => v.Id === state.customization.selectedVariationId
      );
      const choiceDefinition = variation?.ItemChoices.find(
        (choice) => choice.Id === choiceId
      );

      if (!choiceDefinition) return state;

      // Check MaxChoice limit
      const totalSelected = currentChoice?.selectedOptions?.reduce(
          (total, option) => total + option.quantity, 0
        ) || 0;

        if(totalSelected >= choiceDefinition.MaxChoice && choiceDefinition.MaxChoice > 0) {
          return state; // Can't add more if reached required quantity
        }

      // Check if this option already exists
      const existingOption = currentChoice?.selectedOptions.find(
        (opt) => opt.optionId === optionId
      );

      // If MaxChoice = 0 (optional), no limit
      if (choiceDefinition.MaxChoice === 0) {
        // Can add unlimited
      }
      // If MaxChoice > 0, check limit only for NEW options
      else if (choiceDefinition.MaxChoice > 0) {
        // If adding a NEW option and already at MaxChoice limit
        if (
          !existingOption &&
          totalSelected >= choiceDefinition.MaxChoice
        ) {
          return state; // Can't add more different options
        }
      }

      let updatedOptions: SelectedAddonOption[];

      if (!currentChoice) {
        updatedOptions = [
          {
            optionId,
            optionName,
            quantity: 1,
            price,
          },
        ];
      } else {
        const existingOptionIndex = currentChoice.selectedOptions.findIndex(
          (opt) => opt.optionId === optionId
        );

        if (existingOptionIndex >= 0) {
          // Increment existing option quantity
          updatedOptions = [...currentChoice.selectedOptions];
          updatedOptions[existingOptionIndex] = {
            ...updatedOptions[existingOptionIndex],
            quantity: updatedOptions[existingOptionIndex].quantity + 1,
          };
        } else {
          // Add new option
          updatedOptions = [
            ...currentChoice.selectedOptions,
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
            [choiceId]: {
              choiceId,
              choiceName: choiceDefinition.Name,
              requiredQuantity: choiceDefinition.MaxChoice, // Keep for display only
              selectedOptions: updatedOptions,
            },
          },
        },
      };

     
    }

    case "REMOVE_ADDON_QUANTITY": {
      const { choiceId, optionId } = action.payload;

      const choiceGroup = state.customization.selectedAddons[choiceId];
      if (!choiceGroup) return state;

      const optionIndex = choiceGroup.selectedOptions.findIndex(
        (opt) => opt.optionId === optionId
      );

      if (optionIndex < 0) return state;

      const option = choiceGroup.selectedOptions[optionIndex];
      let updatedOptions: SelectedAddonOption[];

      if (option.quantity > 1) {
        updatedOptions = [...choiceGroup.selectedOptions];
        updatedOptions[optionIndex] = {
          ...option,
          quantity: option.quantity - 1,
        };
      } else {
        updatedOptions = choiceGroup.selectedOptions.filter(
          (opt) => opt.optionId !== optionId
        );
      }

      if (updatedOptions.length === 0) {
        const { [choiceId]: removed, ...remainingGroups } =
          state.customization.selectedAddons;
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
            [choiceId]: {
              ...choiceGroup,
              selectedOptions: updatedOptions,
            },
          },
        },
      };
    }

    case "SET_QUANTITY": {
      return {
        ...state,
        customization: {
          ...state.customization,
          quantity: Math.max(1, action.payload),
        },
      };
    }

    case "SET_INSTRUCTIONS": {
      return {
        ...state,
        customization: {
          ...state.customization,
          specialInstructions: action.payload,
        },
      };
    }

    case "RESET": {
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
  setAddonOption: (
    groupId: number,
    optionId: number,
    optionName: string,
    price: number
  ) => void;
  addAddonQuantity: (
    groupId: number,
    optionId: number,
    optionName: string,
    price: number
  ) => void;
  removeAddonQuantity: (groupId: number, optionId: number) => void;
  setQuantity: (quantity: number) => void;
  setInstructions: (instructions: string) => void;
  reset: () => void;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(
  null
);

// ============= PROVIDER =============

interface ProductModalProviderProps {
  product: ProductItem;
  children: ReactNode;
}

export function ProductModalProvider({
  product,
  children,
}: ProductModalProviderProps) {

  const [state, dispatch] = useReducer(
    (state: ProductModalState, action: ProductModalAction) => productModalReducer(state, action, product),
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
        dispatch({ type: "SET_SIZE", payload: sizeId }),

      setFlavor: (flavorId: number) =>
        dispatch({ type: "SET_FLAVOR", payload: flavorId }),

      setAddonOption: (
        choiceId: number,
        optionId: number,
        optionName: string,
        price: number
      ) =>
        dispatch({
          type: "SET_ADDON_OPTION",
          payload: { choiceId, optionId, optionName, price },
        }),

      addAddonQuantity: (
        choiceId: number,
        optionId: number,
        optionName: string,
        price: number
      ) =>
        dispatch({
          type: "ADD_ADDON_QUANTITY",
          payload: { choiceId, optionId, optionName, price },
        }),

      removeAddonQuantity: (choiceId: number, optionId: number) =>
        dispatch({
          type: "REMOVE_ADDON_QUANTITY",
          payload: { choiceId, optionId },
        }),

      setQuantity: (quantity: number) =>
        dispatch({ type: "SET_QUANTITY", payload: quantity }),

      setInstructions: (instructions: string) =>
        dispatch({ type: "SET_INSTRUCTIONS", payload: instructions }),

      reset: () => dispatch({ type: "RESET" }),
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

  return <ProductModalContext value={value}>{children}</ProductModalContext>;
}

// ============= HOOK =============

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModal must be used within ProductModalProvider");
  }
  return context;
}
