import React from "react";
import { CartSummary as CartSummaryType } from "@/types/cart.types";
import { formatPrice } from "@/lib/product/productHelper";

interface CartSummaryProps {
  summary: CartSummaryType;
  showDetails?: boolean;
}

export function CartSummary({ summary, showDetails = true }: CartSummaryProps) {


  return (
    <div className="space-y-2">
      {showDetails && (
        <>
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-medium text-gray-900">
              {formatPrice(summary.subtotal)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tax (15%)</span>
            <span className="font-medium text-gray-900">
              {formatPrice(summary.tax)}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium text-gray-900">
              {formatPrice(summary.deliveryFee)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />
        </>
      )}

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Grand Total</span>
        <span className="text-2xl font-bold text-red-700">
          {formatPrice(summary.total)}
        </span>
      </div>

    </div>
  );
}
