import React from "react";
import { ProductInfo } from "./ProductInfo";
import { SizeWrapper } from "./sizes/SizeWrapper";
import { AddonWrapper } from "./addons/AddonWrapper";
import { ProductImage } from "../gallery/ProductImage";
import { useProductModal } from "../ProductModalContext";
import { SpecialInstructions } from "./SpecialInstructions";
import { ConfigurationSection } from "./ConfigurationSection";
import { getUniqueFlavors, getUniqueSizes } from "@/lib/product/productHelper";
import { FlavorWrapper } from "./flavors/FlavorsWrapper";

const ProductModalBody = () => {
  const { currentVariation, product, customization } = useProductModal();

  console.log("Customization Data in ProductModalBody:", customization);

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

      <div className="px-6 py-2">
        {/* Size Selection */}
        {uniqueSizes.length > 1 && (
        <ConfigurationSection title="Select Size" required={true}>
          <SizeWrapper />
        </ConfigurationSection>
        )} 

        {/* Flavor Selection */}
        {uniqueFlavors.length > 1 && ( 
        <ConfigurationSection title="Select Crust Type" required={true}>
          <FlavorWrapper />
        </ConfigurationSection>
         )}  

        {/* Item Choices */}
        {currentVariation && currentVariation.ItemChoices.length > 0 && (
          <>
            {currentVariation.ItemChoices.map((choice) => (
              <ConfigurationSection
                key={choice.Id}
                title={choice.Name}
                required={choice.MaxChoice > 0}
                subtitle={`Select ${choice.MaxChoice} item${
                  choice.MaxChoice > 1 ? "s" : ""
                }`}
              >
                <AddonWrapper choice={choice} />
              </ConfigurationSection>
            ))}
          </>
        )}

        {/* Addon Groups
      {currentVariation && currentVariation.AddonGroups?.length > 0 && (
        <>
          {currentVariation.AddonGroups.map((group) => (
            <CustomizationSection
              key={group.Id}
              title={group.Name}
              required={true}
              subtitle={`Select ${group.Quantity} item${group.Quantity > 1 ? 's' : ''}`}
              groupId={group.Id}
            >
              <AddonSelector group={group} />
            </CustomizationSection>
          ))}
        </>
      )} */}
      </div>

      {/* Special Instructions */}
      <SpecialInstructions />
    </div>
  );
};

export default ProductModalBody;
