"use client";

import { Truck, Store } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectSelectedAddress } from "@/store/slices/addressSlice";

export function OrderModeBanner() {
    const selectedAddress = useAppSelector(selectSelectedAddress);
    if (!selectedAddress) return;
    const isDelivery = selectedAddress.orderMode === "delivery";

    return (
        <div
            className={`flex flex-col gap-1 rounded-lg border p-4 mb-6 ${isDelivery
                ? "bg-green-50 border-green-100"
                : "bg-blue-50 border-blue-100"
                }`}
        >

            <div className="flex gap-3 items-center">
                {/* Icon */}
                <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${isDelivery ? "bg-green-100" : "bg-blue-100"
                        }`}
                >
                    {isDelivery ? (
                        <Truck className="w-5 h-5 text-green-700" />
                    ) : (
                        <Store className="w-5 h-5 text-blue-700" />
                    )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDelivery ? "text-green-900" : "text-blue-900"}`}>
                        {isDelivery ? "Delivering to your address" : "Pick up from branch"}
                    </p>
                    <p className={`text-xs mt-0.5 truncate ${isDelivery ? "text-green-700" : "text-blue-700"}`}>
                        {isDelivery ? selectedAddress?.areaName : selectedAddress?.branchName}
                    </p>
                </div>

                {/* Badge */}
                <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${isDelivery
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                        }`}
                >
                    {isDelivery ? "Delivery" : "Pickup"}
                </span>
            </div>
        </div>
    );
}