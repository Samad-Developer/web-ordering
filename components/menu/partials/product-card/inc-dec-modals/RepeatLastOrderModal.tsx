'use client';

import React from 'react';
import { CartItem } from '@/types/cart.types';
import { useAppDispatch } from '@/store/hooks';
import { incrementItem } from '@/store/slices/cartSlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Package, X } from 'lucide-react';
import { formatPrice } from '@/lib/product/productHelper';
import { getCartItemAddonsText, normalizeLabel } from '@/lib/cart/cartHelpers';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface RepeatLastOrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lastOrder: CartItem;
    onChooseAgain: () => void;
}

export function RepeatLastOrderModal({
    open,
    onOpenChange,
    lastOrder,
    onChooseAgain,
}: RepeatLastOrderModalProps) {
    const dispatch = useAppDispatch();
    const addons = getCartItemAddonsText(lastOrder);
    const imageSrc = "/assets/images/products/product.webp";

    const handleRepeat = () => {
        dispatch(incrementItem(lastOrder.cartItemId));
        toast.success('Added to cart!', {
            description: 'Same as your previous order',
            duration: 2000,
        });
        onOpenChange(false);
    };

    const handleChooseAgain = () => {
        onOpenChange(false);
        onChooseAgain();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden" showCloseButton={true}>
                {/* Animated Header Background */}
                <DialogHeader className="relative px-6 py-2 border-b overflow-hidden">
                    <div>
                        <DialogTitle className="text-2xl font-bold">
                            Repeat Previous Customization?
                        </DialogTitle>
                        <DialogDescription className=" mt-1">
                            Would you like to add the same item again?
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Product Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 space-y-4"
                    >
                        {/* Product Info */}
                        <div className="flex gap-4">
                            {/* Image */}
                            <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                                <Image
                                    src={imageSrc}
                                    alt={lastOrder.productName}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                                    {lastOrder.productName}
                                </h3>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs  text-gray-600 px-1 rounded-full font-medium">
                                        {
                                            normalizeLabel(lastOrder.sizeName)
                                        }
                                    </span>
                                    <span className="text-xs text-gray-600 px-1 rounded-full font-medium">
                                        {
                                            normalizeLabel(lastOrder.flavorName)
                                        }
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {formatPrice(lastOrder.priceBreakdown.subtotal)}
                                    </span>
                                    <span className="text-sm text-gray-500">per item</span>
                                </div>
                            </div>
                        </div>

                        {/* Addons */}
                        {addons.length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Add-ons Included
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {addons.map((addon, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-1.5 text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200"
                                            >
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                {addon}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Special Instructions */}
                        {lastOrder.specialInstructions && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Special Instructions
                                    </p>
                                    <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                                        "{lastOrder.specialInstructions}"
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {/* Repeat Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                onClick={handleRepeat}
                                className="rounded-lg cursor-pointer w-full h-14 text-base font-semibold bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Yes, Repeat This Order
                            </Button>
                        </motion.div>

                        {/* Choose Again Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={handleChooseAgain}
                                variant="outline"
                                className="rounded-lg cursor-pointer w-full h-12 text-base font-medium border-2 hover:bg-gray-50"
                            >
                                <Package className="w-5 h-5 mr-2" />
                                No, I'll Choose Again
                            </Button>
                        </motion.div>
                    </div>

                    {/* Info Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className=" text-xs text-center text-gray-500"
                    >
                        Repeating will add one more of the same item to your cart
                    </motion.p>
                </div>
            </DialogContent>
        </Dialog>
    );
}