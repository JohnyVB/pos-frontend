import type { Product } from "../../global.interface";


export interface Inventory {
  id: number;
  product_id: number;
  name: string;
  barcode: string;
  quantity: number;
  store_id: string;
  store_name: string;
}

export interface InventoryForm {
  product_id: string;
  quantity: string;
  reference: string;
}
export interface TabInventoryProps {
  inventory: Inventory[];
  setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
  getProductsWithLowStock: () => Promise<void>;
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
  message?: string;
}
