export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  vat: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
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
