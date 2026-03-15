import React, { useEffect, useRef, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { PageHeader } from "../components/common/PageHeader"
import { ReturnModal } from "../components/SalesHistory/ReturnModal"
import { formatDateToShow } from "../helper/formatDate.helper"
import type { CashBoxSession } from "../interfaces/pages/CashBoxSessions.interface"
import type { Sale, SaleItem } from "../interfaces/pages/Sales-history.interface"
import { onGetSalesBySessionId } from "../services/sales-history.services"
import userStore from "../store/userStore"

export const SalesHistory = () => {
  const { token, userData } = userStore();
  const location = useLocation()
  const navigate = useNavigate()
  const sale_history: CashBoxSession = location.state?.sale_history
  const [sales, setSales] = useState<Sale[]>([])
  const [barcode, setBarcode] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null)
  const inputBarcodeRef = useRef<HTMLInputElement>(null)

  const getSalesBySessionId = async (session_id: number, token: string) => {
    const res = await onGetSalesBySessionId(session_id, token)
    if (res.response === "success" && res.sales) {
      setSales(res.sales)
    }
  }

  const toggleSaleExpand = (sale_id: number) => {
    setExpandedSaleId(expandedSaleId === sale_id ? null : sale_id)
  }

  const handleSelectSale = (sale: Sale) => {
    setSelectedSale(prev => {
      if (prev) {
        return null
      } else {
        inputBarcodeRef.current?.focus()
        return sale
      }
    })
  }

  const searchProductByBarcode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!barcode.trim()) return
      const item = selectedSale?.items.find(item => item.barcode === barcode) || null
      if (item) {
        setSelectedItem(item)
      } else {
        toast.error("Producto no encontrado")
      }
    }
  }

  const valueAjustment = (value: string) => {
    if (Number(value) <= selectedItem?.quantity!) {
      const numValue = value.replace(",", ".")
      const regex = /^\d*(\.\d{0,3})?$/
      if (value === "" || regex.test(numValue)) {
        setQuantity(value)
      }
    }
  }

  const handleConfirmReturn = () => {
    if (!selectedItem || !quantity || Number(quantity) <= 0) {
      toast.error("Ingresa una cantidad válida")
      return
    }
    if (Number(quantity) > selectedItem.quantity) {
      toast.error(`La cantidad excede la vendida (${selectedItem.quantity})`)
      return
    }

    toast.success(`Devolución de ${quantity}x ${selectedItem.product_name} iniciada`)
    setSelectedItem(null)
    // Aquí el usuario se encargará del servicio después
  }

  useEffect(() => {
    if (!sale_history) {
      navigate("/cashbox-sessions")
      return
    }
    getSalesBySessionId(Number(sale_history.session_id), token!)
  }, [sale_history])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Historial de Ventas" />

      {userData?.role === "admin" && sale_history.session_status === "OPEN" && (
        <Card className="shadow-sm border-0 mb-4 bg-white mt-3">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="fw-bold text-dark mb-0">Gestionar Devolución</h5>
                <p className="text-muted small mb-0">Escanea el código de barras para iniciar una devolución</p>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    ref={inputBarcodeRef}
                    placeholder="Escanear código de barras..."
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={searchProductByBarcode}
                    className="py-2 border-2"
                    autoFocus
                  />
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID Venta</th>
                <th className="py-3">Fecha</th>
                <th className="py-3">Método Pago</th>
                <th className="text-end py-3">Subtotal</th>
                <th className="text-end py-3">IVA</th>
                <th className="text-end py-3">Total</th>
                <th className="text-center py-3">Estado</th>
                <th className="text-center py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <React.Fragment key={sale.sale_id}>
                  <tr
                    onClick={() => toggleSaleExpand(sale.sale_id)}
                    style={{ cursor: 'pointer' }}
                    className={expandedSaleId === sale.sale_id ? 'table-primary bg-opacity-10' : ''}
                  >
                    <td className="px-4 fw-bold text-primary">#{sale.sale_id}</td>
                    <td>{formatDateToShow(sale.created_at)}</td>
                    <td>
                      <Badge bg="info" className="text-dark bg-opacity-10 py-2 px-3 rounded-pill uppercase">
                        {sale.payment_method}
                      </Badge>
                    </td>
                    <td className="text-end font-monospace">€{sale.sale_subtotal}</td>
                    <td className="text-end font-monospace">€{sale.sale_vat_total}</td>
                    <td className="text-end fw-bold font-monospace">€{sale.total}</td>
                    <td className="text-center">
                      <Badge bg={sale.sale_status === "COMPLETED" ? "success" : "danger"} className="px-3 py-2 rounded-pill">
                        {sale.sale_status}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="link" className="text-decoration-none fw-bold p-0" onClick={() => handleSelectSale(sale)}>
                        {expandedSaleId === sale.sale_id ? 'Ocultar' : 'Ver Detalles'}
                      </Button>
                    </td>
                  </tr>

                  {expandedSaleId === sale.sale_id && (
                    <tr>
                      <td colSpan={8} className="p-0 bg-light">
                        <div className="p-4 animate__animated animate__fadeIn">
                          <h6 className="fw-bold mb-3 border-bottom pb-2">Productos de la Venta #{sale.sale_id}</h6>
                          <Table size="sm" className="mb-0 bg-white shadow-sm border rounded">
                            <thead className="table-secondary">
                              <tr>
                                <th className="px-3">Producto</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-end">Precio Unit.</th>
                                <th className="text-end px-3">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sale.items.map(item => (
                                <tr key={item.item_id}>
                                  <td className="px-3">{item.product_name} {item.barcode}</td>
                                  <td className="text-center fw-bold">{item.quantity}</td>
                                  <td className="text-end">€{item.price_at_sale}</td>
                                  <td className="text-end px-3 fw-bold text-primary">€{item.item_subtotal}</td>
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
                  <td colSpan={8} className="text-center text-muted py-5">
                    No se encontraron ventas para esta sesión.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de Devolución */}
      {/* <Modal show={selectedItem !== null} onHide={() => setSelectedItem(null)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Ingresar Cantidad</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedItem && (
            <div className="text-center mb-4">
              <h6 className="text-muted text-uppercase small fw-bold">Producto a devolver</h6>
              <h4 className="fw-bold">{selectedItem.product_name}</h4>
              <Badge bg="light" className="text-dark border">Vendidos: {selectedItem.quantity}</Badge>
            </div>
          )}

          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              readOnly
              className="text-center fs-1 fw-bold py-3 bg-light border-2"
              value={quantity || "0"}
            />
          </Form.Group>

          <Keyboard
            number={quantity}
            addNumber={valueAjustment}
            clear={() => setQuantity("")}
          />

          <div className="d-grid mt-4">
            <Button
              size="lg"
              variant="primary"
              className="fw-bold py-3 shadow-sm"
              onClick={handleConfirmReturn}
              disabled={!quantity || Number(quantity) <= 0}
            >
              Confirmar Devolución
            </Button>
          </div>
        </Modal.Body>
      </Modal> */}
      <ReturnModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        quantity={quantity}
        setQuantity={setQuantity}
        valueAjustment={valueAjustment}
        handleConfirmReturn={handleConfirmReturn}
      />

      <Toaster position="top-center" />
    </Container>
  )
}
