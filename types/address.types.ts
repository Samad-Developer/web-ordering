
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
  BusinessStartTime: string;
  BusinessEndTime: string;
  MinimumOrder: number;
  IsBranchOpen: boolean;
}


export interface Area {
  AreaId: number;
  AreaName: string;
  BranchId: number;
  DeliveryCharges: number;
  DeliveryTime: number;
  MinimumOrder: number;
  DeliveryChargesWaiveOffLimit: number;
}

export interface CityDelivery {
  CityName: string;
  Areas: Area[];
}

export interface CityPickup {
  CityName: string;
  Tax: number; // Tax percentage (e.g., 16 for 16%)
  Branches: Branch[];
}

// types/theme.types.ts

export interface ThemeColors {
  TOP_BAR_BG_COLOR?: string;
  TOP_BAR_FORE_COLOR?: string;
  CATEGORY_BAR_BG_COLOR?: string;
  CATEGORY_BAR_FORE_COLOR?: string;
  CATEGORY_HOVER_COLOR?: string;
  CATEGORY_ACTIVE_COLOR?: string;
  PRODUCT_BG_COLOR?: string;
  PRODUCT_NAME_FORE_COLOR?: string;
  PRODUCT_DESC_FORE_COLOR?: string;
  PRODUCT_HOVER_COLOR?: string;
  PRODUCT_PRICE_BG_COLOR?: string;
  PRODUCT_PRICE_FORE_COLOR?: string;
  PRODUCT_ADD_BTN_BG_COLOR?: string;
  FOOTER_BG_COLOR?: string;
  FOOTER_FORE_COLOR?: string;
  VIEW_CART_BG_COLOR?: string;
  VIEW_CART_FORE_COLOR?: string;
  PRODUCT_POPUP_BG_COLOR?: string;
  PRODUCT_POPUP_HEADER_BG_COLOR?: string;
  PRODUCT_POPUP_HEADER_FORE_COLOR?: string;
  PRODUCT_POPUP_DESC_FORE_COLOR?: string;
  PRODUCT_POPUP_PRICE_FORE_COLOR?: string;
  PRODUCT_POPUP_ADD_TO_CART_FORE_COLOR?: string;
  PRODUCT_POPUP_ADD_TO_CART_BG_COLOR?: string;
  PRODUCT_POPUP_PLUS_MINUS_BG_COLOR?: string;
  PRODUCT_POPUP_QTY_FORE_COLOR?: string;
  DEAL_POPUP_OPTION_NAME_FORE_COLOR?: string;
  DEAL_POPUP_PRODUCT_NAME_FORE_COLOR?: string;
  PRIMARY_COLOR?: string;
  SECONDARY_COLOR?: string;
  WEB_BG_COLOR?: string;
}

export type HeaderLayoutStyle = 'default' | 'minimal' | 'compact';
export type FooterLayoutStyle = 'default' | 'minimal' | 'expanded';
export type CategoryBarLayoutStyle = 'default' | 'iconic' | 'minimal';
export type ProductCardLayoutStyle = 'default' | 'compact' | 'detailed';

export interface ThemeSettings {
  RESTAURANT_LOGO?: string;
  SPLASH_BANNER?: string;
  WEBSITE_BACKGROUND_IMAGE?: string;
  BANNER_IMAGES?: string[];
  HEADER_LAYOUT_STYLE?: HeaderLayoutStyle;
  FOOTER_LAYOUT_STYLE?: FooterLayoutStyle;
  CATEGORY_BAR_LAYOUT_STYLE?: CategoryBarLayoutStyle;
  PRODUCT_CARD_LAYOUT_STYLE?: ProductCardLayoutStyle;
  SUBMIT_COMPLAINT_BUTTON?: boolean;
  MULTI_LANGUAGE?: boolean;
  USER_LOGIN_ICON?: boolean;
  HAMBURGER_MENU?: boolean;
  ABOUT_US?: boolean;
}

export interface Theme {
  Colors: ThemeColors;
  Settings: ThemeSettings;
}

export interface DeliveryPickupApiResponse {
  domainName: string;
  dataRequestType: string;
  dataPayload: {
    Delivery: Record<string, CityDelivery>;
    Pickup: Record<string, CityPickup>;
    Theme: Theme;
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

  deliveryCharges?: number;
  deliveryChargesWaiveOffLimit?: number;
  deliveryTime?: number | null;

  branchDetails?: {
    BranchId: number;
    BranchName: string;
    BranchAddress: string;
    BranchPhoneNumber: string;
    BusinessStartTime: string;
    BusinessEndTime: string;
    MinimumOrder: number;
    IsBranchOpen: boolean;
  };

  // Metadata
  isCurrentLocation: boolean;
  lastUpdated: number;
}