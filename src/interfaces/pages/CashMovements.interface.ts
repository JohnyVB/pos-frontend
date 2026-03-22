export interface CashMovementBody {
  type: "IN" | "OUT"
  amount: string
  reason: string
}

export interface CashMovementResponse {
  response: string
}