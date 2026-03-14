import { useEffect, useRef, useState } from "react"
import { Modal, Button, Form } from 'react-bootstrap'
import type { ProductByBarcode } from "../../interfaces/pages/POS.interfaces"
import Keyboard from "./Keyboard"

interface WeightModalProps {
  isOpen: boolean
  product: ProductByBarcode | null
  onClose: () => void
  onConfirm: (weight: number) => void
}

export default function WeightForm({
  isOpen,
  product,
  onClose,
  onConfirm
}: WeightModalProps) {
  const [weight, setWeight] = useState<string>("")
  const inputWeightRef = useRef<HTMLInputElement | null>(null)
  const total = Number(weight || 0) * Number(product?.price || 0)

  const valueAjustment = (value: string) => {
    const numValue = value.replace(",", ".")
    const regex = /^\d*(\.\d{0,3})?$/
    if (value === "" || regex.test(numValue)) {
      setWeight(value)
    }
  }

  const clear = () => {
    setWeight("")
    inputWeightRef.current?.focus()
  }

  useEffect(() => {
    if (isOpen) {
      setWeight("")
      setTimeout(() => inputWeightRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!product) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static" size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="text-truncate" style={{ maxWidth: '90%' }}>
          {product.name}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pb-4">
        <div className="text-center mb-4">
          <h2 className="display-6 fw-bold text-primary">€{total.toFixed(2)}</h2>
          <span className="text-muted">Total calculado</span>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded border">
          <span className="fw-semibold">Precio unitario:</span>
          <span className="fw-bold">€{product.price} / kg</span>
        </div>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Peso (kg)</Form.Label>
          <Form.Control
            ref={inputWeightRef}
            type="text"
            placeholder="0.000"
            size="lg"
            className="text-center fw-bold fs-4 font-monospace"
            value={weight}
            onChange={(e) => valueAjustment(e.target.value)}
          />
        </Form.Group>

        <Keyboard number={weight} addNumber={valueAjustment} clear={clear} />
        
        <div className="d-flex gap-2 mt-4">
          <Button 
            variant="secondary" 
            className="w-100 py-2 fw-bold" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="w-100 py-2 fw-bold"
            disabled={!weight || Number(weight) <= 0}
            onClick={() => {
              onConfirm(Number(weight))
              setWeight("")
            }}
          >
            Agregar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

