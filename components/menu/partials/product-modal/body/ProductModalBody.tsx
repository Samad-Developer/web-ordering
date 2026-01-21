import React from "react";
import { ProductInfo } from "./ProductInfo";
import { SizeWrapper } from "./sizes/SizeWrapper";
import { AddonWrapper } from "./addons/AddonWrapper";
import { ProductImage } from "../gallery/ProductImage";
import { FlavorWrapper } from "./flavors/FlavorsWrapper";
import { useProductModal } from "../ProductModalContext";
import { SpecialInstructions } from "./SpecialInstructions";
import { ConfigurationSection } from "./ConfigurationSection";
import { getUniqueFlavors, getUniqueSizes } from "@/lib/product/productHelper";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const ProductModalBody = () => {
  const { currentVariation, product, customization } = useProductModal();
  const { scrollToSection, registerSection } = useScrollToSection();

  const uniqueSizes = getUniqueSizes(product);
  const uniqueFlavors = getUniqueFlavors(product);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Product Info (Price, Description) */}
      <ProductInfo />

      {/* Mobile Image (show on small screens) */}
      <div className="lg:hidden pb-0">
        <ProductImage image={product.Image} alt={product.Name} />
      </div>

      <div className="px-2 sm:px-6 py-2">

        {/* Size Selection */}
        {uniqueSizes.length > 1 && (
          <div ref={registerSection('size')}>
            <ConfigurationSection title="Select Size" required={true}>
              <SizeWrapper />
            </ConfigurationSection>
          </div>
        )}

        {/* Flavor Selection */}
        {uniqueFlavors.length > 1 && (
          <div ref={registerSection('flavor')}>
            <ConfigurationSection title="Select Crust Type" required={true}>
              <FlavorWrapper />
            </ConfigurationSection>
          </div>
        )}

        {/* Item Choices */}
        {currentVariation && currentVariation.ItemChoices.length > 0 && (
          <>
            {currentVariation.ItemChoices.map((choice, index) => (
              <div
                key={choice.Id}
                ref={registerSection(`choice-${index}`)}
              >
                <ConfigurationSection
                  title={choice.Name}
                  required={choice.MaxChoice > 0}
                  subtitle={
                    choice.MaxChoice > 0
                      ? `Select ${choice.MaxChoice} item${choice.MaxChoice > 1 ? "s" : ""}`
                      : undefined
                  }
                >
                  <AddonWrapper
                    choice={choice}
                    onComplete={(isComplete) => {
                      if (isComplete) {
                        // Scroll to next choice or instructions
                        const nextIndex = index + 1;
                        if (nextIndex < currentVariation.ItemChoices.length) {
                          scrollToSection(`choice-${nextIndex}`);
                        } else {
                          scrollToSection('instructions');
                        }
                      }
                    }}
                  />
                </ConfigurationSection>
              </div>
            ))}
          </>
        )}

      </div>

      {/* Special Instructions */}
      <div ref={registerSection('instructions')}>
        <SpecialInstructions />
      </div>
      
    </div>
  );
};

export default ProductModalBody;
