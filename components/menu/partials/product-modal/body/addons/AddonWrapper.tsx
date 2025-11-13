import React from 'react';
import { ItemChoice } from '@/types/menu.types';
import { useProductModal } from '../../ProductModalContext';
import { AddonOption } from './AddonOption';

interface AddonSelectorProps {
  choice: ItemChoice;
}

export function AddonWrapper({ choice }: AddonSelectorProps) {
  const { customization } = useProductModal();
  
  const selectedGroup = customization.selectedAddons[choice.Id];
  
  // Count how many DIFFERENT options are selected
  const selectedOptionsCount = selectedGroup?.selectedOptions?.reduce(
          (total, option) => total + option.quantity, 0
        ) || 0;

  // Determine if optional
  const isOptional = choice.MaxChoice === 0;
  
  // For multi-select (MaxChoice > 1 or optional)
  const isMultiSelect = choice.MaxChoice !== 1;

  // Calculate if user can add more DIFFERENT options
  let canAddMore = true;
  
  if (!isOptional && choice.MaxChoice > 0) {
    canAddMore = selectedOptionsCount < choice.MaxChoice;
  }

  return (
    <div className="space-y-3">
      {/* Progress Indicator - Only for MaxChoice > 1 */}
      {choice.MaxChoice > 1 && !isOptional && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Selected: {selectedOptionsCount} / {choice.MaxChoice}
          </span>
          {selectedOptionsCount === choice.MaxChoice && (
            <span className="text-green-600 font-medium">✓ Complete</span>
          )}
        </div>
      )}

      {/* Optional Badge */}
      {isOptional && (
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
          Optional - Select as many as you like
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-2">
        {choice.ItemOptions.map((option) => {
          const selectedOption = selectedGroup?.selectedOptions.find(
            opt => opt.optionId === option.Id
          );
          
          return (
            <AddonOption
              key={option.Id}
              choiceId={choice.Id}
              option={option}
              selectedQuantity={selectedOption?.quantity || 0}
              isMultiSelect={isMultiSelect}
              canAddMore={canAddMore}
              maxChoice={choice.MaxChoice}
            />
          );
        })}
      </div>
    </div>
  );
}