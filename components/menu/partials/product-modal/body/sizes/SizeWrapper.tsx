import React from 'react';
import { useProductModal } from '../../ProductModalContext';
import { SizeOption } from './SizeOption';

export function SizeWrapper() {
  const { product, configuration } = useProductModal();

  return (
    <div className="grid grid-cols-1 gap-3">
      {product.Variations.map((variation) => (
        <SizeOption
          key={variation.Id}
          variation={variation}
          isSelected={configuration.selectedVariationId === variation.Id}
        />
      ))}
    </div>
  );
}