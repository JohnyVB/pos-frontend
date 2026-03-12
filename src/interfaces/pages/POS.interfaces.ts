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

export interface RegisterSaleData {
  sale_id: number;
  total: number;
  vat_total: number;
  sub_total: number;
  payment_method: string;
  amount_received: number;
  change_amount: number;
  cash_box_id: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
    vat: number;
  }[];
}

export interface RegisterSaleResponse {
  response: "success" | "error";
  message?: string;
  data?: RegisterSaleData;
}

export interface RegisterSaleBody {
  payment_method: string;
  amount_received: number;
  cash_box_id: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
    vat: number;
  }[];
}
