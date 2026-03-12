import API from "../config/api.config";
import type { CloseCashBoxResponse, GetCashBoxesResponse, OpenCashBoxResponse } from "../interfaces/pages/CashBoxes.interface";

export const onOpenCashBox = async (openingAmount: number, token: string): Promise<OpenCashBoxResponse> => {
  try {
    const { data } = await API.post("/cashbox/open", { opening_amount: openingAmount }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al abrir la caja" }
  }
}

export const onCloseCashBox = async (id: number, currentAmount: number, token: string): Promise<CloseCashBoxResponse> => {
  try {
    const { data } = await API.put(`/cashbox/close`, { cash_box_id: id, closing_amount: currentAmount }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al cerrar la caja" }
  }
}

export const onGetCashBoxes = async (token: string): Promise<GetCashBoxesResponse> => {
  try {
    const { data } = await API.get("/cashbox", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al obtener las cajas" }
  }
}