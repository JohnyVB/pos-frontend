import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Keyboard from "../POSPage/Keyboard";

interface CloseSessionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (cashBoxId: number, closingAmount: number) => void;
  cashBoxId: number;
  currentAmount: string;
}

export const CloseSessionModal = ({
  isOpen,
  onCancel,
  onConfirm,
  cashBoxId,
  currentAmount,
}: CloseSessionModalProps) => {
  const [amount, setAmount] = useState(currentAmount)

  const valueAjustment = (value: string) => {
    const numValue = value.replace(",", ".")
    const regex = /^\d*(\.\d{0,3})?$/
    if (value === "" || regex.test(numValue)) {
      setAmount(value.toString())
    }
  }

  const clear = () => {
    setAmount("");
  };

  useEffect(() => {
    if (!isOpen) return;
    setAmount(currentAmount)
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
            placeholder="0"
            type="text"
            size="lg"
            readOnly
            className="fw-bold text-center fs-2 py-3 border-2 bg-white text-danger"
            value={amount}
          />
          <Form.Text className="text-muted d-block mt-2">
            Verifica el monto total de dinero físico en caja antes de cerrar.
          </Form.Text>
        </Form.Group>

        <Keyboard
          number={amount}
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
              onClick={() => onConfirm(cashBoxId, Number(amount))}
              disabled={Number(amount) < 0}
            >
              Cerrar Sesión
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
