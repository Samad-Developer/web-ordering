"use client";

import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { useSignalR } from "@/contexts/signalr-provider";
import { selectSelectedAddress } from "@/store/slices/addressSlice";
import { selectCartItems } from "@/store/slices/cartSlice";
import { useMenu } from "./useMenu";
import { CheckoutFormData } from "@/types/checkout.types";
import { transformCartItemsForAPI } from "@/lib/place-order/orderHelpers";

export interface PlaceOrderResponse {
  order?: unknown; // intentionally untyped

  dataPayload?: {
    Success: boolean;
    Message?: string;
    OrderNumber?: string;
  };

  correlationId?: string;
  connectionId?: string;
  userId?: string;

  responseKey?: "CreateOrderResponse";
  signalRMethodName?: "PlaceOrder";

  restaurantId?: number;
  branchId?: number;
  domainName?: string;
}


export function useOrderSubmission() {
  const { menuData } = useMenu();
  const { connection, isConnected } = useSignalR();
  const cartItems = useAppSelector(selectCartItems);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = useCallback((customerData: CheckoutFormData): Promise<PlaceOrderResponse> => {
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
        const transformedItems = transformCartItemsForAPI(cartItems, menuData);

        // Prepare complete order object TODO : i have to chnage order type and payment mode based on user selection in checkout form
        const orderObject = {
          customerDetails: customerData,
          items: transformedItems,
          branchId: selectedAddress.branchId || 0,
          domain: "rollinnbbq.pk",
          orderType: "Delivery",
          paymentMode: "Cash",
          deliveryCharges: 100,
        };

        // Setup response handler
        const handleOrderResponse = (response: PlaceOrderResponse) => {
          // connection.off("CreateOrderResponse", handleOrderResponse);
          console.log("Received order response:", response);
          setIsSubmitting(false);

          if (response.dataPayload?.Success) {
            resolve(response);
          } else {
            reject(new Error(response.dataPayload?.Message));
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