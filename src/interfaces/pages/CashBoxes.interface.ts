export interface CashBox {
  id: number
  user_id: number
  user_name: string
  opening_amount: number
  closing_amount: number | null
  opened_at: string
  closed_at: string | null
  status: "OPEN" | "CLOSED"
}

export interface OpenCashBoxResponse {
  response: string
  message?: string
  cashBox?: CashBox
}

export interface CloseCashBoxResponse {
  response: string
  message?: string
  cashBox?: CashBox
}

export interface GetCashBoxesResponse {
  response: string
  message?: string
  cashBoxes?: CashBox[]
}