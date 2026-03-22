import React, { useEffect, useState } from "react"
import { Badge, Button, Card, Container, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { PageHeader } from "../components/common/PageHeader"
import { ReturnModal } from "../components/SalesHistory/ReturnModal"
import { formatDateToShow } from "../helper/formatDate.helper"
import type { CashBoxSession } from "../interfaces/pages/CashBoxSessions.interface"
import type { Sale } from "../interfaces/pages/Sales-history.interface"
import { onGetSalesBySessionId, onSaleRefund } from "../services/sales-history.services"
import userStore from "../store/userStore"
import type { ReturnedItem } from "../interfaces/components/SalesHistory/ReturnModal"
import useCashStore from "../store/useCashStore"

export const SalesHistory = () => {
  const { token, userData } = userStore();
  const { currentAmount, setCurrentAmount } = useCashStore()
  const location = useLocation()
  const navigate = useNavigate()
  const sale_history: CashBoxSession = location.state?.sale_history
  const [sales, setSales] = useState<Sale[]>([])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  const getSalesBySessionId = async () => {
    const res = await onGetSalesBySessionId(Number(sale_history.session_id))
    if (res.response === "success" && res.sales) {
      setSales(res.sales)
      console.log(res.sales)
    }
  }

  const toggleSaleExpand = (record_id: number) => {
    setExpandedSaleId(expandedSaleId === record_id ? null : record_id)
  }

  const handleStartReturn = (sale: Sale) => {
    setSelectedSale(sale)
    setIsReturnModalOpen(true)
  }

  const handleConfirmReturn = async (returnedItems: ReturnedItem[], reason: string) => {
    if (!selectedSale || !token || !userData) return

    const body = {
      sale_id: selectedSale.record_id,
      session_id: Number(sale_history.session_id),
      user_id: userData.id,
      reason,
      items: returnedItems
    }

    const total_refunded = returnedItems.reduce((acc: number, item: any) => {
      const itemTotal = item.price * item.quantity_to_reintegrate;
      const itemVat = 0; // VAT is not returned in the new details JSON
      return acc + itemTotal + itemVat;
    }, 0)

    const res = await onSaleRefund(body, userData.store_id!)

    if (res.response === "success") {
      toast.success("Devolución procesada correctamente")
      setIsReturnModalOpen(false)
      setCurrentAmount((Number(currentAmount) - Number(total_refunded)).toFixed(2))
    } else {
      toast.error(res.message || "Error al procesar la devolución")
    }
  }

  useEffect(() => {
    if (!sale_history) {
      navigate("/cashbox-sessions")
      return
    }
    getSalesBySessionId()
  }, [sale_history])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Historial de Transacciones" />
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Tipo / ID</th>
                <th className="py-3">Fecha</th>
                <th className="py-3">Método Pago</th>
                <th className="text-end py-3">Subtotal</th>
                <th className="text-end py-3">IVA</th>
                <th className="text-end py-3">Total</th>
                <th className="text-end py-3">Total Deuelto</th>
                <th className="text-end py-3">Total Neto</th>
                <th className="text-center py-3">Estado</th>
                <th className="text-center py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <React.Fragment key={`${sale.record_type}-${sale.record_id}`}>
                  <tr
                    onClick={() => sale.record_type === 'SALE' && toggleSaleExpand(sale.record_id)}
                    style={{ cursor: sale.record_type === 'SALE' ? 'pointer' : 'default' }}
                    className={expandedSaleId === sale.record_id ? 'table-primary bg-opacity-10' : ''}
                  >
                    <td className="px-4 fw-bold text-primary">
                      {sale.record_type === 'SALE' ? `Venta #${sale.record_id}` : 
                       sale.record_type === 'CASH_IN' ? `Ingreso #${sale.record_id}` : 
                       `Egreso #${sale.record_id}`}
                    </td>
                    <td>{formatDateToShow(sale.created_at)}</td>
                    <td>
                      <Badge bg="info" className="text-dark bg-opacity-10 py-2 px-3 rounded-pill uppercase">
                        {sale.payment_method}
                      </Badge>
                    </td>
                    <td className="text-end font-monospace">€{Number(sale.sale_subtotal || 0)}</td>
                    <td className="text-end font-monospace">€{Number(sale.sale_vat_total || 0)}</td>
                    <td className="text-end font-monospace">€{Number(sale.amount)}</td>
                    <td className="text-end font-monospace">€{Number(sale.total_refunded || 0)}</td>
                    <td className="text-end fw-bold font-monospace">€{(Number(sale.amount) - Number(sale.total_refunded || 0)).toFixed(2)}</td>
                    <td className="text-center">
                      <Badge bg={sale.record_status === "COMPLETED" ? "success" : sale.record_status === "PARTIALLY_REFUNDED" ? "warning" : "danger"} className="px-3 py-2 rounded-pill">
                        {sale.record_status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {sale.record_type === 'SALE' && (
                        <Button variant="link" className="text-decoration-none fw-bold p-0" onClick={(e) => { e.stopPropagation(); toggleSaleExpand(sale.record_id) }}>
                          {expandedSaleId === sale.record_id ? 'Ocultar' : 'Ver Detalles'}
                        </Button>
                      )}
                    </td>
                  </tr>

                  {expandedSaleId === sale.record_id && sale.record_type === 'SALE' && (
                    <tr>
                      <td colSpan={10} className="p-0 bg-light">
                        <div className="p-4 animate__animated animate__fadeIn">
                          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h6 className="fw-bold mb-0">Productos de la Venta #{sale.record_id}</h6>
                            {(userData?.role === "admin" || userData?.username === sale_history.user_name) && sale_history.session_status === "OPEN" && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="fw-bold"
                                onClick={() => handleStartReturn(sale)}
                              >
                                Iniciar Devolución
                              </Button>
                            )}
                          </div>
                          <Table size="sm" className="mb-0 bg-white shadow-sm border rounded">
                            <thead className="table-secondary">
                              <tr>
                                <th className="px-3">Producto</th>
                                <th className="text-center">Cantidad original</th>
                                <th className="text-center">Cantidad devuelta</th>
                                <th className="text-center">Cantidad neta</th>
                                <th className="text-end">Precio Unit.</th>
                                <th className="text-end px-3">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sale.details?.map(item => (
                                <tr key={item.item_id}>
                                  <td className="px-3">{item.product_name}</td>
                                  <td className="text-center fw-bold">{item.quantity}</td>
                                  <td className="text-center fw-bold">{item.returned}</td>
                                  <td className="text-center fw-bold">{item.quantity}</td>
                                  <td className="text-end">€{item.price}</td>
                                  <td className="text-end px-3 fw-bold text-primary">€{item.subtotal}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-muted py-5">
                    No se encontraron ventas para esta sesión.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ReturnModal
        show={isReturnModalOpen}
        onHide={() => setIsReturnModalOpen(false)}
        selectedSale={selectedSale}
        handleConfirmReturn={handleConfirmReturn}
      />

      <Toaster position="top-center" />
    </Container>
  )
}
