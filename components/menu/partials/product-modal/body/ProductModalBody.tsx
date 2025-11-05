import React from 'react'
import { ProductInfo } from './ProductInfo'
import { ProductImage } from '../gallery/ProductImage'
import { ConfigurationSection } from './ConfigurationSection'
import { SizeWrapper } from './sizes/SizeWrapper'
import { AddonWrapper } from './addons/AddonWrapper'
import { SpecialInstructions } from './SpecialInstructions'
import { useProductModal } from '../ProductModalContext'

const ProductModalBody = () => {
      const { currentVariation, product } = useProductModal();

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Product Info (Price, Description) */}
            <ProductInfo />

            {/* Mobile Image (show on small screens) */}
            <div className="lg:hidden pb-0">
                <ProductImage
                    image={product.Image}
                    alt={product.Name}
                />
            </div>

            <div className="px-6 py-2">
                {/* Variation Selector (Size + Flavor) */}
                {/* {currentProduct.Variations.length > 1 && ( */}
                <ConfigurationSection
                    title="Select Size & Flavor"
                    required={true}
                >
                    <SizeWrapper />
                </ConfigurationSection>
                {/* )} */}

                {/* Item Choices */}
                {currentVariation && currentVariation.ItemChoices.length > 0 && (
                    <>
                        {currentVariation.ItemChoices.map((choice) => (
                            <ConfigurationSection
                                key={choice.Id}
                                title={choice.Name}
                                required={true}
                                subtitle={`Select ${choice.Quantity} item${choice.Quantity > 1 ? 's' : ''}`}
                            >
                                <AddonWrapper choice={choice} />
                            </ConfigurationSection>
                        ))}
                    </>
                )}

            </div>

            {/* Special Instructions */}
            <SpecialInstructions />
        </div>
    )
}

export default ProductModalBody