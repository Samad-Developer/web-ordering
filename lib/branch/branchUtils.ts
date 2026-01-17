import { Branch } from '@/types/address.types';

/**
 * Format minutes to human-readable time
 */
export function formatTimeRemaining(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  }

  if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Calculate delivery charges based on cart total
 */
export function calculateDeliveryCharges(
  branch: Branch,
  cartTotal: number
): number {
  if (
    branch.DeliveryChargesWaiveOffLimit > 0 &&
    cartTotal >= branch.DeliveryChargesWaiveOffLimit
  ) {
    return 0; // Free delivery
  }

  return branch.DeliveryCharges;
}

/**
 * Check if order meets minimum requirement
 */
export function meetsMinimumOrder(
  branch: Branch,
  cartTotal: number
): boolean {
  return cartTotal >= branch.MinimumOrder;
}

/**
 * Get amount needed to reach minimum order
 */
export function getAmountToMinimum(
  branch: Branch,
  cartTotal: number
): number {
  const needed = branch.MinimumOrder - cartTotal;
  return needed > 0 ? needed : 0;
}

/**
 * Get amount needed for free delivery
 */
export function getAmountToFreeDelivery(
  branch: Branch,
  cartTotal: number
): number {
  if (branch.DeliveryChargesWaiveOffLimit === 0) {
    return 0; // No free delivery available
  }

  const needed = branch.DeliveryChargesWaiveOffLimit - cartTotal;
  return needed > 0 ? needed : 0;
}

/**
 * Get estimated delivery time range
 */
export function getDeliveryTimeRange(branch: Branch): string {
  const minTime = branch.DeliveryTime - 5;
  const maxTime = branch.DeliveryTime + 5;
  return `${minTime}-${maxTime} minutes`;
}