// 'use client';

// import React from 'react';
// import { ProductSize } from '@/types/product';

// interface SizeSelectorProps {
//   sizes: ProductSize[];
//   selectedSize: string;
//   onSizeChange: (size: string) => void;
//   className?: string;
//   disabled?: boolean;
// }

// export const SizeSelector: React.FC<SizeSelectorProps> = ({
//   sizes,
//   selectedSize,
//   onSizeChange,
//   className = '',
//   disabled = false,
// }) => {
//   if (!sizes || sizes.length === 0) {
//     return null;
//   }

//   return (
//     <div className={`flex flex-wrap gap-2 ${className}`}>
//       {sizes.map((size) => {
//         const isSelected = selectedSize === size.value;
//         const isDisabled = disabled || !size.isAvailable;

//         return (
//           <button
//             key={size.id}
//             onClick={() => !isDisabled && onSizeChange(size.value)}
//             disabled={isDisabled}
//             className={`
//               px-4 py-2 rounded-md border-2 text-sm font-medium
//               transition-all duration-200 
//               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
//               ${
//                 isSelected
//                   ? 'border-red-600 bg-red-50 text-red-600 shadow-sm'
//                   : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
//               }
//               ${isDisabled && 'opacity-40 cursor-not-allowed hover:border-gray-300 hover:bg-white'}
//             `}
//             aria-pressed={isSelected}
//             aria-label={`Select ${size.label} size`}
//           >
//             {size.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// };