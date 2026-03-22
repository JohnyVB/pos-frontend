import API from "../config/api.config";
import type { CashMovementBody, CashMovementResponse } from "../interfaces/pages/CashMovements.interface";

export const onCreateMovement = async (store_id: string, session_id: number, body: CashMovementBody): Promise<CashMovementResponse> => {
  try {
    const { data } = await API.post(`/cash-movements/${store_id}/${session_id}`, body);
    return data;
  } catch (error) {
    console.log(error);
    return { response: "error" }
  }
}