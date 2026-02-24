import { CheckCircle2, XCircle, Bike, ChefHat, Clock } from "lucide-react";
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
    <div className="bg-card border rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-center gap-4">

        {/* Live Blinking Indicator */}
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${config.color} animate-ping absolute`} />
          <div className={`w-3 h-3 rounded-full ${config.color}`} />
        </div>

        {/* Status Icon */}
        <div className={`p-3 rounded-full ${config.bgColor}`}>
          {config.icon}
        </div>

        {/* Status Text */}
        <div className="text-left">
          <h3 className="text-xl font-semibold">{config.label}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  Pending: {
    label: "Order Received",
    description: "Waiting for restaurant confirmation",
    icon: <Clock className="h-6 w-6 text-orange-600" />,
    color: "bg-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
  Accept: {
    label: "Preparing Your Order",
    description: "Restaurant is cooking your meal",
    icon: <ChefHat className="h-6 w-6 text-blue-600" />,
    color: "bg-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  Confirmed: {
    label: "Preparing Your Order",
    description: "Restaurant is cooking your meal",
    icon: <ChefHat className="h-6 w-6 text-blue-600" />,
    color: "bg-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  Dispatch: {
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: <Bike className="h-6 w-6 text-purple-600" />,
    color: "bg-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  Delivered: {
    label: "Delivered",
    description: "Enjoy your meal!",
    icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
    color: "bg-green-500",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  Cancel: {
    label: "Order Cancelled",
    description: "This order has been cancelled",
    icon: <XCircle className="h-6 w-6 text-red-600" />,
    color: "bg-red-500",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
};