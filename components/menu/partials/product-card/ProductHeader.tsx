'use client';

import React from 'react';

interface ProductHeaderProps {
  name: string;
  description?: string;
  className?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  className = '',
}) => {

  const shouldShowDescription = description && description !== 'null' && description.trim() !== '' && description.trim().toLowerCase() !== 'N/A';

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-product-name line-clamp-1 leading-tight">
        {name}
      </h3>
        <p className="text-sm text-product-desc line-clamp-2 leading-relaxed">
          {shouldShowDescription ? description : 'A deliciously prepared dish made with fresh, high-quality ingredients for great taste.'}
        </p>
    </div>
  );
};