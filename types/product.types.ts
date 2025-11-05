export interface ProductSize {
  id: string;
  label: string;
  value: string;
  isAvailable?: boolean;
  priceMultiplier?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: ProductSize[];
  basePrice: number;
  originalPrice?: number;
  category?: string;
  stock?: number;
}

export interface CartItem {
  productId: number;
  productName: string;
  variationName: string;
  configuration: any;
  specialInstructions?: string;
  timestamp: number;
  size: string;
  quantity: number;
  price: number;
  image: string;
}



// this types are for the prdocut which we use on product modal

export interface ProductItem {
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
  Variations: ProductVariation[];
}

export interface ProductVariation {
  Id: number;
  Size: VariationAttribute;
  Flavour: VariationAttribute;
  Price: number;
  ItemChoices: ItemChoice[];
}

export interface VariationAttribute {
  Id: number;
  Name: string;
}

export interface ItemChoice {
  Id: number;
  Name: string; // "Burgers", "Fries", "Drinks"
  Quantity: number; // How many items user must select
  MaxChoice: number; // Max options per selection (usually 1)
  ItemOptions: ItemOption[];
}

export interface ItemOption {
  Id: number;
  Name: string;
  Price: number; // Usually 0 for included items, >0 for upgrades
}