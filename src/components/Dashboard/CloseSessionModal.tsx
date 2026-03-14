import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Keyboard from "../POSPage/Keyboard";
import { useEffect } from "react";

interface CloseSessionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (cashBoxId: number, closingAmount: number) => void;
  cashBoxId: number;
  currentAmount: string; // Recibimos el monto como string para el teclado
  setCurrentAmount: (amount: string) => void;
}

export const CloseSessionModal = ({
  isOpen,
  onCancel,
  onConfirm,
  cashBoxId,
  currentAmount,
  setCurrentAmount
}: CloseSessionModalProps) => {

  const valueAjustment = (value: string) => {
    const numValue = value.replace(",", ".")
    const regex = /^\d*(\.\d{0,3})?$/
    if (value === "" || regex.test(numValue)) {
      setCurrentAmount(value.toString())
    }
  }

  const clear = () => {
    setCurrentAmount("0");
  };

  useEffect(() => {
    if (!isOpen) return;
    // No reseteamos el monto a cero al abrir, ya que queremos mostrar lo que hay en el store
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onCancel} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-danger">Cierre de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form.Group className="mb-4 text-center">
          <Form.Label className="fw-bold text-secondary small text-uppercase">Monto de Cierre de Caja</Form.Label>
          <Form.Control
            type="text"
            size="lg"
            readOnly
            className="fw-bold text-center fs-2 py-3 border-2 bg-white text-danger"
            value={currentAmount}
          />
          <Form.Text className="text-muted d-block mt-2">
            Verifica el monto total de dinero físico en caja antes de cerrar.
          </Form.Text>
        </Form.Group>

        <Keyboard
          number={currentAmount}
          addNumber={valueAjustment}
          clear={clear}
        />

        <hr className="my-4" />

        <Row className="g-2">
          <Col xs={6}>
            <Button variant="outline-secondary" className="w-100 py-3 fw-bold" onClick={onCancel}>
              Cancelar
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="danger"
              className="w-100 py-3 fw-bold shadow-sm"
              onClick={() => onConfirm(cashBoxId, Number(currentAmount))}
              disabled={Number(currentAmount) < 0}
            >
              Cerrar Sesión
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
