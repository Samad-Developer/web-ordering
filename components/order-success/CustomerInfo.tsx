import React from "react";
import {
  CircleUserRound,
  Phone,
  Mail,
  MapPinHouse,
  MessageSquare,
  Gift,
  Landmark,
} from "lucide-react";

interface CombinedInfoProps {
  customerData: {
    title: string;
    fullName: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    emailAddress?: string;
  };
  deliveryData: {
    orderMode: "delivery" | "pickup";
    deliveryAddress?: string;
    nearestLandmark?: string;
    deliveryInstructions?: string;
    estimatedTime: string;
    isGift?: boolean;
    recipientName: string;
    recipientNumber: string;
    giftingMessage?: string;
  };
}

export function CustomerInfo({
  customerData,
  deliveryData,
}: CombinedInfoProps) {
  return (
    <div className="border-2 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-1 mb-4 bg-gray-200 p-3 rounded-t-lg ">
        <div className="flex items-center justify-center w-10 h-10 rounded-full">
          <CircleUserRound className="w-7 h-7 text-gray-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
          Customer Information
        </h2>
      </div>

      <div className="p-6 space-y-3">
        {/* CUSTOMER INFORMATION */}
        <div className="relative">
          {/* Info Rows – responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoRow
              label="Name"
              value={`${customerData.title}. ${customerData.fullName}`}
              icon={<CircleUserRound className="w-4 h-4" />}
            />

            <InfoRow
              icon={<Phone className="w-4 h-4" />}
              label="Mobile Number"
              value={customerData.mobileNumber}
            />

            {customerData.alternateMobileNumber && (
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Alternate Number"
                value={customerData.alternateMobileNumber}
              />
            )}

            {customerData.emailAddress && (
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={customerData.emailAddress}
              />
            )}
          </div>
        </div>

        {/* DELIVERY INFORMATION */}
        <div>
          {/* DELIVERY GRID */}
          {deliveryData.orderMode === "delivery" &&
            deliveryData.deliveryAddress && (
              <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Address */}
                  <InfoRow
                    icon={<MapPinHouse className="w-4 h-4" />}
                    label="Delivery Address"
                    value={deliveryData.deliveryAddress}
                  />

                  {/* Nearest Landmark */}
                  {deliveryData.nearestLandmark && (
                    <InfoRow
                      icon={<Landmark className="w-4 h-4" />}
                      label="Nearest Landmark"
                      value={deliveryData.nearestLandmark}
                    />
                  )}

                  {/* Special Instructions */}
                  {deliveryData.deliveryInstructions && (
                    <InfoRow
                      icon={<MessageSquare className="w-4 h-4 text-gray-400" />}
                      label="Special Instructions"
                      value={deliveryData.deliveryInstructions}
                    />
                  )}
                </div>

                {/* Gift Section */}
                {deliveryData.isGift && (
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 space-y-2 mt-5">
                    <div className="flex items-center gap-2 text-pink-600 font-medium">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">Gift Order</span>
                    </div>

                    <div className="space-y-1 pl-6">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Recipient:</span>{" "}
                        {deliveryData.recipientName}
                      </p>

                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Contact:</span>{" "}
                        {deliveryData.recipientNumber}
                      </p>

                      {deliveryData.giftingMessage && (
                        <p className="text-xs text-gray-600 italic">
                          {`"${deliveryData.giftingMessage}"`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200/40 last:border-none">
      {icon && (
        <div className="mt-1 text-gray-500 bg-gray-100/60 rounded-full p-2 border border-gray-200 shadow-sm">
          {icon}
        </div>
      )}

      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
