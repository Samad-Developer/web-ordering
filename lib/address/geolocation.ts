import { GeolocationResult } from '@/types/address.types';
import { OrderModesResponse } from '@/types/address.types';

export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  // TODO: here i have to implement the functionality for reversing like ihave lat and long i need something to send this and return the actual text address to me

  // this is just for example here i will be implement the actual
  try {
    // Example with Google Maps Geocoding API
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
    // );
    // const data = await response.json();
    // return data.results[0]?.formatted_address || 'Address not found';

    return 'Fetched address from coordinates';
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unable to fetch address';
  }
}

/**
 * Find matching city and area from coordinates
 */
export async function findCityAndAreaFromLocation(
  coordinates: { lat: number; lng: number },
  orderModesData: OrderModesResponse
): Promise<{ cityId: string; areaId: number } | null> {
  // TODO: Implement logic to match coordinates with your cities/areas
  // This could involve:
  // 1. Calculating distance from city centers
  // 2. Using Google Maps API to get area name and matching with your data
  // 3. Or letting user manually select if no match found

  return null;
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}