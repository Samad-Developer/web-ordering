'use client';

import React from 'react';
import { CartItem } from '@/types/cart.types';
import { useAppDispatch } from '@/store/hooks';
import { decrementItem, removeItem } from '@/store/slices/cartSlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Trash2, X } from 'lucide-react';
import { formatPrice } from '@/lib/product/productHelper';
import { getCartItemAddonsText } from '@/lib/cart/cartHelpers';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { normalizeLabel } from '@/lib/cart/cartHelpers';

interface VariationSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName: string;
    variations: CartItem[];
}

export function VariationSelectionModal({
    open,
    onOpenChange,
    productName,
    variations,
}: VariationSelectionModalProps) {
    const dispatch = useAppDispatch();

    const handleDecrement = (item: CartItem) => {
        if (item.customization.quantity > 1) {
            dispatch(decrementItem(item.cartItemId));
        } else {
            dispatch(removeItem(item.cartItemId));
            toast.info('Item removed from cart');

            // Close modal if this was the last variation
            if (variations.length === 1) {
                onOpenChange(false);
            }
        }
    };

    const handleRemove = (item: CartItem) => {
        dispatch(removeItem(item.cartItemId));
        toast.info('Item removed from cart');

        // Close modal if this was the last variation
        if (variations.length === 1) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] p-0">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Select Item to Remove
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                {productName} - {variations.length} variation{variations.length > 1 ? 's' : ''} in cart
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Variations List */}
                <div className="overflow-y-auto max-h-[calc(80vh-120px)] px-6 py-4">
                    <AnimatePresence mode="popLayout">
                        {variations.map((item, index) => (
                            <VariationItem
                                key={item.cartItemId}
                                item={item}
                                index={index}
                                onDecrement={() => handleDecrement(item)}
                                onRemove={() => handleRemove(item)}
                                isLast={index === variations.length - 1}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}



// Individual Variation Item
interface VariationItemProps {
    item: CartItem;
    index: number;
    onDecrement: () => void;
    onRemove: () => void;
    isLast: boolean;
}

function VariationItem({
    item,
    index,
    onDecrement,
    onRemove,
    isLast
}: VariationItemProps) {
    const addons = getCartItemAddonsText(item);
    const imageSrc = "/assets/images/products/product.webp";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={!isLast ? 'mb-4 pb-4 border-b border-gray-100' : 'mb-4'}
        >
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={imageSrc}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    {/* Variation Info */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                {item.productName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-700">
                                    {
                                        normalizeLabel(item.sizeName)
                                    }
                                </span>
                                <span className="text-xs text-gray-700">
                                    {
                                        normalizeLabel(item.flavorName)
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900 text-sm">
                                {formatPrice(item.priceBreakdown.total)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatPrice(item.priceBreakdown.subtotal)} each
                            </p>
                        </div>
                    </div>

                    {/* Addons */}
                    {addons.length > 0 && (
                        <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                                {addons.map((addon, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded"
                                    >
                                        + {addon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Special Instructions */}
                    {item.specialInstructions && (
                        <p className="text-xs text-gray-600 italic mb-2">
                            Note: {item.specialInstructions}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Quantity Display */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-gray-600 font-medium">Qty:</span>
                            <span className="text-sm font-bold text-gray-900">
                                {item.customization.quantity}
                            </span>
                        </div>

                        {/* Delete Button (if quantity > 1) */}
                        {item.customization.quantity > 1 ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDecrement}
                                className="gap-1.5 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                            >
                                <Minus className="w-3.5 h-3.5" />
                                {item.customization.quantity > 1 ? 'Decrease' : 'Remove'}
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRemove}
                                className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}