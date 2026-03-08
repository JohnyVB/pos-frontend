import type { Renderable, ToastOptions } from "react-hot-toast";
import type { Product } from "../types/global.types";

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
