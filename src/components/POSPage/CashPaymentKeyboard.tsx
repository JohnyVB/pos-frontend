import { useState } from "react"
import './../../css/components/POSPage/CashPaymentKeyboard.css'

type Props = {
  total: number
  onConfirm: (amount_received: number) => void
  onCancel: () => void
}

export default function CashPaymentKeyboard({ total, onConfirm, onCancel }: Props) {

  const [amount, setAmount] = useState<string>("")

  const addNumber = (value: string) => {
    setAmount(prev => prev + value)
  }

  const clear = () => {
    setAmount("")
  }

  const amount_received = parseFloat(amount || "0")
  const change = amount_received - total

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Total: €{total.toFixed(2)}</h2>
        <h3>Recibido</h3>
        <div className="displayBox">
          € {amount || "0"}
        </div>
        <h3>Cambio</h3>
        <div className="displayBox">
          € {change > 0 ? change.toFixed(2) : "0.00"}
        </div>
        <div className="keyboard">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(n => (
            <button
              key={n}
              className="key"
              onClick={() => addNumber(n)}
            >
              {n}
            </button>
          ))}
          <button className="key" onClick={clear}>
            c
          </button>
        </div>
        <div className="buttonsContainer">
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