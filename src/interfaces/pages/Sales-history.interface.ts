import type { ReturnedItem } from "../components/SalesHistory/ReturnModal";

export interface Sale {
  sale_id: number;
  total: number;
  sale_subtotal: number;
  sale_vat_total: number;
  payment_method: string;
  created_at: string;
  change_amount: number;
  sale_status: string;
  items: SaleItem[];
}

export interface SaleItem {
  item_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_sale: number;
  vat_rate: number;
  item_subtotal: number;
  barcode: string;
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