// types/menu.types.ts
export interface ItemOption {
  Id: number;
  Name: string;
  Price: number;
}

export interface ItemChoice {
  Id: number;
  Name: string;
  Quantity: number;
  MaxChoice: number;
  ItemOptions: ItemOption[];
}

export interface Variation {
  Id: number;
  Size: {
    Id: number;
    Name: string;
  };
  Flavour: {
    Id: number;
    Name: string;
  };
  Price: number;
  ItemChoices: ItemChoice[];
}

export interface MenuItem {
  Id: number;
  CategoryId: string;
  Code: string;
  Name: string;
  DepartmentName: string;
  Price: number;
  TaxAmount: number;
  Quantity: number;
  Image: string;
  Comment: string;
  IsKot: boolean;
  ItemFOC: boolean;
  Variations: Variation[];
}

export interface MenuCategory {
  Order: number;
  Id: string;
  Name: string;
  Image: string;
  Items: MenuItem[];
}

// for category banner

export interface CategoryInfo {
  Id: string;
  Name: string;
  Image: string;
  Order: number;
}

// Menu Response from API (the actual response structure)
export interface MenuResponse {
  dataPayload: MenuCategory[];
  correlationId: string;
  connectionId: string;
  userId: string;
  restaurantId: number;
  branchId: number;
  branchIdToString: string;
  restaurantIdToString: string;
}
