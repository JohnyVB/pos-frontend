import type { Renderable, ToastOptions } from "react-hot-toast";

export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  vat: number;
  category_id: number;
  active: boolean;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

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

export interface ToastFunction {
  (message: Renderable, options?: ToastOptions): string; // Función base
  success: (message: Renderable, options?: ToastOptions) => string;
  error: (message: Renderable, options?: ToastOptions) => string;
  loading: (message: Renderable, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
}

export interface CartItem extends Product {
  quantity: number;
}
