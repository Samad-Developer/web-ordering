import React, { useEffect, useState } from 'react';

interface CartProps {
  cartIcon: React.ReactNode;
  href?: string;
}

export const Cart: React.FC<CartProps> = ({ cartIcon, href = '/cart' }) => {
  const [itemCount, setItemCount] = useState(99);

  return (
    <a href={href} className="relative">
      <button className="flex items-center justify-center md:p-2 rounded-lg transition bg-header-cart-bg  hover:opacity-80">
        {cartIcon}
      </button>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 w-5 md:w-6 h-5 md:h-6 rounded-full flex items-center justify-center text-xs font-bold bg-header-cart-badge text-header-cart-badge-text">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </a>
  );
};