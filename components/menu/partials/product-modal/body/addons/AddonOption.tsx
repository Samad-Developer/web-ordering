import React from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { ItemOption } from '@/types/menu.types';
import { useProductModal } from '../../ProductModalContext';
import { formatPrice } from '@/lib/product/productHelper';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChoiceOptionProps {
  choiceId: number;
  option: ItemOption;
  selectedQuantity: number;
  isMultiSelect: boolean;
  canAddMore: boolean;
  maxChoice: number;
}

export function AddonOption({
  choiceId,
  option,
  selectedQuantity,
  isMultiSelect,
  canAddMore,
  maxChoice,
}: ChoiceOptionProps) {
  const { setChoiceOption, addChoiceQuantity, removeChoiceQuantity } = useProductModal();

  const isSelected = selectedQuantity > 0;

  // Single select mode (MaxChoice = 1, Quantity = 1)
  if (!isMultiSelect && maxChoice === 1) {
    return (
      <button
        // onClick={() => setChoiceOption(choiceId, option.Id, option.Name, option.Price)}
        onClick={() => {}}
        className={cn(
          "w-full p-4 rounded-lg border-2 text-left transition-all",
          isSelected
            ? "border-red-500 bg-red-50"
            : "border-gray-100 hover:border-gray-300 hover:bg-gray-50 bg-white"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium text-gray-900">{option.Name}</div>
            {option.Price > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                +{formatPrice(option.Price)}
              </div>
            )}
          </div>

          {isSelected && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </button>
    );
  }

  // Multi-select mode (Quantity > 1)
  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg border-2 transition-all",
        isSelected
          ? "border-red-500 bg-red-50"
          : "border-gray-200 bg-white"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Option Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{option.Name}</div>
          {option.Price > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              +{formatPrice(option.Price)} each
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            // onClick={() => removeChoiceQuantity(choiceId, option.Id)}
            onClick={() => {}}
            disabled={selectedQuantity === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="w-8 text-center font-medium text-gray-900">
            {selectedQuantity}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            // onClick={() => addChoiceQuantity(choiceId, option.Id, option.Name, option.Price)}
            onClick={() => {}}
            disabled={!canAddMore}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}