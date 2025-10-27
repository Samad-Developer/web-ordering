'use client';

import React from 'react';

interface ProductHeaderProps {
  name: string;
  description: string;
  className?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 leading-tight">
        {name}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
};