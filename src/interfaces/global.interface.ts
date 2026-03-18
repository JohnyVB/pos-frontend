
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
  store_id: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  store_id: string;
  created_at: string;
}

export interface Terminal {
  id: number;
  name: string;
  active: boolean;
  store_id: string;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  cif_nif: string;
  legal_name?: string;
  zip_code?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
