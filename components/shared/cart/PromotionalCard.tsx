"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/types/menu.types";
import { getImageUrl } from "@/lib/image/imageUtils";
import { DiscountBadge } from "@/components/menu/partials/DiscountBadge";
import { PriceDisplay } from "@/components/menu/partials/product-card/PriceDisplay";
import { calculateDiscount } from "@/lib/discount/discountUtils";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "sonner";
import { openProductModal } from "@/store/slices/productModalSlice";
import { toSlug } from "@/lib/address/slug";

interface PromotionalCardProps {
    item: MenuItem;
}

export function PromotionalCard({ item }: PromotionalCardProps) {

    const dispatch = useDispatch();
    const imageSrc = getImageUrl(item.Image, '/assets/images/products/product.webp');
    const displayDiscount = item.Discount ? item.Discount : null;

    // Check if product can be added directly (single variation, no addons)
    const canAddDirectly = (): boolean => {
        if (item.Variations.length !== 1) return false;
        const variation = item.Variations[0];
        return !variation.ItemChoices || variation.ItemChoices.length === 0;
    };

    // Direct add to cart (simple products)
    const handleDirectAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        const variation = item.Variations[0];
        const priceCalc = calculateDiscount(variation.Price, variation.Discount);

        dispatch(
            addToCart({
                productId: item.Id,
                productName: item.Name,
                productImage:
                    item.Image !== "N/A" ? item.Image : "/placeholder-food.jpg",
                variationId: variation.Id,
                sizeName: variation.Size.Name,
                flavorName: variation.Flavour.Name,
                customization: {
                    selectedSizeId: variation.Size.Id,
                    selectedFlavorId: variation.Flavour.Id,
                    selectedVariationId: variation.Id,
                    selectedAddons: {},
                    quantity: 1,
                    specialInstructions: "",
                },
                priceBreakdown: {
                    basePrice: priceCalc.finalPrice,
                    originalBasePrice: variation.Price,
                    addonsTotal: 0,
                    subtotal: priceCalc.finalPrice,
                    total: priceCalc.finalPrice,
                },
                discount: variation.Discount,
                specialInstructions: "",
            })
        );

        toast.success("Added to cart!", {
            duration: 2000,
        });
    };

    // Open product modal for configuration
    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(openProductModal(item));

        const slug = toSlug(item.Name);

        if (typeof window !== "undefined") {
            window.history.pushState(null, "", `/product/${slug}`);
        }
    };

    // Handle add to cart button click
    const handleAddToCart = (e: React.MouseEvent) => {
        if (canAddDirectly()) {
            handleDirectAddToCart(e);
        } else {
            handleOpenModal(e);
        }
    };

    return (
        <div className="flex-shrink-0 w-[160px] group cursor-pointer">
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">

                {/* Discount Badge */}
                {displayDiscount && (
                    <div className="absolute top-2 left-2 z-10">
                        <DiscountBadge discount={displayDiscount} size="md" />
                    </div>
                )}

                {/* Image Container */}
                <div className="relative h-32 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={item.Name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="160px"
                    />
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                    {/* Item Name */}
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 leading-tight">
                        {item.Name}
                    </h4>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between">
                        <PriceDisplay
                            price={item.Price}
                            discount={displayDiscount}
                            size="sm"
                        />

                        {/* Add Button */}
                        <button
                            onClick={handleAddToCart}
                            className="cursor-pointer bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center gap-2 rounded-xl p-1.5 transition-all duration-200 hover:scale-110 active:scale-95"
                            aria-label={`Add ${item.Name} to cart`}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}