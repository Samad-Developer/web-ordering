import React from 'react';
import { ItemChoice } from '@/types/menu.types';
import { AddonOption } from './AddonOption';
import { useProductModal } from '../../ProductModalContext';

interface ChoiceSelectorProps {
  choice: ItemChoice;
}

export function AddonWrapper({ choice }: ChoiceSelectorProps) {
  const { configuration } = useProductModal();
  
  const selectedChoice = configuration.selectedChoices[choice.Id];
  
  // Calculate total selected quantity
  const totalSelected = selectedChoice?.selectedOptions.reduce(
    (sum, opt) => sum + opt.quantity,
    0
  ) || 0;

  // Determine selection mode
  const isMultiSelect = choice.Quantity > 1;
  const canAddMore = totalSelected < choice.Quantity;

  return (
    <div className="space-y-3">
      {/* Progress Indicator */}
      {isMultiSelect && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Selected: {totalSelected} / {choice.Quantity}
          </span>
          {totalSelected === choice.Quantity && (
            <span className="text-green-600 font-medium">✓ Complete</span>
          )}
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-2">
        {choice.ItemOptions.map((option) => {
          const selectedOption = selectedChoice?.selectedOptions.find(
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