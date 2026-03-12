import API from "../config/api.config";
import type { RegisterSaleBody, RegisterSaleResponse, SearchProductResponse } from "../interfaces/pages/POS.interfaces";

export const onGetProductByBarcode = async (barcode: number, token: string): Promise<SearchProductResponse> => {
  try {
    const { data } = await API.get(`/products/barcode/${barcode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return data;
  } catch (error: any) {
    console.log("Error en onGetProductByBarcode", error)
    return { response: "error", message: "Error al buscar producto" };
  }
}

export const onRegisterSale = async (body: RegisterSaleBody, token: string): Promise<RegisterSaleResponse> => {
  try {
    const { data } = await API.post(`/sales`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return data;
  } catch (error: any) {
    console.log("Error en onRegisterSale", error)
    return { response: "error", message: "Error al registrar venta" };
  }
}
