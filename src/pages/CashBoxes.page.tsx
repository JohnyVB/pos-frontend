import { useState, useEffect } from "react"
import type { CashBox } from "../interfaces/pages/CashBoxes.interface"
import { PageHeader } from "../components/common/PageHeader"
import "../css/pages/CashBoxes.css"
import { onCloseCashBox, onGetCashBoxes, onOpenCashBox } from "../services/cashBoxes.services"
import userStore from "../store/userStore"
import toast, { Toaster } from "react-hot-toast";
import useCashStore from "../store/useCashStore"
import { formatDateToShow } from "../helper/formatDate.helper"

export default function CashBoxes() {
  const { userData, token } = userStore();
  const [cashBoxes, setCashBoxes] = useState<CashBox[]>([])
  const [openingAmount, setOpeningAmount] = useState<number>(0)
  const { cashBox, setCashBox, currentAmount, setCurrentAmount } = useCashStore()

  const openCashBox = async () => {
    const res = await onOpenCashBox(openingAmount, token!)
    if (res.response === "success" && res.cashBox) {
      setCashBoxes(prev => [{ ...res.cashBox!, user_name: userData?.name! }, ...prev])
      setCashBox({ ...res.cashBox!, user_name: userData?.name! })
      setCurrentAmount(openingAmount)
      toast.success("Caja abierta correctamente")
    } else {
      toast.error(res.message || "Error al abrir la caja")
    }
    setOpeningAmount(0)
  }

  const closeCashBox = async (id: number) => {
    if (currentAmount <= openingAmount) {
      toast.error("El monto de cierre debe ser mayor al monto de apertura")
      return
    }
    const res = await onCloseCashBox(id, currentAmount, token!)
    if (res.response === "success" && res.cashBox) {
      setCashBoxes(prev => prev.map(cb => cb.id === id ? { ...res.cashBox!, user_name: userData?.name! } : cb))
      setCashBox(null)
      setCurrentAmount(0)
      toast.success("Caja cerrada correctamente")
    } else {
      toast.error(res.message || "Error al cerrar la caja")
    }
  }

  const getCashBoxes = async () => {
    const res = await onGetCashBoxes(token!)
    if (res.response === "success" && res.cashBoxes) {
      setCashBoxes(res.cashBoxes)
      updateCashBox(res.cashBoxes)
    } else {
      toast.error(res.message || "Error al obtener las cajas")
    }
  }

  const updateCashBox = (cashBoxes: CashBox[]) => {
    const openCashBox = cashBoxes.find((cb: CashBox) => cb.status === "OPEN")
    if (openCashBox) {
      setCashBox(openCashBox)
    }
  }

  const valueAjustment = (value: string, type: "OPENING" | "CLOSING") => {
    value = value.replace(',', '.');
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value === "." || regex.test(value)) {
      if (type === "OPENING") {
        setOpeningAmount(Number(value));
      } else {
        setCurrentAmount(Number(value));
      }
    }
  }

  useEffect(() => {
    getCashBoxes()
  }, [])

  return (
    <div className="padding-container">
      <PageHeader title="Gestión de Cajas" />

      <div className="cashbox-container">
        <div className="cashbox-actions">
          <div className="cashbox-input-group">
            {cashBox && (
              <div>
                <label>Monto Actual</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Dinero actual en caja"
                  value={currentAmount}
                  onChange={e => valueAjustment(e.target.value, "CLOSING")}
                  style={{ marginBottom: 0 }}
                />
              </div>
            )}
            {!cashBox && (
              <div>
                <label>Monto de Apertura</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Dinero inicial en caja"
                  value={openingAmount}
                  onChange={e => valueAjustment(e.target.value, "OPENING")}
                  style={{ marginBottom: 0 }}
                />
              </div>
            )}
          </div>
          {!cashBox && (
            <button
              disabled={cashBox !== null || openingAmount === 0}
              className="btn-pos btn-primary"
              onClick={openCashBox}
            >
              Abrir Caja
            </button>
          )}
        </div>

        <div className="cashbox-table-wrapper">
          <table className="cashbox-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th style={{ textAlign: "right" }}>Monto apertura</th>
                <th style={{ textAlign: "right" }}>Monto cierre</th>
                <th style={{ textAlign: "center" }}>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cashBoxes.map(cb => (
                <tr key={cb.id}>
                  <td>{cb.id}</td>
                  <td>{cb.user_name}</td>
                  <td>{cb.opened_at ? formatDateToShow(cb.opened_at) : "-"}</td>
                  <td>{cb.closed_at ? formatDateToShow(cb.closed_at) : "-"}</td>
                  <td className="price" style={{ paddingRight: "16px" }}>${cb.opening_amount}</td>
                  <td className="price" style={{ paddingRight: "16px" }}>{cb.closing_amount ? `$${cb.closing_amount}` : "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className={`status-badge ${cb.status === "OPEN" ? "status-open" : "status-closed"}`}>
                      {cb.status === "OPEN" ? "Abierta" : "Cerrada"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {cb.status === "OPEN" && (
                      <button
                        className="btn-pos btn-danger"
                        style={{ padding: "8px 16px", minWidth: "auto", fontSize: "14px", margin: "0 auto" }}
                        onClick={() => closeCashBox(cb.id)}
                      >
                        Cerrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {cashBoxes.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                    No hay cajas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}