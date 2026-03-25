"use client";

import { CheckCircle2, XCircle, Truck, ChefHat, Clock } from "lucide-react";
import { useSignalR } from "@/contexts/signalr-provider";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";
import { formatDateTime } from "@/lib/place-order/orderHelpers";

export function OrderStatusTracker({
  initialStatus,
  orderToken,
  initialLogs = []
}: {
  initialStatus: string;
  orderToken: string;
  initialLogs?: Array<{ Id: number; CreatedAt: string }>;
}) {
  const { connection, isConnected } = useSignalR();
  const apiData = useAppSelector(selectAddressApiData);

  const [currentStatus, setCurrentStatus] = useState<string | null>(initialStatus || null);
  console.log("checking current status in tracker", currentStatus);
  const [statusLogs, setStatusLogs] = useState(initialLogs);
  console.log("Initial status logs:", initialLogs);

  const statusMap = apiData?.dataPayload?.Theme?.Settings?.OrderStatuses || {};
  console.log("Status mapping from API:", statusMap);

  useEffect(() => {
    if (!connection || !isConnected) return;

    connection.on("OrderStatusUpdate", (OrderStatus) => {
      if (OrderStatus.orderToken !== orderToken) return;

      const statusName = statusMap[String(OrderStatus.orderStatusId)];

      if (statusName) {
        setCurrentStatus(statusName);
      }

      if (OrderStatus.dataPayload?.OrderStatusLogs) {
        setStatusLogs(OrderStatus.dataPayload.OrderStatusLogs);
      }
    });

    return () => {
      connection.off("OrderStatusUpdate");
    };
  }, [connection, isConnected, orderToken, statusMap]);

  useEffect(() => {
  if (!statusLogs.length && currentStatus) {
    const index = getCurrentStepIndex();
    const filledLogs = TIMELINE_STEPS.slice(0, index + 1).map((step, i) => {
      const statusId = Object.keys(statusMap).find(
        (key) => statusMap[key] === STEP_STATUS_MAP[step.key]
      );
      return {
        Id: Number(statusId),
        CreatedAt: new Date().toISOString() // fallback, or fetch real timestamp if available
      };
    });
    setStatusLogs(filledLogs);
  }
}, []);

  if (!currentStatus) return null;

  const isCancelled = currentStatus === "Cancel";

  const getStepStatus = (stepKey: string) => {
    const statusId = Object.keys(statusMap).find(
      (key) => statusMap[key] === STEP_STATUS_MAP[stepKey]
    );

    if (!statusId) return { completed: false, timestamp: null };

    const logEntry = statusLogs.find((log) => log.Id === Number(statusId));

    return {
      completed: !!logEntry,
      timestamp: logEntry?.CreatedAt || null,
      isCurrent: statusMap[statusId] === currentStatus
    };
  };

  const getCurrentStepIndex = () => {
    if (currentStatus === "Pending") return 0;
    if (currentStatus === "Accept" || currentStatus === "Confirmed") return 1;
    if (currentStatus === "Dispatch") return 2;
    if (currentStatus === "Delivered") return 3;
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isCancelled) {
    return (
      <div className="p-6">
    <div className="flex flex-col items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-6  w-full text-center shadow-sm">
      
      {/* ICON */}
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <XCircle className="h-6 w-6 text-red-600" />
      </div>

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-red-700"> This order has been cancelled</h3>

      {/* TIME (if available) */}
      {statusLogs.length > 0 && (
        <p className="text-xs text-red-500 ">
          Cancelled at: {formatDateTime(statusLogs[statusLogs.length - 1].CreatedAt)}
        </p>
      )}
    </div>
    </div>
    );
  }

  return (
    <div className="px-6 py-5">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
          Order Timeline
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Track your order status in real-time
        </p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative">

          {/* Background line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
            style={{ left: "24px", right: "24px" }}
          />

          {/* Active progress */}
          <div
            className="absolute top-6 h-1 bg-neutral-400 rounded-full transition-all duration-700"
            style={{
              left: "24px",
              width: `calc(${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}% - 24px)`
            }}
          />

          {TIMELINE_STEPS.map((step) => {
            const stepStatus = getStepStatus(step.key);
            const isActive = stepStatus.completed;
            const isCurrentStep = stepStatus.isCurrent;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">

                {/* ICON */}
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 transition-all duration-500
                  ${isActive
                      ? `${STATUS_COLORS[step.key]} border-white dark:border-neutral-900 shadow-lg`
                      : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                    }
                  ${isCurrentStep ? "scale-110" : ""}
                `}
                >

                  {/* UX Animation */}
                  {isCurrentStep && (
                    <>
                      <div className="absolute w-12 h-12 rounded-full bg-white/20 blur-md" />
                      <div className="absolute w-14 h-14 rounded-full border-2 border-current opacity-40 animate-[pulse_2s_ease-in-out_infinite]" />
                    </>
                  )}

                  <div className={`${isActive ? "text-white" : "text-neutral-400"}`}>
                    {isActive ? step.activeIcon : step.inactiveIcon}
                  </div>
                </div>

                {/* LABEL */}
                <p className={`text-xs font-semibold text-center mb-1 ${
                  isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400"
                }`}>
                  {step.label}
                </p>

                {/* TIME */}
                {stepStatus.timestamp && (
                  <p className="text-[10px] text-neutral-500 text-center">
                    {formatDateTime(stepStatus.timestamp)}
                  </p>
                )}

                {/* CURRENT */}
                {isCurrentStep && (
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#FF3489] rounded-full animate-pulse" />
                    <span className="text-[10px] font-semibold text-[#FF3489]">
                      Current
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile stays same */}
      <div className="md:hidden space-y-3">
        {TIMELINE_STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const isActive = stepStatus.completed;
          const isCurrentStep = stepStatus.isCurrent;
          const isLastStep = index === TIMELINE_STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive
                    ? `${STATUS_COLORS[step.key]} border-white shadow-lg`
                    : "bg-neutral-100 border-neutral-300"
                }`}>
                  <div className={`${isActive ? "text-white" : "text-neutral-400"}`}>
                    {isActive ? step.activeIcon : step.inactiveIcon}
                  </div>
                </div>

                {!isLastStep && (
                  <div className={`w-0.5 h-12 mt-1 ${
                    isActive ? "bg-neutral-400" : "bg-neutral-200"
                  }`} />
                )}
              </div>

              <div className="flex-1 pb-3">
                <p className={`text-sm font-semibold ${
                  isActive ? "text-neutral-900" : "text-neutral-400"
                }`}>
                  {step.label}
                </p>

                {stepStatus.timestamp && (
                  <p className="text-[11px] text-neutral-500">
                    {formatDateTime(stepStatus.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// STATUS MAPPING
const STEP_STATUS_MAP: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  dispatch: "Dispatch",
  delivered: "Delivered",
};

// CLEAN UX COLOR SYSTEM
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-red-500",      // waiting / attention
  confirmed: "bg-blue-500",   // accepted / processing started
  dispatch: "bg-orange-500",  // in transit / moving
  delivered: "bg-green-500",  // success / completed
};

// STEPS
const TIMELINE_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    activeIcon: <Clock className="h-5 w-5" />,
    inactiveIcon: <Clock className="h-5 w-5" />,
  },
  {
    key: "confirmed",
    label: "Preparing",
    activeIcon: <ChefHat className="h-5 w-5" />,
    inactiveIcon: <ChefHat className="h-5 w-5" />,
  },
  {
    key: "dispatch",
    label: "On the Way",
    activeIcon: <Truck className="h-5 w-5" />,
    inactiveIcon: <Truck className="h-5 w-5" />,
  },
  {
    key: "delivered",
    label: "Delivered",
    activeIcon: <CheckCircle2 className="h-5 w-5" />,
    inactiveIcon: <CheckCircle2 className="h-5 w-5" />,
  },
];