import { useEffect, useRef, useState } from "react"
import type { ProductByBarcode } from "../../interfaces/pages/POS.interfaces"
import "../../css/components/POSPage/WeightForm.css"
import Keyboard from "./Keyboard"

interface WeightModalProps {
  isOpen: boolean
  product: ProductByBarcode
  onClose: () => void
  onConfirm: (weight: number) => void
}

export default function WeightForm({
  isOpen,
  product,
  onClose,
  onConfirm
}: WeightModalProps) {
  if (!isOpen) return null

  const [weight, setWeight] = useState<string>("")
  const inputWeightRef = useRef<HTMLInputElement | null>(null)
  const total = Number(weight || 0) * Number(product.price)

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
      inputWeightRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div className="overlay-weight">
      <div className="modal-weight">
        <h2>{product.name}</h2>
        <h3>Precio: €{product.price} / kg</h3>
        <input
          ref={inputWeightRef}
          type="text"
          placeholder="Peso en kg"
          value={weight}
          onChange={(e) => valueAjustment(e.target.value)}
          className="input-weight"
        />
        <div style={{ marginTop: 10 }}>
          <h3>Total: €{total.toFixed(2)}</h3>
        </div>
        <Keyboard number={weight} addNumber={valueAjustment} clear={clear} />
        <div className="flex gap-2" style={{ justifyContent: 'space-between', marginTop: 20 }}>
          <button
            className="btn-pos btn-primary"
            onClick={() => {
              onConfirm(Number(weight))
              setWeight("")
            }}
          >
            Agregar
          </button>
          <button className="btn-pos btn-danger" onClick={onClose}>
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}
