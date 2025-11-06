import { ProductItem, ProductVariation } from "@/types/product.types";
import {
  calculatePrice,
  validateConfiguration,
} from "@/lib/product/productHelper";
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import {
  ProductConfiguration,
  SelectedChoice,
  SelectedOption,
  ConfigurationError,
  PriceBreakdown,
} from "@/types/configuration.types";

// ============= STATE TYPES =============

interface ProductModalState {
  configuration: ProductConfiguration;
  errors: ConfigurationError[];
}

// ============= ACTION TYPES =============

type ProductModalAction =
  | { type: "SET_VARIATION"; payload: number }
  | {
      type: "SET_CHOICE_OPTION";
      payload: {
        choiceId: number;
        optionId: number;
        optionName: string;
        price: number;
      };
    }
  | {
      type: "ADD_CHOICE_QUANTITY";
      payload: {
        choiceId: number;
        optionId: number;
        optionName: string;
        price: number;
      };
    }
  | {
      type: "REMOVE_CHOICE_QUANTITY";
      payload: {
        choiceId: number;
        optionId: number;
      };
    }
  | { type: "SET_QUANTITY"; payload: number }
  | { type: "SET_INSTRUCTIONS"; payload: string }
  | { type: "RESET" };

// ============= CONTEXT TYPES =============

interface ProductModalContextValue {
  // State
  product: ProductItem;
  configuration: ProductConfiguration;
  currentVariation: ProductVariation | null;
  priceBreakdown: PriceBreakdown;
  errors: ConfigurationError[];
  isValid: boolean;

  // Actions
  setVariation: (variationId: number) => void;
  setChoiceOption: (
    choiceId: number,
    optionId: number,
    optionName: string,
    price: number
  ) => void;
  addChoiceQuantity: (
    choiceId: number,
    optionId: number,
    optionName: string,
    price: number
  ) => void;
  removeChoiceQuantity: (choiceId: number, optionId: number) => void;
  setQuantity: (quantity: number) => void;
  setInstructions: (instructions: string) => void;
  reset: () => void;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(
  null
);

// ============= INITIAL STATE =============

function getInitialState(product: ProductItem): ProductModalState {
  // If only one variation, pre-select it
  const defaultVariation = product.Variations.length === 1 ? product.Variations[0].Id : null;

  return {
    configuration: {
      selectedVariationId: defaultVariation,
      selectedChoices: {},
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
    case "SET_VARIATION": {
      // When variation changes, reset all choices
      return {
        ...state,
        configuration: {
          ...state.configuration,
          selectedVariationId: action.payload,
          selectedChoices: {}, // Clear all choices
        },
      };
    }

    case "SET_CHOICE_OPTION": {
      const { choiceId, optionId, optionName, price } = action.payload;

      // Find the choice definition
      const variation = product.Variations.find(
        (v) => v.Id === state.configuration.selectedVariationId
      );
      const choice = variation?.ItemChoices.find((c) => c.Id === choiceId);

      if (!choice) return state;

      // For MaxChoice = 1, replace the selection
      // For multi-quantity choices (Quantity > 1), need different logic
      const newSelectedChoice: SelectedChoice = {
        choiceId,
        choiceName: choice.Name,
        requiredQuantity: choice.Quantity,
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
        configuration: {
          ...state.configuration,
          selectedChoices: {
            ...state.configuration.selectedChoices,
            [choiceId]: newSelectedChoice,
          },
        },
      };
    }

    case "ADD_CHOICE_QUANTITY": {
      const { choiceId, optionId, optionName, price } = action.payload;

      const currentChoice = state.configuration.selectedChoices[choiceId];
      const variation = product.Variations.find(
        (v) => v.Id === state.configuration.selectedVariationId
      );
      const choiceDefinition = variation?.ItemChoices.find(
        (c) => c.Id === choiceId
      );

      if (!choiceDefinition) return state;

      // Calculate total selected quantity for this choice
      const totalSelected =
        currentChoice?.selectedOptions.reduce(
          (sum, opt) => sum + opt.quantity,
          0
        ) || 0;

      // Check if we can add more
      if (totalSelected >= choiceDefinition.Quantity) {
        return state; // Already at max
      }

      let updatedOptions: SelectedOption[];

      if (!currentChoice) {
        // First selection
        updatedOptions = [
          {
            optionId,
            optionName,
            quantity: 1,
            price,
          },
        ];
      } else {
        // Check if this option already exists
        const existingOptionIndex = currentChoice.selectedOptions.findIndex(
          (opt) => opt.optionId === optionId
        );

        if (existingOptionIndex >= 0) {
          // Increment existing option
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
        configuration: {
          ...state.configuration,
          selectedChoices: {
            ...state.configuration.selectedChoices,
            [choiceId]: {
              choiceId,
              choiceName: choiceDefinition.Name,
              requiredQuantity: choiceDefinition.Quantity,
              selectedOptions: updatedOptions,
            },
          },
        },
      };
    }

    case "REMOVE_CHOICE_QUANTITY": {
      const { choiceId, optionId } = action.payload;

      const currentChoice = state.configuration.selectedChoices[choiceId];
      if (!currentChoice) return state;

      const optionIndex = currentChoice.selectedOptions.findIndex(
        (opt) => opt.optionId === optionId
      );

      if (optionIndex < 0) return state;

      const option = currentChoice.selectedOptions[optionIndex];
      let updatedOptions: SelectedOption[];

      if (option.quantity > 1) {
        // Decrement quantity
        updatedOptions = [...currentChoice.selectedOptions];
        updatedOptions[optionIndex] = {
          ...option,
          quantity: option.quantity - 1,
        };
      } else {
        // Remove option entirely
        updatedOptions = currentChoice.selectedOptions.filter(
          (opt) => opt.optionId !== optionId
        );
      }

      // If no options left, remove the choice
      if (updatedOptions.length === 0) {
        const { [choiceId]: removed, ...remainingChoices } = state.configuration.selectedChoices;
        return {
          ...state,
          configuration: {
            ...state.configuration,
            selectedChoices: remainingChoices,
          },
        };
      }

      return {
        ...state,
        configuration: {
          ...state.configuration,
          selectedChoices: {
            ...state.configuration.selectedChoices,
            [choiceId]: {
              ...currentChoice,
              selectedOptions: updatedOptions,
            },
          },
        },
      };
    }

    case "SET_QUANTITY": {
      return {
        ...state,
        configuration: {
          ...state.configuration,
          quantity: Math.max(1, action.payload),
        },
      };
    }

    case "SET_INSTRUCTIONS": {
      return {
        ...state,
        configuration: {
          ...state.configuration,
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



  // Get current variation
  const currentVariation = useMemo(() => {
    if (!state.configuration.selectedVariationId) return null;
    return (
      product.Variations.find(
        (v) => v.Id === state.configuration.selectedVariationId
      ) || null
    );
  }, [product, state.configuration.selectedVariationId]);



  // Calculate price
  const priceBreakdown = useMemo(() => {
    return calculatePrice(currentVariation, state.configuration);
  }, [currentVariation, state.configuration]);



  // Validate configuration
  const { errors, isValid } = useMemo(() => {
    return validateConfiguration(currentVariation, state.configuration);
  }, [currentVariation, state.configuration]);



  // Action creators
  const actions = useMemo(
    () => ({
      setVariation: (variationId: number) => 
        dispatch({ 
          type: "SET_VARIATION", 
          payload: variationId 
        }),

      setChoiceOption: (
        choiceId: number,
        optionId: number,
        optionName: string,
        price: number
      ) =>
        dispatch({
          type: "SET_CHOICE_OPTION",
          payload: { choiceId, optionId, optionName, price },
        }),

      addChoiceQuantity: (
        choiceId: number,
        optionId: number,
        optionName: string,
        price: number
      ) =>
        dispatch({
          type: "ADD_CHOICE_QUANTITY",
          payload: { choiceId, optionId, optionName, price },
        }),

      removeChoiceQuantity: (choiceId: number, optionId: number) =>
        dispatch({
          type: "REMOVE_CHOICE_QUANTITY",
          payload: { choiceId, optionId },
        }),

      setQuantity: (quantity: number) =>
        dispatch({ 
          type: "SET_QUANTITY", 
          payload: quantity 
        }),

      setInstructions: (instructions: string) =>
        dispatch({ 
          type: "SET_INSTRUCTIONS", 
          payload: instructions 
        }),

      reset: () => dispatch({ 
        type: "RESET" 
      }),

    }),
    []
  );

  const value: ProductModalContextValue = {
    product,
    configuration: state.configuration,
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
    throw new Error("useProductModal must be used within ProductModalProvider");
  }
  return context;
}
