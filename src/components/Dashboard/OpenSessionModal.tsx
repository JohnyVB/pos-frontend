import { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import type { Terminal } from "../../interfaces/global.interface";
import { onGetTerminals } from "../../services/terminals.services";
import userStore from "../../store/userStore";
import Keyboard from "../POSPage/Keyboard";

interface OpenCloseSessionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSelectTerminal: (terminal: Terminal, openingAmount: number) => void;
  terminals: Terminal[];
  setTerminals: (terminals: Terminal[]) => void;
  openingAmount: string;
  setOpeningAmount: (openingAmount: string) => void;
}

export const OpenSessionModal = ({
  isOpen,
  onCancel,
  onSelectTerminal,
  terminals,
  setTerminals,
  openingAmount,
  setOpeningAmount
}: OpenCloseSessionModalProps) => {
  const { token } = userStore();

  const getTerminals = async () => {
    const data = await onGetTerminals(token!);
    if (data.response === "success" && data.terminals) {
      setTerminals(data.terminals);
    }
  }

  const valueAjustment = (value: string) => {
    const numValue = value.replace(",", ".")
    const regex = /^\d*(\.\d{0,3})?$/
    if (value === "" || regex.test(numValue)) {
      setOpeningAmount(value)
    }
  }

  const clear = () => {
    setOpeningAmount("0");
  };

  useEffect(() => {
    if (!isOpen) return;
    getTerminals();
    setOpeningAmount("");
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onCancel} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-primary">Apertura de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          <Col md={6} className="border-end pe-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small text-uppercase">Monto Inicial de Caja</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                readOnly
                placeholder="0"
                className="fw-bold text-center fs-2 py-3 border-2 bg-white"
                value={openingAmount}
                onChange={(e) => valueAjustment(e.target.value)}
              />
              <Form.Text className="text-muted text-center d-block mt-2">
                Usa el teclado para ingresar el efectivo inicial.
              </Form.Text>
            </Form.Group>

            <Keyboard
              number={openingAmount}
              addNumber={valueAjustment}
              clear={clear}
            />
          </Col>

          <Col md={6} className="ps-4">
            <p className="fw-bold text-secondary small text-uppercase mb-3">Selecciona tu Terminal</p>
            <div className="overflow-auto overflow-x-hidden" style={{ maxHeight: '400px' }}>
              <Row className="g-3 mx-0">
                {terminals.map((terminal) => (
                  <Col xs={12} key={terminal.id} className="px-0 gap-2">
                    <Button
                      variant="outline-primary"
                      className="w-100 py-3 fw-bold rounded-3 d-flex justify-content-between align-items-center px-4"
                      disabled={Number(openingAmount) <= 0}
                      onClick={() => onSelectTerminal(terminal, Number(openingAmount))}
                    >
                      <span>{terminal.name}</span>
                      <span className="badge bg-primary rounded-pill">Seleccionar</span>
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
            {terminals.length === 0 && (
              <p className="text-center text-muted py-5">No hay terminales activas disponibles.</p>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}