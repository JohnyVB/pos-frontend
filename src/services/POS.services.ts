import API from "../config/api.config";
import type { RegisterSaleBody, RegisterSaleResponse, SearchProductResponse } from "../interfaces/pages/POS.interfaces";

export const onGetProductByBarcode = async (barcode: number, store_id: string): Promise<SearchProductResponse> => {
  try {
    const { data } = await API.get(`/products/barcode/${barcode}/${store_id}`)
    return data;
  } catch (error: any) {
    console.log("Error en onGetProductByBarcode", error)
    return { response: "error", message: "Error al buscar producto" };
  }
}

export const onCreateSale = async (body: RegisterSaleBody, store_id: string): Promise<RegisterSaleResponse> => {
  try {
    const { data } = await API.post(`/sales/${store_id}`, body)
    return data;
  } catch (error: any) {
    console.log("Error en onCreateSale", error)
    return { response: "error", message: "Error al registrar venta" };
  }
}
