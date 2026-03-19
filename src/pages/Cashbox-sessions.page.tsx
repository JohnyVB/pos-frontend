import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CloseSessionModal } from "../components/Dashboard/CloseSessionModal"
import { OpenSessionModal } from "../components/Dashboard/OpenSessionModal"
import { PageHeader } from "../components/common/PageHeader"
import { formatDateToShow } from "../helper/formatDate.helper"
import { useForm } from "../hooks/useForm"
import type { Terminal } from "../interfaces/global.interface"
import type { CashBoxSession, CashBoxSessionFilters } from "../interfaces/pages/CashBoxSessions.interface"
import { onCloseCashBoxSession, onGetCashBoxSessions, onOpenCashBoxSession } from "../services/cashbox-sessions.services"
import { onGetTerminals } from "../services/terminals.services"
import useCashStore from "../store/useCashStore"
import userStore from "../store/userStore"

export default function CashboxSessions() {
  const { userData } = userStore();
  const [cashBoxSessions, setCashBoxSessions] = useState<CashBoxSession[]>([])
  const [showCloseBoxModal, setShowCloseBoxModal] = useState<boolean>(false)
  const [cashBoxId, setCashBoxId] = useState<number>(0)
  const { cashBoxSession, setCashBoxSession, currentAmount, setCurrentAmount } = useCashStore()
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [showTerminalModal, setShowTerminalModal] = useState<boolean>(false)
  const [openingAmount, setOpeningAmount] = useState<string>("");
  const navigate = useNavigate()
  const { form, onChangeForm, resetForm } = useForm<CashBoxSessionFilters>({
    user_id: (userData && userData.role === "admin") ? null : userData?.id || null,
    pos_terminal_id: null,
    start_date: null,
    end_date: null
  });

  const getTerminals = async () => {
    const data = await onGetTerminals(userData?.store_id!);
    if (data.response === "success" && data.terminals) {
      setTerminals(data.terminals);
    }
  }

  const openCashBoxSession = async (terminal: Terminal, openingAmount: number) => {
    const res = await onOpenCashBoxSession(openingAmount, terminal.id, userData?.store_id!);
    if (res.response === "success" && res.cashBoxSession) {
      setCashBoxSessions(prev => [{ ...res.cashBoxSession!, terminal_name: terminal.name, user_name: userData!.name }, ...prev])
      setCashBoxSession(res.cashBoxSession);
      setShowTerminalModal(false);
      setCurrentAmount(openingAmount.toString())
      toast.success(`Caja abierta en ${terminal.name}`);
    } else {
      toast.error(res.message || "Error al abrir la caja");
    }
  };

  const handleShowTerminalModal = () => {
    setShowTerminalModal(true)
  }

  const closeCashBoxSession = async (id: number, closingAmount: number) => {
    const res = await onCloseCashBoxSession(id, closingAmount)
    if (res.response === "success" && res.cashBoxSession) {
      setCashBoxSessions(prev =>
        prev.map(cb => cb.session_id === id
          ? { ...res.cashBoxSession!, terminal_name: cb.terminal_name, user_name: userData!.name }
          : cb
        ))
      setCashBoxSession(null)
      setShowCloseBoxModal(false)
      setCashBoxId(0)
      setCurrentAmount("0")
      toast.success("Caja cerrada correctamente")
    } else {
      toast.error(res.message || "Error al cerrar la caja")
    }
  }

  const getCashBoxSessions = async () => {
    const res = await onGetCashBoxSessions(form, userData?.store_id!)
    if (res.response === "success" && res.cashBoxSessions) {
      setCashBoxSessions(res.cashBoxSessions)
      updateCashBox(res.cashBoxSessions)
    } else {
      toast.error(res.message || "Error al obtener las sessiones")
    }
  }

  const updateCashBox = (cashBoxSessions: CashBoxSession[]) => {
    const openCashBox = cashBoxSessions.find((cb: CashBoxSession) => cb.session_status === "OPEN")
    if (openCashBox) {
      setCashBoxSession(openCashBox)
    }
  }

  const handleCloseBox = (id: number) => {
    setShowCloseBoxModal(true)
    setCashBoxId(id)
  }

  const handleClearFilters = async () => {
    const initialFilters = {
      user_id: userData?.role === "admin" ? null : userData?.id!,
      pos_terminal_id: null,
      start_date: null,
      end_date: null
    };
    resetForm();
    const res = await onGetCashBoxSessions(initialFilters, userData?.store_id!)
    if (res.response === "success" && res.cashBoxSessions) {
      setCashBoxSessions(res.cashBoxSessions)
    }
  }

  useEffect(() => {
    if (userData) {
      getCashBoxSessions()
      getTerminals()
    }
  }, [userData?.store_id])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de Cajas" />
      <Card className="shadow-sm border-0 mb-4 bg-white mt-3">
        <Card.Body className="p-4 text-center">
          <Row className="justify-content-center">
            {!cashBoxSession ? (
              <Col xs={12} md="auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="fw-bold px-5 shadow-sm py-3"
                  onClick={handleShowTerminalModal}
                >
                  Abrir Sesión de Caja
                </Button>
              </Col>
            ) : (
              <Col xs={12}>
                <div className="d-flex align-items-center justify-content-center gap-3 bg-light p-3 rounded-3 border">
                  <Badge bg="success" className="px-3 py-2 rounded-pill fs-6 uppercase">Caja Abierta</Badge>
                  <span className="fw-bold text-dark fs-5">Terminal: {cashBoxSession.terminal_name}</span>
                  <span className="text-muted">|</span>
                  <span className="fw-bold text-primary fs-5">Monto Inicial: €{cashBoxSession.opening_amount}</span>
                  <span className="fw-bold text-primary fs-5">Monto Actual: €{currentAmount}</span>
                </div>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {userData?.role === "admin" && (
        <Card className="shadow-sm border-0 mb-4 bg-white">
          <Card.Body className="p-4">
            <h5 className="mb-3 fw-bold text-dark">Filtros de Búsqueda</h5>
            <Form>
              <Row className="align-items-end g-3">
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Caja (Terminal)</Form.Label>
                    <Form.Select
                      value={form.pos_terminal_id || "all"}
                      onChange={(e) => onChangeForm(e.target.value === "all" ? null : e.target.value, "pos_terminal_id")}
                    >
                      <option value="all">Todas las cajas</option>
                      {terminals.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Fecha de Inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.start_date || ""}
                      onChange={(e) => onChangeForm(e.target.value === "" ? null : e.target.value, "start_date")}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Fecha Final</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.end_date || ""}
                      onChange={(e) => onChangeForm(e.target.value === "" ? null : e.target.value, "end_date")}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      className="w-100 fw-bold"
                      onClick={getCashBoxSessions}
                    >
                      Filtrar
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="w-100 fw-bold"
                      onClick={handleClearFilters}
                    >
                      Limpiar
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">Terminal</th>
                <th className="py-3">Usuario</th>
                <th className="py-3">Apertura</th>
                <th className="py-3">Cierre</th>
                <th className="text-end py-3">Monto Apertura</th>
                <th className="text-end py-3">Monto Cierre</th>
                <th className="text-end py-3">Ventas</th>
                <th className="text-end py-3">Total</th>
                <th className="text-center py-3">Estado</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cashBoxSessions.map(cb => (
                <tr key={cb.session_id}>
                  <td className="px-4"><small className="text-muted">#{cb.session_id}</small></td>
                  <td className="fw-semibold">{cb.terminal_name}</td>
                  <td className="fw-semibold">{cb.name}</td>
                  <td><small>{cb.opened_at ? formatDateToShow(cb.opened_at) : "-"}</small></td>
                  <td><small>{cb.closed_at ? formatDateToShow(cb.closed_at) : "-"}</small></td>
                  <td className="text-end font-monospace">€{cb.opening_amount}</td>
                  <td className="text-end font-monospace">{cb.closing_amount ? `€${cb.closing_amount}` : "-"}</td>
                  <td className="text-end font-monospace">{cb.total_sales_count || 0}</td>
                  <td className="text-end font-monospace">{cb.total_collected ? `€${cb.total_collected}` : "-"}</td>
                  <td className="text-center">
                    <Badge bg={cb.session_status === "OPEN" ? "success" : "danger"} className="px-3 py-2 rounded-pill">
                      {cb.session_status === "OPEN" ? "ABIERTA" : "CERRADA"}
                    </Badge>
                  </td>
                  <td className="text-center px-4">
                    <div className="d-flex gap-2 justify-content-center">
                      {cb.session_status === "OPEN" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="fw-bold"
                          onClick={() => handleCloseBox(cb.session_id)}
                        >
                          Cerrar
                        </Button>
                      )}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="fw-bold"
                        onClick={() => navigate("/sales-history", { state: { sale_history: cb } })}
                      >
                        Ver
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {cashBoxSessions.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-muted py-5">
                    No hay registros de cajas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Toaster position="top-center" />
      <CloseSessionModal
        isOpen={showCloseBoxModal}
        cashBoxId={cashBoxId}
        currentAmount={currentAmount}
        onCancel={() => setShowCloseBoxModal(false)}
        onConfirm={closeCashBoxSession}
      />
      <OpenSessionModal
        isOpen={showTerminalModal}
        onCancel={() => setShowTerminalModal(false)}
        onSelectTerminal={openCashBoxSession}
        terminals={terminals}
        openingAmount={openingAmount}
        setOpeningAmount={setOpeningAmount}
      />
    </Container>
  )
}