export interface CashBoxSession {
  // datos de la sesion
  session_id: number
  opening_amount: number
  closing_amount: number | null
  opened_at: string
  closed_at: string | null
  session_status: "OPEN" | "CLOSED"
  // datos del usuario
  user_id: number
  name: string
  user_name: string
  // datos de la terminal
  pos_terminal_id: number
  terminal_name: string
  // datos de ventas
  total_sales_count: number
  total_collected: number
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
  pos_terminal?: string
  start_date?: string
  end_date?: string
  user_id?: number
}