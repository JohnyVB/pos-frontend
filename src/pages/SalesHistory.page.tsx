import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { PageHeader } from "../components/common/PageHeader"
import { useEffect, useState } from "react"
import { onGetSalesBySessionId } from "../services/sales-history.services"
import userStore from "../store/userStore"
import type { Sale } from "../interfaces/pages/Sales-history.interface"

export const SalesHistory = () => {
  const { token } = userStore();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const session_id = queryParams.get("session_id")
  const [sales, setSales] = useState<Sale[]>([])

  const getSalesBySessionId = async (session_id: number, token: string) => {
    const res = await onGetSalesBySessionId(session_id, token)
    if (res.response === "success" && res.sales) {
      setSales(res.sales)
    }
  }

  useEffect(() => {
    if (session_id) {
      getSalesBySessionId(Number(session_id), token!)
    }
  }, [session_id])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Historial de Ventas" />
      <h1>{session_id}</h1>
    </Container>
  )
}
