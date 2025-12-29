import React, { useState } from 'react';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';

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
    <button onClick={handleCartToggle} className="relative cursor-pointer">
      <button className="flex items-center justify-center p-2 rounded-full transition bg-secondary  hover:opacity-80 cursor-pointer">
        {cartIcon}
      </button>
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 w-5 md:w-6 h-5 md:h-6 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-secondary cursor-pointer border border-white">
          {cartItems.length > 99 ? '99+' : cartItems.length}
        </span>
      )}
    </button>
  );
};