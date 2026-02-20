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
    <div className=" py-10 px-6">
      <div className="max-w-3xl mx-auto">

        {/* SUCCESS SECTION */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
              <Check
                className="w-14 h-14 text-green-500"
                strokeWidth={2}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Order ID: <span className="font-semibold text-foreground">{orderNumber}</span></p>
            <p className="text-muted-foreground">Your order has been placed successfully.</p>
          </div>
        </div>

        {/* STATUS SECTION */}
        <div>
          <OrderStatusDisplay orderNumber={orderNumber} />
        </div>
      </div>
    </div>
  );
}
