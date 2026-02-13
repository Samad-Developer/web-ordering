import { useProductModal } from '../../ProductModalContext';
import { getUniqueSizes } from '@/lib/product/productHelper';
import { SizeOption } from './SizeOption';

export function SizeWrapper({ scrollToSection }: { scrollToSection: (sectionId: string) => void   }) {
  const { product, customization } = useProductModal();
  const sizes = getUniqueSizes(product);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {sizes.sort((a, b) => a.price - b.price).map((size) => (
        <SizeOption
          key={size.id}
          size={size}
          isSelected={customization.selectedSizeId === size.id}
          scrollToSection={scrollToSection}
        />
      ))}
    </div>
  );
}