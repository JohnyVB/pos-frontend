import { useEffect, useRef, useState } from "react"
import { Badge, Button, Col, Form, InputGroup, ListGroup, Modal, Row } from "react-bootstrap"
import toast from "react-hot-toast"
import type { ReturnedItem, ReturnModalProps } from "../../interfaces/components/SalesHistory/ReturnModal"

export const ReturnModal = ({ show, onHide, selectedSale, handleConfirmReturn }: ReturnModalProps) => {
  const [barcode, setBarcode] = useState("")
  const [reason, setReason] = useState("Producto defectuoso")
  const [returnedItems, setReturnedItems] = useState<ReturnedItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const returnReasons = [
    "Producto defectuoso",
    "Cliente cambió de opinión",
    "Error en el cobro",
    "Producto equivocado",
    "Vencimiento próximo",
    "Otro"
  ]

  useEffect(() => {
    if (show) {
      setBarcode("")
      setReason("Producto defectuoso")
      setReturnedItems([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [show])

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!barcode.trim()) return

      const saleItem = selectedSale?.details?.find(item => item.barcode === barcode)

      if (!saleItem) {
        toast.error("El producto no pertenece a esta venta o el código es incorrecto")
        setBarcode("")
        return
      }

      setReturnedItems(prev => {
        const existing = prev.find(item => item.barcode === barcode)
        if (existing) {
          if (existing.quantity_to_reintegrate >= saleItem.quantity) {
            toast.error("Ya has escaneado la cantidad total vendida de este producto")
            return prev
          }
          return prev.map(item =>
            item.barcode === barcode ? { ...item, quantity_to_reintegrate: item.quantity_to_reintegrate + 1 } : item
          )
        }
        return [...prev, { ...saleItem, quantity_to_reintegrate: 1, reintegrate: true }]
      })
      setBarcode("")
    }
  }

  const toggleReintegrate = (barcode: string) => {
    setReturnedItems(prev => prev.map(item =>
      item.barcode === barcode ? { ...item, reintegrate: !item.reintegrate } : item
    ))
  }

  const removeItem = (barcode: string) => {
    setReturnedItems(prev => prev.filter(item => item.barcode !== barcode))
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Proceso de Devolución</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {selectedSale && (
          <div className="mb-4 text-center p-3 bg-light rounded border">
            <h6 className="text-muted text-uppercase small fw-bold mb-1">Venta Seleccionada</h6>
            <h4 className="fw-bold mb-0">#{selectedSale.record_id}</h4>
            <span className="text-muted small">Total: €{Number(selectedSale.amount)}</span>
          </div>
        )}

        <Row>
          <Col md={5} className="border-end">
            <h6 className="fw-bold mb-3">Escanear Producto</h6>
            <Form.Group className="mb-4">
              <InputGroup>
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Código de barras..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={handleScan}
                  className="py-2 border-2"
                  autoFocus
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Escanea el producto para añadirlo a la lista de devolución.
              </Form.Text>
            </Form.Group>

            <div className="bg-light p-3 rounded mb-4">
              <small className="text-muted d-block mb-2">Instrucciones:</small>
              <ul className="small text-muted ps-3 mb-0">
                <li>Solo productos de esta venta.</li>
                <li>Cada escaneo suma 1 unidad.</li>
                <li>Usa el switch para reintegrar al stock.</li>
              </ul>
            </div>

            <h6 className="fw-bold mb-3">Motivo de Devolución</h6>
            <Form.Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="py-2 border-2"
            >
              {returnReasons.map((r, index) => (
                <option key={index} value={r}>{r}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={7}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Productos a Devolver</h6>
              <Badge bg="primary">{returnedItems.length} items</Badge>
            </div>

            <div style={{ minHeight: '200px', maxHeight: '350px', overflowY: 'auto' }}>
              {returnedItems.length === 0 ? (
                <div className="text-center py-5 text-muted bg-light rounded border border-dashed">
                  <p className="mb-0">No hay productos seleccionados.</p>
                  <small>Escanea un código para comenzar.</small>
                </div>
              ) : (
                <ListGroup variant="flush" className="border rounded shadow-sm">
                  {returnedItems.map(item => (
                    <ListGroup.Item key={item.barcode} className="py-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0">{item.product_name}</h6>
                          <small className="text-muted">{item.barcode}</small>
                        </div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="border-0"
                          onClick={() => removeItem(item.barcode)}
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Badge bg="light" className="text-dark border me-2">
                            Cant: {item.quantity_to_reintegrate}
                          </Badge>
                          <small className="text-primary fw-bold">€{(item.price * item.quantity_to_reintegrate).toFixed(2)}</small>
                        </div>
                        <Form.Check
                          type="switch"
                          label="Reintegrar"
                          id={`reintegrate-${item.barcode}`}
                          checked={item.reintegrate}
                          onChange={() => toggleReintegrate(item.barcode)}
                          className="small fw-bold"
                        />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Col>
        </Row>

        <div className="d-grid mt-4">
          <Button
            size="lg"
            variant="danger"
            className="fw-bold py-3 shadow-sm"
            onClick={() => handleConfirmReturn(returnedItems, reason)}
            disabled={returnedItems.length === 0}
          >
            Confirmar Devolución ({returnedItems.length})
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
