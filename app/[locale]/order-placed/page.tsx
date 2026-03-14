import { notFound } from 'next/navigation';
import { OrderStatusTracker } from '@/components/order-success/OrderStatusTracker';
import { PartyPopper, Check } from 'lucide-react';
import { OrderSuccessPageProps } from '@/types/getOrder.types';
import { Logo } from '@/components/shared/headers/partials/Logo';
import { fetchOrderDetails } from '@/services/api/get-Order';
import Link from 'next/link';
import { formatDateTime } from '@/lib/place-order/orderHelpers';

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = resolvedSearchParams.orderNumber;

  if (!orderNumber) {
    notFound();
  }

  try {
    const order = await fetchOrderDetails(orderNumber);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 ">
          {/* Logo */}
          <div className="w-full flex items-center justify-center">
            <Logo />
          </div>

          {/* Success Header */}
          <div className="relative rounded-xl mb-6">
            <div className="relative text-center bg-[#00c853] text-white px-2 sm:px-20 pt-6 sm:pt-14 pb-16 sm:pb-24 rounded-xl">
              <div className="absolute top-3 left-6">
                <PartyPopper className="w-8 h-8 text-white/80 rotate-[-15deg]" />
              </div>
              <div className="absolute top-3 right-6">
                <PartyPopper className="w-8 h-8 text-white/80 rotate-[15deg] scale-x-[-1]" />
              </div>

              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Woohoo! Order Placed!
              </h1>
              <p className="text-white/90 text-sm mt-1">
                Sit tight, we&apos;ll keep you updated
              </p>

              <div className='bg-white rounded-xl absolute -bottom-12 sm:-bottom-10 shadow left-1/2 -translate-x-1/2 border border-gray-200 w-[calc(100%-2rem)] sm:w-[calc(100%-10rem)]'>               {/* Order Status Tracker */}
                <OrderStatusTracker
                  initialStatus={order.status}
                  orderToken={order.orderToken}
                />

              </div>
            </div>

            {/* Order Number & Status */}
            <div className="rounded-xl mt-6 p-6">
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-gray-900 font-medium">{order.customerName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-gray-900 font-medium">{order.customerPhone}</p>
              </div>

              {order.customerAltPhone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alternate Phone</p>
                  <p className="text-gray-900 font-medium">{order.customerAltPhone}</p>
                </div>
              )}

              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900 font-medium">{order.customerEmail}</p>
                </div>
              )}


              {order.isGift && (
                <div className="md:col-span-2 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Gift Details</p>

                  {order.recipientName && (
                    <p className="text-sm text-gray-600">
                      Recipient: <span className="text-gray-900">{order.recipientName}</span>
                    </p>
                  )}

                  {order.recipientNumber && (
                    <p className="text-sm text-gray-600">
                      Recipient Phone:{" "}
                      <span className="text-gray-900">{order.recipientNumber}</span>
                    </p>
                  )}

                  {order.giftingMessage && (
                    <p className="text-sm text-gray-600 mt-1">
                      Message:{" "}
                      <span className="text-gray-900">{order.giftingMessage}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Details - Pickup/Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch Name */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Branch</p>
                <p className="text-gray-900 font-medium">{order.branchName}</p>
              </div>

              {/* Order Type */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Type</p>
                <p className="text-gray-900 font-medium capitalize">{order.orderType}</p>
              </div>

              {/* Order Date & Time */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date & Time</p>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>

              {/* Delivery Address - Only show for delivery orders */}
              {order.orderType.toLowerCase() === 'delivery' && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-gray-900 font-medium">{order.deliveryAddress}</p>

                  {order.nearestLandmark && (
                    <p className="text-sm text-gray-500 mt-1">
                      Landmark: {order.nearestLandmark}
                    </p>
                  )}
 
                  {order.deliveryInstructions && (
                    <p className="text-sm text-gray-500 mt-1">
                      Note: {order.deliveryInstructions}
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>


          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="pb-2 border-b last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className=" text-gray-700 flex items-center justify-start">
                        {item.quantity > 1 && (
                          <span className="ml-2 text-sm font-normal text-gray-600">
                            {item.quantity} x&nbsp;
                          </span>
                        )}
                        {item.name}
                        {item.size && (
                          <span className="ml-2 text-sm font-normal text-gray-600">
                            ({item.size})
                          </span>
                        )}
                      </h3>

                      {/* Addons/Choices */}
                      {item.addons.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1">
                          {item.addons.map((addon, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-500">
                                <span className="text-gray-400">+ </span>
                                {addon.name}
                                {addon.quantity > 1 && ` x${addon.quantity}`}
                              </span>
                              {addon.price > 0 && (
                                <span className="text-gray-600">
                                  Rs. {(addon.price * addon.quantity)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-medium font-semibold text-gray-900">
                        Rs. {item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  Rs. {order.subtotal.toFixed(2)}
                </span>
              </div>

              {/* Tax */}
              {order.tax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax ({order.gstPercentage}%)</span>
                  <span className="text-gray-900 font-medium">
                    Rs. {order.tax.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Discount - Show even if 0 for future use */}
              {
                order.totalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <span className={`font-medium ${order.totalDiscount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {order.totalDiscount > 0 ? '- ' : ''}Rs. {order.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )
              }

              {/* Delivery Charges */}
              {
                order.deliveryCharges > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-gray-900 font-medium">
                      {order.deliveryCharges === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `Rs. ${order.deliveryCharges.toFixed(2)}`
                      )}
                    </span>
                  </div>
                )
              }

              {/* Grand Total */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    Rs. {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/en"
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center font-medium"
            >
              {/* icon for place new order lucide react icon*/}
              Place New Order

            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in OrderSuccessPage:', error);

    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      notFound();
    }

    // Error state
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Order
          </h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while fetching your order details.
          </p>
          <Link
            href="/en"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
}

// SEO Metadata
export async function generateMetadata({
  searchParams,
}: OrderSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = resolvedSearchParams.orderNumber;

  return {
    title: orderNumber
      ? `Order ${orderNumber} - Order Confirmation`
      : 'Order Confirmation',
    description: 'Your order has been confirmed successfully',
    robots: 'noindex, nofollow',
  };
}