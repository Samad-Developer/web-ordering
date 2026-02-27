import { CheckCircle2, XCircle, Bike, ChefHat, Clock, Package } from "lucide-react";
import { useSignalR } from "@/contexts/signalr-provider";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";

export function OrderStatusDisplay({ orderNumber }: { orderNumber: string }) {
  const { connection, isConnected } = useSignalR();
  const apiData = useAppSelector(selectAddressApiData);
  const [currentStatus, setCurrentStatus] = useState<string | null>("Pending");
  const statusMap = apiData?.dataPayload?.Theme?.Settings?.OrderStatuses || {};

  useEffect(() => {
    if (!connection || !isConnected) return;

    connection.on("OrderStatusUpdate", (OrderStatus) => {
      if (OrderStatus.orderNumber !== orderNumber) return;

      const statusName = statusMap[String(OrderStatus.orderStatusId)];
      if (statusName) {
        setCurrentStatus(statusName);
      }
    });

    return () => {
      connection.off("OrderStatusUpdate");
    };
  }, [connection, isConnected, orderNumber, statusMap]);

  if (!currentStatus) return null;

  const config = STATUS_CONFIG[currentStatus];
  if (!config) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Compact Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 bg-red-500 rounded-full animate-ping absolute`} />
            <div className={`w-2 h-2 bg-red-500 rounded-full`} />
          </div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Live Status
          </span>
        </div>
        <span className={`text-[10px] font-bold ${config.textColor} uppercase tracking-widest px-2.5 py-1 ${config.badgeBg} rounded-full`}>
          {config.badge}
        </span>
      </div>

      {/* Compact Status Content */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-4">
          {/* Compact Icon */}
          <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {config.icon}
          </div>
          
          {/* Compact Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 leading-tight">
              {config.label}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-snug">
              {config.description}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

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
    icon: <ChefHat className="h-6 w-6 text-blue-600" strokeWidth={2} />,
    badge: "Cooking",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeBg: "bg-blue-100 dark:bg-blue-950/40",
    textColor: "text-blue-700 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  Confirmed: {
    label: "Order Confirmed",
    description: "Preparing your order now",
    icon: <Package className="h-6 w-6 text-indigo-600" strokeWidth={2} />,
    badge: "Confirmed",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950/40",
    textColor: "text-indigo-700 dark:text-indigo-400",
    dotColor: "bg-indigo-500",
  },
  Dispatch: {
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: <Bike className="h-6 w-6 text-purple-600" strokeWidth={2} />,
    badge: "Dispatch",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    badgeBg: "bg-purple-100 dark:bg-purple-950/40",
    textColor: "text-purple-700 dark:text-purple-400",
    dotColor: "bg-purple-500",
  },
  Delivered: {
    label: "Delivered",
    description: "Order delivered successfully",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={2} />,
    badge: "Complete",
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