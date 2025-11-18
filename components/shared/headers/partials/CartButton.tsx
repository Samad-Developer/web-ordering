import React, { useState } from 'react';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';

interface CartProps {
  cartIcon: React.ReactNode;
  href?: string;
}

export const Cart: React.FC<CartProps> = ({ cartIcon, href = '/cart' }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const handleCartToggle = () => {
    dispatch(toggleCart(true));
  } 

  return (
    <button onClick={handleCartToggle} className="relative cursor-pointer">
      <button className="flex items-center justify-center md:p-2 rounded-lg transition bg-header-cart-bg  hover:opacity-80 cursor-pointer">
        {cartIcon}
      </button>
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 w-5 md:w-6 h-5 md:h-6 rounded-full flex items-center justify-center text-xs font-bold bg-header-cart-badge text-header-cart-badge-text cursor-pointer">
          {cartItems.length > 99 ? '99+' : cartItems.length}
        </span>
      )}
    </button>
  );
};