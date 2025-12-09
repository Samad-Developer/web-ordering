
import { 
  OrderModesResponse, 
  DeliveryCity, 
  PickupCity, 
  ParsedCity,
  Area,
  Branch
} from '@/types/address.types';

/**
 * Parse API response to get available modes
 */
export function getAvailableModes(data: OrderModesResponse) {
  return {
    delivery: !!data.orderModes.delivery && Object.keys(data.orderModes.delivery).length > 0,
    pickup: !!data.orderModes.pickup && Object.keys(data.orderModes.pickup).length > 0,
  };
}

/**
 * Get all cities with their available modes
 */
export function getAllCities(data: OrderModesResponse): ParsedCity[] {
  const citiesMap = new Map<string, ParsedCity>();

  // Add delivery cities
  if (data.orderModes.delivery) {
    Object.entries(data.orderModes.delivery).forEach(([cityId, cityData]) => {
      citiesMap.set(cityId, {
        id: cityId,
        name: cityData.cityName,
        hasDelivery: true,
        hasPickup: false,
      });
    });
  }

  // Add/Update with pickup cities
  if (data.orderModes.pickup) {
    Object.entries(data.orderModes.pickup).forEach(([cityId, cityData]) => {
      const existing = citiesMap.get(cityId);
      if (existing) {
        existing.hasPickup = true;
      } else {
        citiesMap.set(cityId, {
          id: cityId,
          name: cityData.cityName,
          hasDelivery: false,
          hasPickup: true,
        });
      }
    });
  }

  return Array.from(citiesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get cities for specific order mode
 */
export function getCitiesForMode(
  data: OrderModesResponse, 
  mode: 'delivery' | 'pickup'
): Record<string, DeliveryCity | PickupCity> {
  if (mode === 'delivery') {
    return data.orderModes.delivery || {};
  }
  return data.orderModes.pickup || {};
}

/**
 * Get areas for a city (Delivery mode)
 */
export function getAreasForCity(
  data: OrderModesResponse, 
  cityId: string
): Area[] {
  const deliveryCity = data.orderModes.delivery?.[cityId];
  return deliveryCity?.areas || [];
}

/**
 * Get branches for a city (Pickup mode)
 */
export function getBranchesForCity(
  data: OrderModesResponse, 
  cityId: string
): Branch[] {
  const pickupCity = data.orderModes.pickup?.[cityId];
  return pickupCity?.branches || [];
}

/**
 * Get city name by ID
 */
export function getCityNameById(
  data: OrderModesResponse, 
  cityId: string
): string | null {
  const deliveryCity = data.orderModes.delivery?.[cityId];
  if (deliveryCity) return deliveryCity.cityName;
  
  const pickupCity = data.orderModes.pickup?.[cityId];
  if (pickupCity) return pickupCity.cityName;
  
  return null;
}

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
 * Format business hours
 */
export function formatBusinessHours(startTime: string, endTime: string): string {
  // Input format: "09:00:00"
  // Output format: "9:00 AM - 6:00 PM"
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Check if city exists in both modes
 */
export function cityExistsInMode(
  data: OrderModesResponse,
  cityId: string,
  mode: 'delivery' | 'pickup'
): boolean {
  if (mode === 'delivery') {
    return !!data.orderModes.delivery?.[cityId];
  }
  return !!data.orderModes.pickup?.[cityId];
}