import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { PageHeader } from "../components/common/PageHeader"

export const SalesHistory = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const cashBoxId = queryParams.get("cashBoxId")

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Historial de Ventas" />
      <h1>{cashBoxId}</h1>
    </Container>
  )
}
