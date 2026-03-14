import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CloseBoxModal } from "../components/CashBoxPage/CloseBoxModal"
import { PageHeader } from "../components/common/PageHeader"
import { formatDateToShow } from "../helper/formatDate.helper"
import type { CashBox } from "../interfaces/pages/CashBoxes.interface"
import { onCloseCashBox, onGetCashBoxes, onOpenCashBox } from "../services/cashBoxes.services"
import useCashStore from "../store/useCashStore"
import userStore from "../store/userStore"

export default function CashBoxes() {
  const { userData, token } = userStore();
  const [cashBoxes, setCashBoxes] = useState<CashBox[]>([])
  const [openingAmount, setOpeningAmount] = useState<number>(0)
  const [showCloseBoxModal, setShowCloseBoxModal] = useState<boolean>(false)
  const [cashBoxId, setCashBoxId] = useState<number>(0)
  const { cashBox, setCashBox, currentAmount, setCurrentAmount } = useCashStore()
  const navigate = useNavigate()

  const openCashBox = async () => {
    const res = await onOpenCashBox(openingAmount, token!)
    if (res.response === "success" && res.cashBox) {
      setCashBoxes(prev => [{ ...res.cashBox!, user_name: userData?.name! }, ...prev])
      setCashBox({ ...res.cashBox!, user_name: userData?.name! })
      setCurrentAmount(openingAmount)
      toast.success("Caja abierta correctamente")
    } else {
      toast.error(res.message || "Error al abrir la caja")
      setOpeningAmount(0)
    }
  }

  const closeCashBox = async (id: number) => {
    const res = await onCloseCashBox(id, currentAmount, token!)
    if (res.response === "success" && res.cashBox) {
      setCashBoxes(prev => prev.map(cb => cb.id === id ? { ...res.cashBox!, user_name: userData?.name! } : cb))
      setCashBox(null)
      setCurrentAmount(0)
      setShowCloseBoxModal(false)
      setCashBoxId(0)
      setOpeningAmount(0)
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

  const valueAjustment = (value: string) => {
    value = value.replace(',', '.');
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value === "." || regex.test(value)) {
      setOpeningAmount(Number(value));
      setCurrentAmount(Number(value)); // Mantenemos en sincronía para el input actual
    }
  }

  const handleCloseBox = (id: number) => {
    if (currentAmount <= openingAmount) {
      toast.error("El monto de cierre debe ser mayor al monto de apertura")
      return
    }
    setShowCloseBoxModal(true)
    setCashBoxId(id)
  }

  useEffect(() => {
    getCashBoxes()
  }, [])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de Cajas" />
      <Card className="shadow-sm border-0 mb-4 bg-white mt-3">
        <Card.Body className="p-4">
          <Row className="align-items-end g-3">
            <Col xs={12} md={6} lg={4}>
              {cashBox ? (
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Monto Actual en Caja</Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="Dinero actual en caja"
                    value={currentAmount}
                    onChange={e => {
                      let val = e.target.value.replace(',', '.');
                      if (/^\d*(\.\d{0,2})?$/.test(val)) {
                        setCurrentAmount(Number(val))
                      }
                    }}
                    className="font-monospace text-success fw-bold"
                  />
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label className="fw-semibold text-secondary">Monto de Apertura Inicial</Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="Dinero inicial en caja"
                    value={openingAmount}
                    onChange={e => valueAjustment(e.target.value)}
                    className="font-monospace fw-bold"
                  />
                </Form.Group>
              )}
            </Col>

            <Col xs={12} md="auto" className="d-flex gap-2">
              {!cashBox && (
                <Button
                  size="lg"
                  variant="primary"
                  className="fw-bold px-4 shadow-sm"
                  disabled={cashBox !== null || openingAmount === 0}
                  onClick={openCashBox}
                >
                  Abrir Caja
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">Usuario</th>
                <th className="py-3">Apertura</th>
                <th className="py-3">Cierre</th>
                <th className="text-end py-3">Monto Apertura</th>
                <th className="text-end py-3">Monto Cierre</th>
                <th className="text-center py-3">Estado</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cashBoxes.map(cb => (
                <tr key={cb.id}>
                  <td className="px-4"><small className="text-muted">#{cb.id}</small></td>
                  <td className="fw-semibold">{cb.user_name}</td>
                  <td><small>{cb.opened_at ? formatDateToShow(cb.opened_at) : "-"}</small></td>
                  <td><small>{cb.closed_at ? formatDateToShow(cb.closed_at) : "-"}</small></td>
                  <td className="text-end font-monospace">€{cb.opening_amount}</td>
                  <td className="text-end font-monospace">{cb.closing_amount ? `€${cb.closing_amount}` : "-"}</td>
                  <td className="text-center">
                    <Badge bg={cb.status === "OPEN" ? "success" : "danger"} className="px-3 py-2 rounded-pill">
                      {cb.status === "OPEN" ? "ABIERTA" : "CERRADA"}
                    </Badge>
                  </td>
                  <td className="text-center px-4">
                    {cb.status === "OPEN" ? (
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="fw-bold"
                          onClick={() => handleCloseBox(cb.id)}
                        >
                          Cerrar Caja
                        </Button>
                        {userData?.role === "admin" && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="fw-bold"
                            onClick={() => navigate(`/sales-history?cashBoxId=${cb.id}`)}
                          >
                            Ver
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        {userData?.role === "admin" ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="fw-bold"
                            onClick={() => navigate(`/sales-history?cashBoxId=${cb.id}`)}
                          >
                            Ver Movimientos
                          </Button>

                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {cashBoxes.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-5">
                    No hay registros de cajas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Toaster position="top-center" />
      <CloseBoxModal
        isOpen={showCloseBoxModal}
        cashBoxId={cashBoxId}
        onCancel={() => setShowCloseBoxModal(false)}
        onConfirm={closeCashBox}
      />
    </Container>
  )
}