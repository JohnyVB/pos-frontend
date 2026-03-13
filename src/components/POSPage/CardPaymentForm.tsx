import { useEffect, useRef, useState } from "react"
import './../../css/components/POSPage/CardPaymentForm.css'
import Keyboard from "./Keyboard"

interface Props {
  isOpen: boolean
  total: number
  onConfirm: (reference: string) => void
  onCancel: () => void
}

export default function CardPaymentForm({ isOpen, total, onConfirm, onCancel }: Props) {
  if (!isOpen) return null

  const [reference, setReference] = useState<string>("")
  const inputReferenceRef = useRef<HTMLInputElement | null>(null)

  const addNumber = (value: string) => {
    setReference(prev => prev + value)
  }

  const clear = () => {
    setReference("")
  }

  useEffect(() => {
    if (inputReferenceRef.current) {
      inputReferenceRef.current.focus()
    }
  }, [])

  return (
    <div className="overlay-card-payment">
      <div className="modal-card-payment">
        <h2>Total: €{total.toFixed(2)}</h2>
        <h3>Referencia del datáfono</h3>
        <input
          ref={inputReferenceRef}
          type="text"
          placeholder="Ej: 03458219"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="input-card-payment"
        />
        <Keyboard number={reference} addNumber={addNumber} clear={clear} />
        <div className="buttons-card-payment">
          <button
            disabled={!reference}
            onClick={() => onConfirm(reference)}
            className="btn-pos btn-success"
          >
            Confirmar pago
          </button>
          <button
            onClick={onCancel}
            className="btn-pos btn-danger">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}