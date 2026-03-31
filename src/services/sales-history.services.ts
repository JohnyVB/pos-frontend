import API from "../config/api.config";
import type { SaleRefundBody, SaleRefundResponse, SalesHistoryResponse } from "../interfaces/pages/Sales-history.interface";

export const onGetSalesBySessionId = async (session_id: number, page: number = 1, limit: number = 10): Promise<SalesHistoryResponse> => {
  try {
    const { data } = await API.get(`/sales/${session_id}`, { params: { page, limit } });
    return data;
  } catch (error) {
    console.log("Error en getSalesBySessionId", error);
    return { response: "error", message: "Error al obtener las ventas" };
  }
}

export const onSaleRefund = async (body: SaleRefundBody, store_id: string): Promise<SaleRefundResponse> => {
  try {
    const { data } = await API.post(`/sales/refund/${store_id}`, body);
    return data;
  } catch (error) {
    console.log("Error en returnSale", error);
    return { response: "error", message: "Error al retornar la venta" };
  }
}