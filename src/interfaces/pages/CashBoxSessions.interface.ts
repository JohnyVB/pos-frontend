export interface CashBoxSession {
  session_id: number
  pos_terminal_id: number
  opening_amount: number
  opened_at: string
  user_id: number
  user_name: string
  closing_amount: number | null
  closed_at: string | null
  status: "OPEN" | "CLOSED"
  terminal_name: string
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