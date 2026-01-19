
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




export type OrderMode = 'delivery' | 'pickup';

export interface Branch {
  BranchId: number;
  BranchName: string;
  BranchAddress: string;
  BranchPhoneNumber: string;
  BusinessStartTime: string; // "11:00 AM"
  BusinessEndTime: string;   // "3:00 AM"
  DeliveryCharges: number;
  DeliveryChargesWaiveOffLimit: number; // Waive off if order >= this amount
  DeliveryTime: number; // in minutes
  MinimumOrder: number;
  IsBranchOpen: boolean;
}

// Add to Area interface (assuming areas also have branch details)
export interface Area {
  AreaId: number;
  AreaName: string;
  BranchId: number; // If area is linked to a branch
  DeliveryCharges?: number;
  DeliveryTime?: number;
  MinimumOrder?: number;
}

export interface CityDelivery {
  CityName: string;
  Areas: Area[];
}

export interface CityPickup {
  CityName: string;
  Branches: Branch[];
}

export interface DeliveryPickupApiResponse {
  domainName: string;
  dataRequestType: string;
  dataPayload: {
    Delivery: Record<string, CityDelivery>;
    Pickup: Record<string, CityPickup>;
  };
  correlationId: string;
  connectionId: string;
  userId: string;
  responseKey: string;
  restaurantId: number;
  branchId: number;
}


export interface UserSelectedAddress {
  orderMode: OrderMode;
  cityId: string;
  cityName: string;
  
  // Delivery fields
  areaId?: number;
  areaName?: string;
  
  // Pickup fields (branch info)
  branchId?: number;
  branchName?: string;
  branchAddress?: string;
  branchPhoneNumber?: string;
  
  branchDetails?: {
    BranchId: number;
    BranchName: string;
    BranchAddress: string;
    BranchPhoneNumber: string;
    BusinessStartTime: string;
    BusinessEndTime: string;
    DeliveryCharges: number;
    DeliveryChargesWaiveOffLimit: number;
    DeliveryTime: number;
    MinimumOrder: number;
    IsBranchOpen: boolean;
  };
  
  // Metadata
  isCurrentLocation: boolean;
  lastUpdated: number;
}