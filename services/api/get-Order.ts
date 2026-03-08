import { OrderDetails } from "@/types/getOrder.types";
import { transformOrderData } from "@/lib/place-order/orderHelpers";

export async function fetchOrderDetails(orderToken: string): Promise<OrderDetails> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/myorder?orderNumber=${orderToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 },
    });


    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('ORDER_NOT_FOUND');
      }
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    const response = await res.json();
    const apiData = Array.isArray(response) ? response[0] : response;

    if (!apiData) {
      console.error('❌ No order data in response');
    }
    // Transform to match UI interface
    const orderDetails = transformOrderData(apiData);
    return orderDetails;
    
  } catch (error) {
    console.error('💥 Error fetching order:', error);
    throw error;
  }
}