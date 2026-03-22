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

  // Total recaudado en ventas(Solo completadas)
  total_sales_amount: number
  // Suma de Entradas de efectivo (Cash In)
  total_cash_in: number
  // Suma de Salidas de efectivo (Cash Out)
  total_cash_out: number
  // Saldo Final Esperado (Apertura + Ventas - Salidas + Entradas)
  expected_cash_balance: number
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