import { Badge, Button, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { PageHeader } from "../components/common/PageHeader"
import { useEffect, useState } from "react"
import { onGetSalesBySessionId } from "../services/sales-history.services"
import userStore from "../store/userStore"
import type { Sale, SaleItem } from "../interfaces/pages/Sales-history.interface"
import { formatDateToShow } from "../helper/formatDate.helper"
import Keyboard from "../components/POSPage/Keyboard"
import toast, { Toaster } from "react-hot-toast"

export const SalesHistory = () => {
  const { token, userData } = userStore();
  const location = useLocation()
  const navigate = useNavigate()
  const sale_history = location.state?.sale_history

  const [sales, setSales] = useState<Sale[]>([])
  const [barcode, setBarcode] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [quantity, setQuantity] = useState("")
  const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null)

  const getSalesBySessionId = async (session_id: number, token: string) => {
    const res = await onGetSalesBySessionId(session_id, token)
    if (res.response === "success" && res.sales) {
      setSales(res.sales)
    }
  }

  useEffect(() => {
    if (!sale_history) {
      navigate("/cashbox-sessions")
      return
    }
    getSalesBySessionId(Number(sale_history.session_id), token!)
  }, [sale_history])

  const handleBarcodeSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode.trim()) return

    let itemFound: SaleItem | null = null
    for (const sale of sales) {
      const item = sale.items.find(i => i && i.barcode === barcode)
      if (item) {
        itemFound = item
        break
      }
    }

    if (itemFound) {
      setSelectedItem(itemFound)
      setQuantity("")
      setShowModal(true)
    } else {
      toast.error("Producto no encontrado en esta sesión")
    }
    setBarcode("")
  }

  const handleAddNumber = (num: string) => {
    if (num.includes('.') && num.split('.').length > 2) return
    setQuantity(num)
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
    setShowModal(false)
    // Aquí el usuario se encargará del servicio después
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Historial de Ventas" />

      {userData?.role === "admin" && (
        <Card className="shadow-sm border-0 mb-4 bg-white mt-3">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="fw-bold text-dark mb-0">Gestionar Devolución</h5>
                <p className="text-muted small mb-0">Escanea el código de barras para iniciar una devolución</p>
              </Col>
              <Col md={6}>
                <Form onSubmit={handleBarcodeSearch}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Escanear código de barras..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="py-2 border-2"
                      autoFocus
                    />
                    <Button variant="primary" type="submit" className="px-4 fw-bold">
                      Buscar
                    </Button>
                  </InputGroup>
                </Form>
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
                <th className="text-center py-3">Productos</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.sale_id}>
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
                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                      {sale.items.map(item => (
                        <Badge key={item.item_id} bg="secondary" className="bg-opacity-10 text-dark fw-normal">
                          {item.quantity}x {item.product_name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
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
            addNumber={handleAddNumber}
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
      </Modal>

      <Toaster position="top-right" />
    </Container>
  )
}
