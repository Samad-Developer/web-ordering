import React from "react";
import { useProductModal } from "../../ProductModalContext";
import { getAvailableFlavorsForSize } from "@/lib/product/productHelper";
import { FlavorOption } from "./FlavorOption";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";


export function FlavorWrapper() {
  const { product, customization } = useProductModal();


  // Can't select flavor without size
  if (!customization.selectedSizeId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a size first
      </div>
    );
  }

  // Get available flavors for selected size ONLY
  const availableFlavors = getAvailableFlavorsForSize(
    product,
    customization.selectedSizeId
  );

  // If only one flavor, it's auto-selected (don't show selector)
  if (availableFlavors.length === 1) {
    const flavor = availableFlavors[0];

    return (
      <div
        className={cn(
          "relative w-full p-4 rounded-lg border-2 text-left transition-all",
          "border-red-500 bg-red-50" // ✅ same as selected style
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 font-medium text-red-700">{flavor.name}</div>

          <div className="flex-shrink-0 ml-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple flavors - show options
  return (
    <div className="grid grid-cols-1 gap-3">
      {availableFlavors.map((flavor) => (
        <FlavorOption
          key={flavor.id}
          flavor={flavor}
          isSelected={customization.selectedFlavorId === flavor.id}
        />
      ))}
    </div>
  );
}
