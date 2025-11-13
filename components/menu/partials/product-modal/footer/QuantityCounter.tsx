import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductModal } from '../ProductModalContext';

export function QuantityCounter() {
  const { customization, setQuantity } = useProductModal();

  const handleDecrement = () => {
    if (customization.quantity > 1) {
      setQuantity(customization.quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(customization.quantity + 1);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={customization.quantity <= 1}
        className="h-10 w-10 hover:bg-white rounded-lg"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="min-w-[40px] border-l border-gray-300 border-r  text-center">
        <span className="text-lg font-semibold text-gray-900">
          {customization.quantity}
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