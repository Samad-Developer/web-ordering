import { Check } from "lucide-react";
import { OrderStatusDisplay } from "./OrderStatusDisplay";

interface SuccessAnimationProps {
  orderNumber: string;
  orderTime: string;
  estimatedTime: string;
}

export function SuccessAnimation({
  orderNumber
}: SuccessAnimationProps) {
  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">

        {/* Success Message - Centered */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center bg-green-500 rounded-full animate-scale-in">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-bold">Thank You!</h1>
            <p className="text-xl text-muted-foreground">
              Your order has been placed successfully
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <span className="font-semibold">#{orderNumber}</span>
          </div>
        </div>

        {/* Live Status */}
        <OrderStatusDisplay orderNumber={orderNumber} />

      </div>
    </div>
  );
}
