
export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  vat: number;
  sale_type: "UNIT" | "WEIGHT";
  category_id: number;
  min_stock: number;
  active: boolean;
  store_id: string;
  created_at: string;
  category_name: string;
  store_name: string;
  stock: number;
  quantity?: number;
  cost_price: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  store_id?: string;
  created_at: string;
  store_name?: string;
}

export interface Terminal {
  id: number;
  name: string;
  active: boolean;
  store_id: string;
  store_name?: string;
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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}