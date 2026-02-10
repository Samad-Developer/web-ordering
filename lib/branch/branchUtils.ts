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

