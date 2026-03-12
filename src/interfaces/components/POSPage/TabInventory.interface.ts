import type { Product, ToastFunction } from "../../global.interface";


export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
}

export interface InventoryForm {
  product_id: string;
  quantity: string;
  reference: string;
}

export interface TabInventoryProps {
  products: Product[];
  inventory: Inventory[];
  setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
  toast: ToastFunction;
};

export interface InventoryMovementResponse {
  response: string;
  message: string;
}

export interface productSearchQuery extends Product {
  inventory_quantity: number;
}

export interface ProductSearchResponse {
  response: string;
  product?: productSearchQuery;
  message?: string;
}

export interface LoadInventoryResponse {
  response: string;
  inventory?: Inventory[];
  message?: string;
}
