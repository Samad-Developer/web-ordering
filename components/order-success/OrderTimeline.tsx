import { CheckCircle2, ChefHat, Bike, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  estimatedDelivery: string;
}

const steps = [
  { icon: CheckCircle2, label: "Order Confirmed", time: "7:45 PM", completed: true, active: false },
  { icon: ChefHat, label: "Preparing", time: "~15 min", completed: false, active: true },
  { icon: Bike, label: "On the Way", time: "~20 min", completed: false, active: false },
  { icon: Home, label: "Delivered", time: "Est. 8:30 PM", completed: false, active: false },
];

export function OrderTimeline({ estimatedDelivery }: OrderTimelineProps) {
  return (
    <div className="rounded-2xl bg-green-50 border border-green-200 shadow-sm p-6 mt-5 w-full">

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-green-900">Order Status</h3>
        <span className="text-sm text-green-800">
          Estimated delivery: <span className="font-medium text-green-900">{estimatedDelivery}</span>
        </span>
      </div>

      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-6 h-1 bg-green-200 md:left-[calc(12.5%-4px)] md:right-[calc(12.5%-4px)]">
          {/* Completed Progress */}
          <div className="h-full w-[12.5%] bg-green-600 transition-all duration-500" />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step.completed
                    ? "border-green-600 bg-green-600 text-white"
                    : step.active
                      ? "border-green-600 bg-green-100 text-green-800 animate-pulse"
                      : "border-green-300 bg-green-50 text-green-600",
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.completed || step.active ? "text-green-900" : "text-green-800",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-green-700">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
