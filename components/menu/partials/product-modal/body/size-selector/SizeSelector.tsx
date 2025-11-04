import React from 'react';
// import { useProductModal } from '../../product-modal-context';
// import { VariationOption } from './variation-option';

export function SizeSelector() {
//   const { product, configuration } = useProductModal();

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* {product.Variations.map((variation) => (
        <VariationOption
          key={variation.Id}
          variation={variation}
          isSelected={configuration.selectedVariationId === variation.Id}
        />
      ))} */}
    </div>
  );
}