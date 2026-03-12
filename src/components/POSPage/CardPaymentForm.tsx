import { useState } from "react"
import './../../css/components/POSPage/CardPaymentForm.css'

type Props = {
  total: number
  onConfirm: (reference: string) => void
  onCancel: () => void
}

export default function CardPaymentModal({ total, onConfirm, onCancel }: Props) {
  const [reference, setReference] = useState("")

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Total: €{total.toFixed(2)}</h2>
        <h3>Referencia del datáfono</h3>
        <input
          type="text"
          placeholder="Ej: A03458219"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="input"
        />
        <div className="buttonsContainer">
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