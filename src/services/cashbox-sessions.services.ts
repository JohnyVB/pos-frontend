import API from "../config/api.config";
import type { CashBoxSessionFilters, CloseCashBoxSessionResponse, GetCashBoxSessionsResponse, OpenCashBoxSessionResponse } from "../interfaces/pages/CashBoxSessions.interface";

export const onOpenCashBoxSession = async (openingAmount: number, posTerminalId: number, token: string): Promise<OpenCashBoxSessionResponse> => {
  try {
    const { data } = await API.post("/cashbox-sessions/open", {
      opening_amount: openingAmount,
      pos_terminal_id: posTerminalId
    }, {
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

export const onCloseCashBoxSession = async (id: number, currentAmount: number, token: string): Promise<CloseCashBoxSessionResponse> => {
  try {
    const { data } = await API.put(`/cashbox-sessions/close`, { cash_box_id: id, closing_amount: currentAmount }, {
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

export const onGetCashBoxSessions = async (filters: CashBoxSessionFilters, token: string): Promise<GetCashBoxSessionsResponse> => {
  try {
    const { data } = await API.post("/cashbox-sessions/get", filters, {
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