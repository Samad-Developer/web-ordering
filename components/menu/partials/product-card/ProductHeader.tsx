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
    <div className={`space-y-2 ${className} mb-2`}>
      <h3 className="text-base sm:text-lg font-bold text-product-name line-clamp-1 leading-tight">
        {name}
      </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
          {shouldShowDescription ? description : 'A deliciously prepared dish made with fresh, high-quality ingredients for great taste.'}
        </p>
    </div>
  );
};