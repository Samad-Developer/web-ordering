
export type OrderMode = 'delivery' | 'pickup';

// API Response Types
export interface Area {
  AreaId: number;
  AreaName: string;
}

export interface Branch {
  BranchId: number;
  BranchName: string;
  BranchAddress: string;
  BranchPhoneNumber: string;
  BusinessDayStartTime: string;
  BusinessDayEndTime: string;
}

export interface DeliveryCity {
  cityName: string;
  areas: Area[];
}

export interface PickupCity {
  cityName: string;
  branches: Branch[];
}

export interface OrderModesResponse {
  orderModes: {
    delivery?: Record<string, DeliveryCity>;
    pickup?: Record<string, PickupCity>;
  };
}

// Application State Types
export interface UserAddress {
  orderMode: OrderMode;
  
  // For Delivery
  cityId?: string;
  cityName?: string;
  areaId?: number;
  areaName?: string;
  fullAddress?: string;
  
  // For Pickup
  branchId?: number;
  branchName?: string;
  branchAddress?: string;
  branchPhoneNumber?: string;
  
  // Location
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Metadata
  isCurrentLocation: boolean;
  lastUpdated: number;
}

export interface AvailableModes {
  delivery: boolean;
  pickup: boolean;
}

export interface GeolocationResult {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  cityId?: string;
  areaId?: number;
}

// Parsed City Data (for UI)
export interface ParsedCity {
  id: string;
  name: string;
  hasDelivery: boolean;
  hasPickup: boolean;
}