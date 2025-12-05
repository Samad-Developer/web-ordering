import { Suspense } from "react";
import OrderSuccessContent from "@/components/order-success/OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
