export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  specifications: Record<string, string>;
  tags: string[];
  discount?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'view_product' | 'add_to_cart' | 'filter' | 'search' | 'checkout';
  label: string;
  data?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Session {
  id: string;
  userId: string;
  messages: ChatMessage[];
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}