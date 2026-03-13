import './../../css/components/POSPage/PaymentModal.css'

type Props = {
  isOpen: boolean
  total: number
  onSelectPayment: (method: string) => void
  onClose: () => void
}

export default function PaymentModal({ isOpen, total, onSelectPayment, onClose }: Props) {
  if (!isOpen) return null
  return (
    <div className="overlayStyle">
      <div className="modalStyle">
        <h2>Total: €{total.toFixed(2)}</h2>
        <h3>Seleccionar método de pago</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            className="btn-pos btn-success"
            onClick={() => onSelectPayment("CASH")}
          >
            💶 Efectivo
          </button>
          <button
            className="btn-pos btn-primary"
            onClick={() => onSelectPayment("CARD")}
          >
            💳 Tarjeta
          </button>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button className="btn-pos btn-danger" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}