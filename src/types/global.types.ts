export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  vat: number;
  categoryId: number;
  active: boolean;
  created_at: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export interface loginResponse {
  response: string;
  token?: string;
  user?: User;
  message?: string;
}

export interface registerResponse {
  response: string;
  user?: User;
  message?: string;
}
