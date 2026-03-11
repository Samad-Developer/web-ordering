"use client";

import { CheckCircle2, XCircle, Bike, ChefHat, Clock, Package } from "lucide-react";
import { useSignalR } from "@/contexts/signalr-provider";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";

export function OrderStatusTracker({
  initialStatus,
  orderToken
}: {
  initialStatus: string;
  orderToken: string;
}) {
  const { connection, isConnected } = useSignalR();
  const apiData = useAppSelector(selectAddressApiData);
  const [currentStatus, setCurrentStatus] = useState<string | null>(initialStatus || null);
  const statusMap = apiData?.dataPayload?.Theme?.Settings?.OrderStatuses || {};

  useEffect(() => {
    if (!connection || !isConnected) return;

    connection.on("OrderStatusUpdate", (OrderStatus) => {
      console.log("order status updated response ", OrderStatus)

      if (OrderStatus.orderNumber !== orderToken) return;

      const statusName = statusMap[String(OrderStatus.orderStatusId)];
      if (statusName) {
        setCurrentStatus(statusName);
      }
    });

    return () => {
      connection.off("OrderStatusUpdate");
    };
  }, [connection, isConnected, orderToken, statusMap]);

  if (!currentStatus) return null;

  const config = STATUS_CONFIG[currentStatus];
  if (!config) return null;

  const isCancelled = currentStatus === 'Cancel';

  const getCurrentStepIndex = () => {
    if (currentStatus === 'Pending') return 0;
    if (currentStatus === 'Accept' || currentStatus === 'Confirmed') return 1;
    if (currentStatus === 'Dispatch') return 2;
    if (currentStatus === 'Delivered') return 3;
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isCancelled) {
    return (
      <div className="px-6 py-5">
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Order Cancelled
            </h3>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
              This order has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Order Status
        </p>
        <span className={`text-[10px] font-bold ${config.textColor} tracking-widest px-2 py-1 ${config.badgeBg} rounded-full`}>
          <span className="sm:hidden">({config.badge})</span> <span className="hidden sm:inline">{config.description}</span>
        </span>
      </div>

      {/* Timeline with inline icons */}
      <div className="flex items-center w-full">
        {TIMELINE_STEPS.map((step, index) => {
          const isActive = currentStepIndex >= index;
          const isCurrentStep = currentStepIndex === index;
          const isLastStep = index === TIMELINE_STEPS.length - 1;

          return (
            <div key={step.key} className={`flex items-center ${!isLastStep ? 'flex-1' : ''}`}>
              {/* Icon */}
              <div className={`relative w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive
                ? 'bg-red-100 dark:bg-red-950/40'
                : 'bg-neutral-100 dark:bg-neutral-800 opacity-50'
                }`}>
                {/* Pulse ring animation for current step */}
                {isCurrentStep && (
                  <div className="absolute  rounded-full bg-red-500 animate-ping opacity-30 w-5 h-5 sm:w-6 sm:h-6" />
                )}

                {isActive ? (
                  <div className={`text-red-600 dark:text-red-500 ${isCurrentStep ? 'animate-pulse' : ''}`}>
                    {step.activeIcon}
                  </div>
                ) : (
                  step.inactiveIcon
                )}
              </div>

              {/* Progress bar - don't show after last step */}
              {!isLastStep && (
                <div className="flex-1 h-2 mx-1 sm:mx-2 rounded-full bg-neutral-200 dark:bg-neutral-700 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-in-out ${isActive ? 'bg-red-500 w-full' : 'w-0'
                      }`}
                  />
                  {/* Animated shimmer effect on current connecting bar */}
                  {isCurrentStep && (
                    <>
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500 animate-timeline-shimmer opacity-60" />                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Timeline steps configuration
const TIMELINE_STEPS = [
  {
    key: 'pending',
    label: 'Pending',
    activeIcon: <Clock className="h-4 w-4" strokeWidth={2.5} />,
    inactiveIcon: <Clock className="h-4 w-4 text-neutral-400 dark:text-neutral-600" strokeWidth={2} />,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    activeIcon: <ChefHat className="h-4 w-4" strokeWidth={2.5} />,
    inactiveIcon: <ChefHat className="h-4 w-4 text-neutral-400 dark:text-neutral-600" strokeWidth={2} />,
  },
  {
    key: 'dispatch',
    label: 'On the Way',
    activeIcon: <Bike className="h-4 w-4" strokeWidth={2.5} />,
    inactiveIcon: <Bike className="h-4 w-4 text-neutral-400 dark:text-neutral-600" strokeWidth={2} />,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    activeIcon: <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />,
    inactiveIcon: <CheckCircle2 className="h-4 w-4 text-neutral-400 dark:text-neutral-600" strokeWidth={2} />,
  },
];

// Status configuration
const STATUS_CONFIG: Record<string, {
  label: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  iconBg: string;
  badgeBg: string;
  textColor: string;
  dotColor: string;
}> = {
  Pending: {
    label: "Order Received",
    description: "Waiting for restaurant confirmation",
    icon: <Clock className="h-6 w-6 text-amber-600" strokeWidth={2} />,
    badge: "Pending",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBg: "bg-amber-100 dark:bg-amber-950/40",
    textColor: "text-amber-700 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  Accept: {
    label: "Being Prepared",
    description: "Restaurant is cooking your meal",
    icon: <ChefHat className="h-6 w-6 text-indigo-600" strokeWidth={2} />,
    badge: "Cooking",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950/40",
    textColor: "text-indigo-700 dark:text-indigo-400",
    dotColor: "bg-indigo-500",
  },
  Confirmed: {
    label: "Order Confirmed",
    description: "Preparing your order now",
    icon: <Package className="h-6 w-6 text-indigo-600" strokeWidth={2} />,
    badge: "Confirmed",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeBg: "bg-red-100 dark:bg-indigo-950/40",
    textColor: "text-red-700 dark:text-indigo-400",
    dotColor: "bg-indigo-500",
  },
  Dispatch: {
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: <Bike className="h-6 w-6 text-purple-600" strokeWidth={2} />,
    badge: "On the Way",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    badgeBg: "bg-purple-100 dark:bg-purple-950/40",
    textColor: "text-purple-700 dark:text-purple-400",
    dotColor: "bg-purple-500",
  },
  Delivered: {
    label: "Delivered",
    description: "Order delivered successfully",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={2} />,
    badge: "Delivered",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/40",
    textColor: "text-emerald-700 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  Cancel: {
    label: "Order Cancelled",
    description: "This order has been cancelled",
    icon: <XCircle className="h-6 w-6 text-red-600" strokeWidth={2} />,
    badge: "Cancelled",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    badgeBg: "bg-red-100 dark:bg-red-950/40",
    textColor: "text-red-700 dark:text-red-400",
    dotColor: "bg-red-500",
  },
};