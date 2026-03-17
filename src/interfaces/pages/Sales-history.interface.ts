import type { ReturnedItem } from "../components/SalesHistory/ReturnModal";

export interface Sale {
  sale_id: number;
  original_total: number;
  sale_subtotal: number;
  sale_vat_total: number;
  payment_method: string;
  created_at: string;
  change_amount: number;
  sale_status: string;
  total_refunded: number;
  net_total: number;
  items: SaleItem[];
}

export interface SaleItem {
  item_id: number;
  product_id: number;
  product_name: string;
  barcode: string;
  original_quantity: number;
  returned_quantity: number;
  current_quantity: number;
  quantity_to_reintegrate: number;
  price_at_sale: number;
  vat_rate: number;
  original_item_subtotal: number;
  current_item_subtotal: number;
}

export interface SalesHistoryResponse {
  response: string;
  message?: string;
  sales?: Sale[];
}

export interface SaleRefundBody {
  sale_id: number
  session_id: number
  user_id: number
  reason: string
  items: ReturnedItem[]
}

export interface SaleRefundResponse {
  response: "success" | "error"
  message: string
}