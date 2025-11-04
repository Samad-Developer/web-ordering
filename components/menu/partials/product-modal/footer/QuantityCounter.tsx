// components/product-modal/footer/quantity-counter.tsx

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useProductModal } from '../product-modal-context';

export function QuantityCounter() {
//   const { configuration, setQuantity } = useProductModal();

  const handleDecrement = () => {
    // if (configuration.quantity > 1) {
    //   setQuantity(configuration.quantity - 1);
    // }
  };

  const handleIncrement = () => {
    // setQuantity(configuration.quantity + 1);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        // disabled={configuration.quantity <= 1}
        className="h-10 w-10 hover:bg-white rounded-lg"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="min-w-[40px] text-center">
        <span className="text-lg font-semibold text-gray-900">
          {/* {configuration.quantity} */}
          10
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        className="h-10 w-10 hover:bg-white rounded-lg"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}