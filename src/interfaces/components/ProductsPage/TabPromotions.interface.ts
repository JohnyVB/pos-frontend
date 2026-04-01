import type { Pagination, Product } from "../../global.interface";

export interface TabPromotionsProps {
  products: Product[];
  promotions: Promotion[];
  currentPromotionPage: number;
  totalPromotionPages: number;
  totalPromotionsRecords: number;
  getPromotions: (pageLoad: number, limit?: number) => Promise<void>;
}

export interface PromoForm {
  name: string;
  type: "PERCENTAGE" | "MULTIBUY";
  discount_rate: number;
  buy_qty: number;
  pay_qty: number;
  start_date: string;
  end_date: string;
}

export interface Promotion {
  id: number;
  name: string;
  type: string;
  discount_rate: number;
  buy_qty: number;
  pay_qty: number;
  start_date: string;
  end_date: string;
  is_effective: boolean;
  associated_products: Product[];
}

export interface getPromotionsResponse {
  response: "success" | "error";
  promotions?: Promotion[];
  pagination?: Pagination;
  message?: string;
}