import API from "../config/api.config";
import type { SaleRefundBody, SaleRefundResponse, SalesHistoryResponse } from "../interfaces/pages/Sales-history.interface";

export const onGetSalesBySessionId = async (session_id: number, token: string): Promise<SalesHistoryResponse> => {
  try {
    const { data } = await API.get(`/sales/${session_id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.log("Error en getSalesBySessionId", error);
    return { response: "error", message: "Error al obtener las ventas" };
  }
}

export const onSaleRefund = async (body: SaleRefundBody, token: string): Promise<SaleRefundResponse> => {
  try {
    const { data } = await API.post(`/sales/${body.sale_id}/refund`, body, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.log("Error en returnSale", error);
    return { response: "error", message: "Error al retornar la venta" };
  }
}