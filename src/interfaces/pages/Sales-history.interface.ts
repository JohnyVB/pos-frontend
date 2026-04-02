import type { ReturnedItem } from "../components/SalesHistory/ReturnModal";
import type { Pagination } from "../global.interface";

export interface Sale {
  record_id: number;
  record_type: "SALE" | "CASH_IN" | "CASH_OUT";
  amount: number | string;
  sale_subtotal: number | string;
  sale_vat_total: number | string;
  sale_discount_total: number | string;
  payment_method: string;
  created_at: string;
  record_status: string;
  total_refunded: number | string;
  reason: string;
  details: SaleItem[] | null;
}

export interface SaleItem {
  item_id: number;
  product_name: string;
  barcode: string;
  quantity: number;
  returned: number;
  price: number;
  subtotal: number;
}

export interface SalesHistoryResponse {
  response: string;
  sales?: Sale[];
  pagination?: Pagination;
  message?: string;
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