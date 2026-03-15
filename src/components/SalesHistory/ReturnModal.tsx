import { Badge, Button, Form, Modal } from "react-bootstrap"
import Keyboard from "../POSPage/Keyboard"
import type { SaleItem } from "../../interfaces/pages/Sales-history.interface"

interface ReturnModalProps {
  selectedItem: SaleItem | null
  setSelectedItem: (item: SaleItem | null) => void
  quantity: string
  setQuantity: (quantity: string) => void
  valueAjustment: (value: string) => void
  handleConfirmReturn: () => void
}

export const ReturnModal = ({ selectedItem, setSelectedItem, quantity, setQuantity, valueAjustment, handleConfirmReturn }: ReturnModalProps) => {

  const closeModal = () => {
    setQuantity("")
    setSelectedItem(null)
  }

  return (
    <Modal show={selectedItem !== null} onHide={closeModal} centered backdrop="static">
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
    </Modal>
  )
}
