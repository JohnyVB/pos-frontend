import { useEffect, useRef, useState } from "react"
import { Modal, Button, Form } from 'react-bootstrap'
import Keyboard from "./Keyboard"

interface Props {
  isOpen: boolean
  total: number
  onConfirm: (reference: string) => void
  onCancel: () => void
}

export default function CardPaymentForm({ isOpen, total, onConfirm, onCancel }: Props) {
  const [reference, setReference] = useState<string>("")
  const inputReferenceRef = useRef<HTMLInputElement | null>(null)

  const addNumber = (value: string) => {
    setReference(prev => prev + value)
  }

  const clear = () => {
    setReference("")
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputReferenceRef.current?.focus(), 100)
    } else {
      setReference("")
    }
  }, [isOpen])

  return (
    <Modal show={isOpen} onHide={onCancel} centered backdrop="static" size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Pago con Tarjeta</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pb-4">
        <div className="text-center mb-4">
          <h2 className="display-6 fw-bold text-primary">€{total.toFixed(2)}</h2>
          <span className="text-muted">Total a Pagar</span>
        </div>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Referencia del datáfono</Form.Label>
          <Form.Control
            ref={inputReferenceRef}
            type="text"
            placeholder="Ej: 03458219"
            size="lg"
            className="text-center fw-bold fs-5 font-monospace"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </Form.Group>

        <Keyboard number={reference} addNumber={addNumber} clear={clear} />
        
        <div className="d-flex gap-2 mt-4">
          <Button 
            variant="secondary" 
            className="w-100 py-2 fw-bold" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="w-100 py-2 fw-bold"
            disabled={!reference}
            onClick={() => onConfirm(reference)}
          >
            Confirmar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}