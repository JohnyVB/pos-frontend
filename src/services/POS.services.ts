import API from "../config/api.config";
import type { SearchProductResponse } from "../interfaces/POS.interfaces";

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