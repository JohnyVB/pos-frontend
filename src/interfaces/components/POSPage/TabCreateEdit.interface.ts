import type { Product, Store } from "../../global.interface";
import type { Category } from "./TabCategories.interface";

export interface createEditForm {
  name: string;
  barcode: string;
  price: string;
  vat: string;
  sale_type: "UNIT" | "WEIGHT";
  category_id: string;
  min_stock: string;
  cost_price: string;
}

export interface TabProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  stores: Store[];
  filterForm: filterForm;
  onChangeFilterForm: (value: string | null, field: keyof filterForm) => void;
  loadProducts: () => void;
  handleClearFilters: () => void;
};

export interface createProductResponse {
  response: "success" | "error";
  product?: Product;
  message?: string;
}

export interface getProductsResponse {
  response: "success" | "error";
  products?: Product[];
  message?: string;
}

export interface updateProductResponse {
  response: "success" | "error";
  product?: Product;
  message?: string;
}

export interface filterForm {
  vat: string | null;
  min_stock: string | null;
  category_id: string | null;
  sale_type: string | null;
  store_id: string | null;
}
