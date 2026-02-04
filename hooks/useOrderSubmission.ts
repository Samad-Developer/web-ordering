"use client";

import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { useSignalR } from "@/contexts/signalr-provider";
import { selectSelectedAddress } from "@/store/slices/addressSlice";
import { selectCartItems } from "@/store/slices/cartSlice";
import { useMenu } from "./useMenu";
import { CheckoutFormData } from "@/types/checkout.types";
import { transformCartItemsForAPI } from "@/lib/place-order/orderHelpers";

interface OrderResponse {
  success: boolean;
  orderNumber?: string;
  message?: string;
  error?: string;
}

export function useOrderSubmission() {
  const { menuData } = useMenu();
  const { connection, isConnected } = useSignalR();
  const cartItems = useAppSelector(selectCartItems);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = useCallback((customerData: CheckoutFormData): Promise<OrderResponse> => {
      setIsSubmitting(true);

      return new Promise((resolve, reject) => {
        if (!connection || !isConnected) {
          setIsSubmitting(false);
          reject(new Error("SignalR connection not available"));
          return;
        }

        if (!selectedAddress?.branchId) {
          setIsSubmitting(false);
          reject(new Error("Branch ID not found"));
          return;
        }
        console.log("checking cart Items", cartItems)
        const transformedItems = transformCartItemsForAPI(cartItems, menuData);

        // Prepare complete order object
        const orderObject = {
          customerDetails: customerData,
          items: transformedItems,
          branchId: selectedAddress.branchId || 0,
          domain: "rollinnbbq.pk",
        };

        console.log("Submitting order object:", orderObject);

        // Setup response handler
        const handleOrderResponse = (response: OrderResponse) => {
          console.log("Received order response In Hook:", response);

          // connection.off("CreateOrderResponse", handleOrderResponse);
          setIsSubmitting(false);

          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.error || "Order submission failed"));
          }
        };

        // Register handler
        connection.on("CreateOrderResponse", handleOrderResponse);

        // Invoke SignalR method
        connection
          .invoke("PlaceOrder", orderObject, "CreateOrderResponse")
          .catch((err) => {
            connection.off("CreateOrderResponse", handleOrderResponse);
            console.error("SignalR invoke error:", err);
            setIsSubmitting(false);
            reject(err);
          });
      });
    },
    [connection, isConnected, selectedAddress, cartItems, menuData]
  );

  return {
    submitOrder,
    isSubmitting,
  };
}