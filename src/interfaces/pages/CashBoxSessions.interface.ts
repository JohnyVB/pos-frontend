export interface CashBoxSession {
  // datos de la sesion
  session_id: number
  opening_amount: number //
  closing_amount: number | null //
  opened_at: string //
  closed_at: string | null //
  session_status: "OPEN" | "CLOSED" //
  // datos del usuario
  user_id: number
  user_full_name: string //
  // datos de la terminal
  terminal_name: string //
  // datos de la tienda
  store_id: string
  store_name: string //
  // datos de ventas
  total_sales_count: number //
  total_sales_amount: number //
  total_collected: number
  total_cash_in: number //
  total_cash_out: number //
  expected_cash_balance: number //
}

export interface OpenCashBoxSessionResponse {
  response: string
  message?: string
  cashBoxSession?: CashBoxSession
}

export interface CloseCashBoxSessionResponse {
  response: string
  message?: string
  cashBoxSession?: CashBoxSession
}

export interface GetCashBoxSessionsResponse {
  response: string
  message?: string
  cashBoxSessions?: CashBoxSession[]
}

export interface CashBoxSessionFilters {
  pos_terminal_id: string | null
  start_date: string | null
  end_date: string | null
  user_id: number | null
}