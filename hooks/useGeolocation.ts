
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setLoadingLocation } from '@/store/slices/addressSlice';
import { getCurrentLocation, reverseGeocode } from '@/lib/address/geolocation';
import { toast } from 'sonner';

export function useGeolocation() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = async () => {
    dispatch(setLoadingLocation(true));
    setError(null);

    try {
      const coordinates = await getCurrentLocation();
      
      if (!coordinates) {
        toast.error(
          'Unable to get your coordinates'
        )
      }

      // const address = await reverseGeocode(coordinates.lat, coordinates.lng);

      dispatch(setLoadingLocation(false));

      return {
        coordinates,
        // address,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      console.log("checking location error", err)
      setError(errorMessage);
      dispatch(setLoadingLocation(false));
      
      toast.error('Location Error', {
        description: errorMessage,
      });
      
      return null;
    }
  };

  return {
    getUserLocation,
    error,
  };
}