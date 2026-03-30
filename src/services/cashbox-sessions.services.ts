import API from "../config/api.config";
import type {
  CashBoxSessionFilters,
  CloseCashBoxSessionResponse,
  GetCashBoxSessionsResponse,
  OpenCashBoxSessionResponse
} from "../interfaces/pages/CashBoxSessions.interface";

export const onGetCashBoxSessions = async (filters: CashBoxSessionFilters, store_id: string, page: number, limit: number): Promise<GetCashBoxSessionsResponse> => {
  try {
    const { data } = await API.post(`/cashbox-sessions/get/${store_id}`, filters, { params: { page, limit } })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al obtener las cajas" }
  }
}

export const onOpenCashBoxSession = async (openingAmount: number, posTerminalId: number, store_id: string): Promise<OpenCashBoxSessionResponse> => {
  try {
    const { data } = await API.post(`/cashbox-sessions/open/${store_id}`, {
      opening_amount: openingAmount,
      pos_terminal_id: posTerminalId
    })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al abrir la caja" }
  }
}

export const onCloseCashBoxSession = async (cash_box_id: number, currentAmount: number): Promise<CloseCashBoxSessionResponse> => {
  try {
    const { data } = await API.put(`/cashbox-sessions/close`, { cash_box_id, closing_amount: currentAmount })
    return data
  } catch (error: any) {
    console.log(error)
    return { response: "error", message: "Error al cerrar la caja" }
  }
}