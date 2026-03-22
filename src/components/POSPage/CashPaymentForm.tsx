import { useEffect, useRef, useState } from "react"
import { Modal, Button, Form } from 'react-bootstrap'
import Keyboard from "./Keyboard"

interface Props {
  isOpen: boolean
  total: number
  onConfirm: (amount_received: number) => void
  onCancel: () => void
}

export default function CashPaymentForm({ isOpen, total, onConfirm, onCancel }: Props) {
  const [amount, setAmount] = useState<string>("")
  const inputAmountRef = useRef<HTMLInputElement | null>(null)

  const valueAdjustment = (value: string) => {
    const numValue = value.replace(",", ".")
    const regex = /^\d*(\.\d{0,3})?$/
    if (value === "" || regex.test(numValue)) {
      setAmount(value)
    }
  }

  const clear = () => {
    setAmount("")
  }

  const amount_received = parseFloat(amount || "0")
  const change = amount_received - total

  useEffect(() => {
    if (isOpen) {
      // Pequeño timeout para permitir que el modal se renderice antes de hacer focus
      setTimeout(() => inputAmountRef.current?.focus(), 100)
    } else {
      setAmount("")
    }
  }, [isOpen])

  return (
    <Modal show={isOpen} onHide={onCancel} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pago en Efectivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h2 className="display-6 fw-bold text-primary">€{total.toFixed(2)}</h2>
          <span className="text-muted">Total a Pagar</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Recibido (€)</Form.Label>
          <Form.Control
            ref={inputAmountRef}
            type="text"
            placeholder="0.00"
            size="lg"
            className="text-end fw-bold fs-4 font-monospace"
            value={amount}
            onChange={(e) => valueAdjustment(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Cambio</Form.Label>
          <div className="p-3 bg-light border rounded text-end fw-bold fs-4 text-success font-monospace">
            € {change > 0 ? change.toFixed(2) : "0.00"}
          </div>
        </Form.Group>

        <Keyboard number={amount} addNumber={valueAdjustment} clear={clear} />

        <div className="d-flex gap-2 mt-4">
          <Button
            variant="secondary"
            className="w-100 py-2 fw-bold"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            className="w-100 py-2 fw-bold"
            disabled={amount_received < total}
            onClick={() => onConfirm(amount_received)}
          >
            Confirmar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}