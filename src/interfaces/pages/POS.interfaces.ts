export interface ProductByBarcode {
  id: number;
  name: string;
  sale_type: "UNIT" | "WEIGHT";
  barcode: number;
  price: number;
  vat: number;
  quantity: number;
  stock: number;
  total?: number;
  promo_id?: number;
  promo_name?: string;
  promo_type?: string;
  discount_rate?: number;
  buy_qty?: number;
  pay_qty?: number;
  original_price?: number;
}

export interface SearchProductResponse {
  response: "success" | "error";
  product?: ProductByBarcode;
  message?: string;
}

export interface ProductSale {
  product_id: number;
  quantity: number;
  price: number;
  vat: number;
  promo_id?: number;
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
  items: ProductSale[];
}

export interface RegisterSaleResponse {
  response: "success" | "error";
  message?: string;
  data?: RegisterSaleData;
}

export interface RegisterSaleBody {
  payment_method: string;
  amount_received: number;
  reference: string | null;
  cash_box_id: number;
  items: ProductSale[];
}
