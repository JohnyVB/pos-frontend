import { useEffect, useRef, useState } from "react"
import './../../css/components/POSPage/CashPaymentForm.css'
import Keyboard from "./Keyboard"

interface Props {
  isOpen: boolean
  total: number
  onConfirm: (amount_received: number) => void
  onCancel: () => void
}

export default function CashPaymentForm({ isOpen, total, onConfirm, onCancel }: Props) {
  if (!isOpen) return null

  const [amount, setAmount] = useState<string>("")
  const inputAmountRef = useRef<HTMLInputElement | null>(null)

  const valueAjustment = (value: string) => {
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
    if (inputAmountRef.current) {
      inputAmountRef.current.focus()
    }
  }, [])

  return (
    <div className="overlay-cash-payment">
      <div className="modal-cash-payment">
        <h2>Total: €{total.toFixed(2)}</h2>
        <h3>Recibido</h3>
        <input
          ref={inputAmountRef}
          type="text"
          placeholder="Recibido"
          value={amount}
          onChange={(e) => valueAjustment(e.target.value)}
          className="input-cash"
        />
        <h3>Cambio</h3>
        <div className="displayBox-cash-payment">
          € {change > 0 ? change.toFixed(2) : "0.00"}
        </div>
        <Keyboard number={amount} addNumber={valueAjustment} clear={clear} />
        <div className="buttons-cash-payment">
          <button
            disabled={amount_received < total}
            className="btn-pos btn-success"
            onClick={() => onConfirm(amount_received)}
          >
            Confirmar Pago
          </button>
          <button className="btn-pos btn-danger" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}