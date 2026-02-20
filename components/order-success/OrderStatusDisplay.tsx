import { CheckCircle2, XCircle, Bike, Home, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignalR } from "@/contexts/signalr-provider";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";
import { useState } from "react";

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
  }, [connection, isConnected]);

  if (!currentStatus) return null;

  return (
    <div className="rounded-2xl  mt-6  text-center transition-all duration-500">
        {/* Section 2: Order Status - Beautiful Container */}
        <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-3xl p-12 shadow-lg border border-border/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-12 text-foreground tracking-tight">Order Status</h2>
                  {renderStatusUI(currentStatus)}
          </div>
        </div>

    </div>
  );
}

function renderStatusUI(status: string) {
  const STATUS_CONFIG: Record<string,
    {
      label: string;
      description: string;
      icon: React.ReactNode;
      gradient: string;
    }> = {
    Pending: {
      label: "Order Received",
      description: "Waiting for restaurant confirmation.",
      icon: <PackageCheck className="h-14 w-14" />,
      gradient: "from-gray-50 to-gray-100",
    },
    Accept: {
      label: "Order Accepted",
      description: "Restaurant has started preparing your meal.",
      icon: <CheckCircle2 className="h-14 w-14" />,
      gradient: "from-green-50 to-green-100",
    },
    Dispatch: {
      label: "Out for Delivery",
      description: "Your order is on the way.",
      icon: <Bike className="h-14 w-14" />,
      gradient: "from-blue-50 to-blue-100",
    },
    Delivered: {
      label: "Delivered",
      description: "Your order has been delivered.",
      icon: <Home className="h-14 w-14" />,
      gradient: "from-emerald-50 to-emerald-100",
    },
    Cancel: {
      label: "Order Cancelled",
      description: "This order has been cancelled.",
      icon: <XCircle className="h-14 w-14" />,
      gradient: "from-red-50 to-red-100",
    },
  };

  const current = STATUS_CONFIG[status];
  if (!current) return null;

  return (
    <div className="animate-slide-up">
      <div
        className={`rounded-3xl p-4 md:p-16 bg-gradient-to-br ${current.gradient} border border-primary/10 overflow-hidden relative`}
      >
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-full -mr-28 -mt-28 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>

        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center animate-pulse-glow text-primary">
            {current.icon}
          </div>

          {/* Text */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              {current.label}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}