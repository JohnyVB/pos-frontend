
export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  vat: number;
  category_id: number;
  active: boolean;
  created_at: string;
  sale_type: "UNIT" | "WEIGHT";
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Terminal {
  id: number;
  name: string;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
