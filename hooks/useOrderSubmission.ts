"use client";

import { useMenu } from "./useMenu";
import useDomain from "./useDomain";
import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { useSignalR } from "@/contexts/signalr-provider";
import { CheckoutFormData } from "@/types/checkout.types";
import { selectCartItems } from "@/store/slices/cartSlice";
import { selectSelectedAddress } from "@/store/slices/addressSlice";
import { getSignalRConnection } from "@/services/signalR/connection";
import { transformCartItemsForAPI } from "@/lib/place-order/orderHelpers";

export interface PlaceOrderResponse {
  order?: unknown;
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
  const domain = useDomain();
  const cartItems = useAppSelector(selectCartItems);
  const { ensureConnected } = useSignalR(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  const submitOrder = useCallback(
    async (customerData: CheckoutFormData): Promise<PlaceOrderResponse> => {
      setIsSubmitting(true);

      try {
        // Ensure connection is active before proceeding
        const isConnected = await ensureConnected();
        
        if (!isConnected) {
          throw new Error("Unable to establish connection. Please check your internet and try again.");
        }

        // Get the CURRENT connection after ensureConnected
        const connection = getSignalRConnection();
        
        if (!connection) {
          throw new Error("Connection not available");
        }

        if (!selectedAddress?.branchId) {
          throw new Error("Branch ID not found");
        }

        const transformedItems = transformCartItemsForAPI(cartItems, menuData);

        const orderObject = {
          customerDetails: customerData,
          items: transformedItems,
          branchId: selectedAddress.branchId || 0,
          areaId: selectedAddress.orderMode === "delivery" ? selectedAddress.areaId : null,
          branchName: selectedAddress.branchName || "",
          domain: domain,
          orderType: selectedAddress.orderMode === "pickup" ? "Pickup" : "Delivery",
          paymentType: customerData.paymentMethod === "CASH" ? "Cash" : "Card",
          deliveryCharges: selectedAddress?.orderMode === "delivery" ? selectedAddress.deliveryCharges : 0,
          status: "Pending",
        };

        console.log("Submitting order:", orderObject);

        // Return promise that resolves when order response is received
        return new Promise((resolve, reject) => {
          const handleOrderResponse = (response: PlaceOrderResponse) => {
            console.log("Received order response:", response);
            
            // Clean up listener
            connection.off("CreateOrderResponse", handleOrderResponse);
            setIsSubmitting(false);

            if (response.dataPayload?.Success) {
              resolve(response);
            } else {
              reject(new Error(response.dataPayload?.Message || "Order failed"));
            }
          };

          // Register response handler
          connection.on("CreateOrderResponse", handleOrderResponse);

          // Invoke SignalR method with timeout
          const invokeTimeout = setTimeout(() => {
            connection.off("CreateOrderResponse", handleOrderResponse);
            setIsSubmitting(false);
            reject(new Error("Order request timed out. Please try again."));
          }, 30000); // 30 second timeout

          connection
            .invoke("PlaceOrder", orderObject, "CreateOrderResponse")
            .then(() => {
              // Clear timeout if invoke succeeds
              clearTimeout(invokeTimeout);
            })
            .catch((err) => {
              clearTimeout(invokeTimeout);
              connection.off("CreateOrderResponse", handleOrderResponse);
              console.error("SignalR invoke error:", err);
              setIsSubmitting(false);
              reject(new Error("Failed to send order. Please try again."));
            });
        });
      } catch (error) {
        setIsSubmitting(false);
        throw error;
      }
    },
    [ensureConnected, selectedAddress, cartItems, menuData, domain]
  );

  return {
    submitOrder,
    isSubmitting,
  };
}