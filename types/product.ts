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
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}