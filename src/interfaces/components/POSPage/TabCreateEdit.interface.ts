import type { Product } from "../../global.interface";
import type { Category } from "./TabCategories.interface";

export interface createEditForm {
  name: string;
  barcode: string;
  price: string;
  vat: string;
  sale_type: "UNIT" | "WEIGHT";
  category_id: string;
  min_stock: string;
}

export interface TabProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
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
