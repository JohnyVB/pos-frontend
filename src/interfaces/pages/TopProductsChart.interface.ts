export interface TopProductsChartProduct {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface GetTopProductsChartResponse {
  response: string;
  message?: string;
  topProducts?: TopProductsChartProduct[];
}

export interface GetTopProductsChartForm {
  store_id: string | null;
  start_date: string | null;
  end_date: string | null;
  limit: number | null;
}
