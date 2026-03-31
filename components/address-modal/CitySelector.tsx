'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ParsedCity } from '@/types/address.types';

interface CitySelectorProps {
    cities: ParsedCity[];
    selectedCityId: string | null;
    onCitySelect: (cityId: string) => void;
    orderMode: 'delivery' | 'pickup';
}

export function CitySelector({
    cities,
    selectedCityId,
    onCitySelect,
    orderMode,
}: CitySelectorProps) {
    const availableCities = cities.filter((city) =>
        orderMode === 'delivery' ? city.hasDelivery : city.hasPickup
    );

    return (
        <div className="space-y-2 w-full">
            <h5 className=" font-semibold text-gray-800 text-center">
                {orderMode === 'delivery'
                    ? 'Select Your Location'
                    : 'Choose Pickup Outlet'}
            </h5>
            <div className="flex flex-wrap justify-center gap-2 px-3 items-center">
                {availableCities.map((city) => (
                    <div 
                        key={city.id} 
                        className="flex flex-col justify-center items-center group cursor-pointer"
                        onClick={() => onCitySelect(city.id)}
                    >
                        {/* Wrapper for Button + Checkmark */}
                        <div className="relative">
                            <button
                                type="button"
                                className={cn(
                                    'w-[70px] h-[70px] rounded-lg border-1 flex items-center justify-center p-[10px] cursor-pointer',
                                    selectedCityId === city.id
                                        ? 'border-red-500 bg-red-100'
                                        : 'border-gray-200 bg-white' 
                                )}
                            >
                                {/* Image Container (50x50) */}
                                <div className="relative w-[50px] h-[50px] flex-shrink-0">
                                    {true ? (
                                        <Image
                                            src={'/assets/images/cities-pics/karachi.svg'}
                                            alt={city.name}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="text-3xl">🏙️</span>
                                    )}
                                </div>
                            </button>

                            {/* Checkmark */}
                            {selectedCityId === city.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white"
                                >
                                    <span className="text-white text-xs font-bold">✓</span>
                                </motion.div>
                            )}
                        </div>

                        <span
                            className={cn(
                                'mt-3 text-sm font-semibold text-center w-full line-clamp-2 transition-colors duration-200',
                                selectedCityId === city.id
                                    ? 'text-red-600'
                                    : 'text-gray-700 group-hover:text-red-500'
                            )}
                        >
                            {city.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}