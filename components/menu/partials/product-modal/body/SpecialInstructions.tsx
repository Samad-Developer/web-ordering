import React from 'react';
import { Textarea } from '@/components/ui/textarea';
// import { useProductModal } from '../product-modal-context';

export function SpecialInstructions() {
//   const { configuration, setInstructions } = useProductModal();

  return (
    <div className="px-6 py-4 space-y-3">
      <h3 className="text-base font-semibold text-gray-900">
        Special Instructions
      </h3>
      
      <Textarea
        placeholder="Add any special requests or dietary requirements..."
        // value={configuration.specialInstructions || ''}
        // onChange={(e) => setInstructions(e.target.value)}
        value={''}
        onChange={() => {}}
        className="min-h-[100px] resize-none"
        maxLength={500}
      />
      
      <p className="text-xs text-gray-500">
        {/* {(configuration.specialInstructions || '').length} / 500 characters */}
        {("Please make it less spicy and add extra cheese.").length} / 500 characters
      </p>
    </div>
  );
}