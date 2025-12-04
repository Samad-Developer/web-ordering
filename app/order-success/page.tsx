"use client";

import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { clearCart } from "@/store/slices/cartSlice";
import { Home, ShoppingBag, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerInfo } from "@/components/order-success/CustomerInfo";
import { OrderDetails } from "@/components/order-success/OrderDetails";
import { SuccessAnimation } from "@/components/order-success/SuccessAnimation";


export default function OrderSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [customerInfo, setCustomerInfo] = useState<any>(null);

  // Get order number from URL params
  const orderNumber = searchParams.get("orderNumber") || "ORD-12345";

  const orderData = {
    orderNumber,
    orderDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    customer: {
      title: customerInfo?.title || "",
      fullName: customerInfo?.fullName || "",
      mobileNumber: customerInfo?.mobileNumber || "",
      alternateMobileNumber: customerInfo?.alternateMobileNumber || "",
      emailAddress: customerInfo?.emailAddress || "",
    },
    delivery: {
      orderMode: "delivery" as const,
      deliveryAddress: customerInfo?.deliveryAddress || "",
      nearestLandmark: customerInfo?.nearestLandmark || "",
      deliveryInstructions: customerInfo?.deliveryInstructions || "",
      estimatedTime: "45-60 minutes",
      isGift: customerInfo?.isGift || false,
      recipientName: customerInfo?.recipientName || "",
      recipientNumber: customerInfo?.recipientNumber || "",
      giftingMessage: customerInfo?.giftingMessage || "",
    },
    paymentMethod: customerInfo?.paymentMethod || "Cash on Delivery",
    changeAmount: customerInfo?.changeAmount || 0,
  };

  useEffect(() => {
    const savedData = localStorage.getItem("orderCustomerInfo");
    if (savedData) {
      setCustomerInfo(JSON.parse(savedData));
    }
  }, []);

  // Clear storage + cart and navigate
  const handleNavigation = (path: string) => {
    localStorage.removeItem("orderCustomerInfo");
    dispatch(clearCart());
    router.push(path);
  };

  // Only render if customerInfo is loaded
  if (!customerInfo) return null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <SuccessAnimation
            orderNumber={orderData.orderNumber}
            orderTime={orderData.orderDate}
            estimatedTime={orderData.delivery.estimatedTime}
          />

          <div className="grid grid-cols-1  gap-6">
            <div className="space-y-6">
              <CustomerInfo
                customerData={orderData.customer}
                deliveryData={orderData.delivery}
              />
            </div>

            <div className="space-y-6">
              <OrderDetails paymentMethod={orderData.paymentMethod} />
            </div>
          </div>

          <OrderSummary showPaymentDetails={false} variant="success" />

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleNavigation("/")}
              className="gap-2"
              size="lg"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => handleNavigation("/")}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
            <Button
              onClick={() => handleNavigation("/")}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <Phone className="w-4 h-4" />
              Contact Support
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              If you have any questions, please contact our customer support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
