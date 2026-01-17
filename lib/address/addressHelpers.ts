
import {
  Area,
  Branch,
  DeliveryPickupApiResponse,
  ParsedCity
} from '@/types/address.types';

/**
 * Parse branch address (remove HTML tags)
 */
export function parseBranchAddress(address: string): {
  mainAddress: string;
  phoneNumber: string | null;
} {
  // Remove </BR> tags
  const cleaned = address.replace(/<\/?BR\s*\/?>/gi, '\n');

  // Extract phone number if present
  const phoneMatch = cleaned.match(/Call:\s*([\d-]+)/i);
  const phoneNumber = phoneMatch ? phoneMatch[1] : null;

  // Get main address (before "Call:")
  const mainAddress = cleaned.split(/Call:/i)[0].trim();

  return { mainAddress, phoneNumber };
}

/**
 * Check if city exists in both modes
 */
export function cityExistsInMode(
  data: DeliveryPickupApiResponse,
  cityId: string,
  mode: 'delivery' | 'pickup'
): boolean {
  if (mode === 'delivery') {
    return !!data.dataPayload.Delivery?.[cityId];
  }
  return !!data.dataPayload.Pickup?.[cityId];
}

export function getAllCities(data: DeliveryPickupApiResponse): ParsedCity[] {
  const citiesMap = new Map<string, ParsedCity>();

  // Add delivery cities
  if (data.dataPayload.Delivery) {
    Object.entries(data.dataPayload.Delivery).forEach(([cityId, cityData]) => {
      citiesMap.set(cityId, {
        id: cityId,
        name: cityData.CityName,
        hasDelivery: true,
        hasPickup: false,
      });
    });
  }

  // Add/Update with pickup cities
  if (data.dataPayload.Pickup) {
    Object.entries(data.dataPayload.Pickup).forEach(([cityId, cityData]) => {
      const existing = citiesMap.get(cityId);
      if (existing) {
        existing.hasPickup = true;
      } else {
        citiesMap.set(cityId, {
          id: cityId,
          name: cityData.CityName,
          hasDelivery: false,
          hasPickup: true,
        });
      }
    });
  }

  return Array.from(citiesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAreasForCity(
  data: DeliveryPickupApiResponse,
  cityId: string
): Area[] {
  return data.dataPayload.Delivery[cityId]?.Areas || [];
}

export function getBranchesForCity(
  data: DeliveryPickupApiResponse,
  cityId: string
): Branch[] {
  return data.dataPayload.Pickup[cityId]?.Branches || [];
}

export function getCityNameById(
  data: DeliveryPickupApiResponse,
  cityId: string
): string | null {
  return (
    data.dataPayload.Delivery[cityId]?.CityName ||
    data.dataPayload.Pickup[cityId]?.CityName ||
    null
  );
}

const BRANCH_ID_KEY = 'selected_branch_id';

/**
 * Save branch ID to localStorage
 */
export function saveBranchId(branchId: number): void {
  try {
    localStorage.setItem(BRANCH_ID_KEY, branchId.toString());
  } catch (error) {
    console.error('Failed to save branch ID:', error);
  }
}

/**
 * Load branch ID from localStorage
 */
export function loadBranchId(): number {
  try {
    const saved = localStorage.getItem(BRANCH_ID_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch (error) {
    console.error('Failed to load branch ID:', error);
    return 0;
  }
}

/**
 * Check if user has selected a branch before
 */
export function hasSelectedBranch(): boolean {
  return loadBranchId() !== 0;
}

/**
 * Clear saved branch ID
 */
export function clearBranchId(): void {
  try {
    localStorage.removeItem(BRANCH_ID_KEY);
  } catch (error) {
    console.error('Failed to clear branch ID:', error);
  }
}