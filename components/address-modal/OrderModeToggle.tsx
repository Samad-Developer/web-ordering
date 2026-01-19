'use client';

import React from 'react';
import { OrderMode } from '@/types/address.types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OrderModeToggleProps {
    selectedMode: OrderMode;
    onModeChange: (mode: OrderMode) => void;
    availableDelivery: boolean;
    availablePickup: boolean;
}

export function OrderModeToggle({
    selectedMode,
    onModeChange,
    availableDelivery,
    availablePickup,
}: OrderModeToggleProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 text-center">
                Select your order type
            </h3>

            <div className="relative flex w-full max-w-md mx-auto bg-gray-200 rounded-full p-1">
                {/* Animated Background Slider */}
                <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-red-500"
                    animate={{
                        left: selectedMode === "delivery" ? "4px" : "50%",
    width: "calc(50% - 6px)",
                        borderRadius: selectedMode === "delivery" ? "20px" : "40px",
                        opacity: 1,
                        scale: selectedMode === "delivery" ? 1 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 22,
                        duration: 0.35,
                    }}
                />


                {/* Delivery Button */}
                <button
                    type="button"
                    onClick={() => availableDelivery && onModeChange('delivery')}
                    disabled={!availableDelivery}
                    className={cn(
                        'cursor-pointer relative z-10 flex-1 py-2 px-2 sm:px-3 rounded-full font-semibold text-sm transition-colors',
                        selectedMode === 'delivery'
                            ? 'text-white'
                            : 'text-gray-700 hover:text-gray-900',
                        !availableDelivery && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    DELIVERY
                </button>

                {/* Pickup Button */}
                <button
                    type="button"
                    onClick={() => availablePickup && onModeChange('pickup')}
                    disabled={!availablePickup}
                    className={cn(
                        'cursor-pointer relative z-10 flex-1 py-2 px-3 rounded-full font-semibold text-sm transition-colors',
                        selectedMode === 'pickup'
                            ? 'text-white'
                            : 'text-gray-700 hover:text-gray-900',
                        !availablePickup && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    PICK-UP
                </button>
            </div>
        </div>
    );
}