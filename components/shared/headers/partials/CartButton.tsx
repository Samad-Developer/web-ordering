import React, { useState } from 'react';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';
import { ShoppingCart } from 'lucide-react';

interface CartProps {
  cartIcon: React.ReactNode;
  href?: string;
}

export const CartButton: React.FC<CartProps> = ({ cartIcon, href = '/cart' }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const handleCartToggle = () => {
    dispatch(toggleCart(true));
  }

  return (
    <button
      onClick={handleCartToggle}
      className="relative flex items-center justify-center p-2 rounded-lg transition bg-primary text-secondary hover:opacity-80 cursor-pointer"
    >
      {/* {cartIcon} */}
      <ShoppingCart/>

      {cartItems.length > 0 && (
        <span className="absolute -top-3 -right-3 w-5 md:w-6 h-5 md:h-6 rounded-full flex items-center justify-center text-xs font-bold bg-red-500 text-white border-2 border-white shadow">
          {cartItems.length > 99 ? "99+" : cartItems.length}
        </span>
      )}
    </button>

  );
};