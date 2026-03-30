import type { Pagination, Product } from "../../global.interface";


export interface Inventory {
  id: number;
  product_id: number;
  name: string;
  barcode: string;
  quantity: number;
  store_id: string;
  store_name: string;
  cost_price: number;
}

export interface InventoryForm {
  product_id: string;
  quantity: string;
  reference: string;
  cost_price: string;
}
export interface TabInventoryProps {
  inventory: Inventory[];
  setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
  getProductsWithLowStock: () => Promise<void>;
  currentInventoryPage: number;
  totalInventoryPages: number;
  totalInventoryRecords: number;
  loadInventory: (page: number, limit?: number) => Promise<void>;
};

export interface InventoryMovementResponse {
  response: string;
  message: string;
}

export interface ProductSearchResponse {
  response: string;
  product?: Product;
  message?: string;
}

export interface LoadInventoryResponse {
  response: string;
  inventory?: Inventory[];
  pagination?: Pagination;
  message?: string;
}
