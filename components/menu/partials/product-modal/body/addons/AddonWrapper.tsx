import React from 'react';
import { ItemChoice } from '@/types/menu.types';
import { useProductModal } from '../../ProductModalContext';
import { AddonOption } from './AddonOption';

interface AddonSelectorProps {
  choice: ItemChoice;
  onComplete?: (isComplete: boolean) => void;
}

export function AddonWrapper({
  choice,
  onComplete
}: AddonSelectorProps) {
  const { customization } = useProductModal();

  const selectedGroup = customization.selectedAddons[choice.Id];

  const selectedOptionsCount = selectedGroup?.selectedOptions?.reduce(
    (total, option) => total + option.quantity, 0
  ) || 0;

  const isOptional = choice.MaxChoice === 0;
  const isMultiSelect = choice.MaxChoice !== 1;

  let canAddMore = true;
  if (!isOptional && choice.MaxChoice > 0) {
    canAddMore = selectedOptionsCount < choice.MaxChoice;
  }

  const isComplete = !isOptional && choice.MaxChoice > 0 && selectedOptionsCount >= choice.MaxChoice;

  React.useEffect(() => {
    if (isComplete && onComplete) {
      onComplete(true);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="space-y-3">
      {/* Progress Indicator */}
      {choice.MaxChoice > 1 && !isOptional && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Selected: {selectedOptionsCount} / {choice.MaxChoice}
          </span>
          {isComplete && (
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