
import {
  Area,
  Branch,
  DeliveryPickupApiResponse,
  ParsedCity,
  UserSelectedAddress
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


const USER_ADDRESS_KEY = 'user_selected_address';

/**
 * Save complete user-selected address with branch details
 */
export function saveUserAddress(address: UserSelectedAddress): void {
  try {
    localStorage.setItem(USER_ADDRESS_KEY, JSON.stringify(address));
    window.dispatchEvent(new Event('address-storage-change'));
  } catch (error) {
    console.error('Failed to save user address:', error);
  }
}

/**
 * Load saved user-selected address
 */
export function loadUserAddress(): UserSelectedAddress | null {
  try {
    const saved = localStorage.getItem(USER_ADDRESS_KEY);
    return saved ? (JSON.parse(saved) as UserSelectedAddress) : null;
  } catch (error) {
    console.error('Failed to load user address:', error);
    return null;
  }
}

/**
 * Check if address exists
 */
export function hasUserAddress(): boolean {
  try {
    return !!localStorage.getItem(USER_ADDRESS_KEY);
  } catch {
    return false;
  }
}

/**
 * Clear saved address
 */
export function clearUserAddress(): void {
  try {
    localStorage.removeItem(USER_ADDRESS_KEY);
    window.dispatchEvent(new Event('address-storage-change'));
  } catch (error) {
    console.error('Failed to clear user address:', error);
  }
}

export function getSavedBranchId(): number {
  try {
    const address = loadUserAddress();
    return address?.branchId || 0;
  } catch {
    return 0;
  }
}