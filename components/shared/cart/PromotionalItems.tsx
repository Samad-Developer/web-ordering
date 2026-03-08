"use client";

import { useMemo } from "react";
import { PromotionalCard } from "./PromotionalCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useMenu } from "@/hooks/useMenu"
import { getPromotionalItems } from "@/lib/cart/cartHelpers";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { Flame } from "lucide-react";

export function PromotionalItems() {
    const { menuData } = useMenu();
    const cartItems = useAppSelector(selectCartItems);

    // Extract promotional items and filter out those already in cart
    const promotionalItems = useMemo(() => {
        if (!menuData) return [];

        const allPromotionalItems = getPromotionalItems(menuData);

        // Get set of product IDs that are in cart
        const cartProductIds = new Set(
            cartItems.map(item => item.productId)
        );

        // Filter out items that are already in cart
        return allPromotionalItems.filter(
            item => !cartProductIds.has(item.Id)
        );
    }, [cartItems]);

    // Don't render if no promotional items
    if (!menuData || promotionalItems.length === 0) return null;

    return (
        <>
            {/* Header with Navigation */}
            <div className="flex items-center gap-2 mb-4">
                <div className="rounded-xl p-2 bg-red-50">
                    <Flame className="text-red-500" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Featured Items
                    </h3>
                    <p className="text-sm text-gray-500">
                        Handpicked items we recommend
                    </p>
                </div>
            </div>

            {/* Carousel */}
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-3">
                    {promotionalItems.map((item) => (
                        <CarouselItem key={item.Id} className="pl-3 basis-[170px]">
                            <PromotionalCard item={item} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                <div className="absolute -top-[52px] right-0 flex gap-1">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </>
    );
}