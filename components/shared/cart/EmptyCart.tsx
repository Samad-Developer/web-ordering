// components/cart/EmptyCart.tsx

'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';

export function EmptyCart() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBrowseMenu = () => {
    dispatch(toggleCart(false));
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h3>
      <p className="text-sm text-gray-500 text-center mb-8 max-w-xs">
        Looks like you haven't added anything to your cart yet. Start exploring our delicious menu!
      </p>

      {/* CTA Button */}
      <Button size="lg" onClick={handleBrowseMenu}>
        Browse Menu
      </Button>
    </div>
  );
}