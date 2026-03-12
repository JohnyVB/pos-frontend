export interface ProductByBarcode {
  id: number;
  name: string;
  barcode: number;
  price: number;
  vat: number;
  quantity: number;
  stock: number;
}

export interface SearchProductResponse {
  response: "success" | "error";
  product?: ProductByBarcode;
  message?: string;
}