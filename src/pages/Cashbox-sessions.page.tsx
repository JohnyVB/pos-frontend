import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CloseSessionModal } from "../components/Dashboard/CloseSessionModal"
import { OpenSessionModal } from "../components/Dashboard/OpenSessionModal"
import { PageHeader } from "../components/common/PageHeader"
import { formatDateToShow } from "../helper/formatDate.helper"
import { useForm } from "../hooks/useForm"
import type { Store, Terminal } from "../interfaces/global.interface"
import type { CashBoxSession, CashBoxSessionFilters } from "../interfaces/pages/CashBoxSessions.interface"
import { onCloseCashBoxSession, onGetCashBoxSessions, onOpenCashBoxSession } from "../services/cashbox-sessions.services"
import { onGetTerminals } from "../services/terminals.services"
import useCashStore from "../store/useCashStore"
import userStore from "../store/userStore"
import { onGetStores } from "../services/stores.services"
import { TablePagination } from "../components/common/TablePagination"

export default function CashboxSessions() {
  const { userData } = userStore();
  const [cashBoxSessions, setCashBoxSessions] = useState<CashBoxSession[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [showCloseBoxModal, setShowCloseBoxModal] = useState<boolean>(false)
  const [cashBoxId, setCashBoxId] = useState<number>(0)
  const { cashBoxSession, setCashBoxSession, currentAmount, setCurrentAmount } = useCashStore()
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [showTerminalModal, setShowTerminalModal] = useState<boolean>(false)
  const [openingAmount, setOpeningAmount] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { form, onChangeForm, resetForm } = useForm<CashBoxSessionFilters>({
    user_id: (userData && userData.role === "admin" || userData?.role === "superadmin") ? null : userData?.id || null,
    pos_terminal_id: null,
    start_date: null,
    end_date: null
  });

  const [visibleCols, setVisibleCols] = useState({
    dates: true,    // Apertura y Cierre
    amounts: true,  // $ Apertura y $ Cierre
    stats: false,   // Nº Ventas, Entradas, Salidas (Ocultas por defecto)
    financial: true, // T. Ventas, Recaudado, Esperado
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
      setCashBoxSessions(prev => [{
        ...res.cashBoxSession!,
        terminal_name: terminal.name,
        user_name: userData!.name,
        session_status: "OPEN"
      }, ...prev])
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
      getCashBoxSessions(1)
      setCashBoxSession(null)
      setShowCloseBoxModal(false)
      setCashBoxId(0)
      setCurrentAmount("0")
      toast.success("Caja cerrada correctamente")
    } else {
      toast.error(res.message || "Error al cerrar la caja")
    }
  }

  const getCashBoxSessions = async (page: number, limit: number = 10) => {
    const res = await onGetCashBoxSessions(form, userData?.store_id!, page, limit)
    if (res.response === "success" && res.cashBoxSessions && res.pagination) {
      setCashBoxSessions(res.cashBoxSessions)
      setTotalPages(res.pagination.totalPages)
      setCurrentPage(res.pagination.page)
      setTotalRecords(res.pagination.total)
      updateCashBox(res.cashBoxSessions)
    } else {
      toast.error(res.message || "Error al obtener las sesiones")
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
    setSelectedStoreId(null)
    resetForm();
    const res = await onGetCashBoxSessions(initialFilters, userData?.store_id!, 1, 10)
    if (res.response === "success" && res.cashBoxSessions) {
      setCashBoxSessions(res.cashBoxSessions)
    }
  }

  const getStores = async () => {
    try {
      const res = await onGetStores();
      if (res.response === "success" && res.stores) {
        setStores(res.stores);
      } else {
        toast.error(res.message || "Error al obtener tiendas");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener tiendas");
    }
  };

  useEffect(() => {
    getCashBoxSessions(1)
    getTerminals()
    if (userData?.role === "superadmin") {
      getStores()
    }
  }, [userData])

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

      <Card className="shadow-sm border-0 mb-4 bg-white">
        <Card.Body className="p-4">
          <h5 className="mb-3 fw-bold text-dark">Filtros de Búsqueda</h5>
          <Form>
            <Row className="align-items-end g-3">
              {userData?.role !== "cashier" && (
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
              )}
              <Col xs={12} md={userData?.role === "superadmin" ? 2 : userData?.role === "cashier" ? 4 : 3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.start_date || ""}
                    onChange={(e) => onChangeForm(e.target.value === "" ? null : e.target.value, "start_date")}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={userData?.role === "superadmin" ? 2 : userData?.role === "cashier" ? 4 : 3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Fecha Final</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.end_date || ""}
                    onChange={(e) => onChangeForm(e.target.value === "" ? null : e.target.value, "end_date")}
                  />
                </Form.Group>
              </Col>
              {userData?.role === "superadmin" && (
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Tienda</Form.Label>
                    <Form.Select
                      value={selectedStoreId || "all"}
                      onChange={(e) => setSelectedStoreId(e.target.value === "all" ? null : e.target.value)}
                    >
                      <option value="all">Todas las tiendas</option>
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
              <Col xs={12} md={userData?.role === "cashier" ? 4 : 3}>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="w-100 fw-bold"
                    onClick={() => getCashBoxSessions(1)}
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

      <Card className="shadow-sm border-0 bg-white mb-3">
        <Card.Body className="d-flex justify-content-end gap-2">
          <Form.Check
            type="switch" label="Fechas" checked={visibleCols.dates}
            onChange={() => setVisibleCols(v => ({ ...v, dates: !v.dates }))}
          />
          <Form.Check
            type="switch" label="Movimientos" checked={visibleCols.stats}
            onChange={() => setVisibleCols(v => ({ ...v, stats: !v.stats }))}
          />
          <Form.Check
            type="switch" label="Dinero" checked={visibleCols.financial}
            onChange={() => setVisibleCols(v => ({ ...v, financial: !v.financial }))}
          />
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Terminal / Usuario</th>
                {visibleCols.dates && <th>Tiempos (Ap. / Cierre)</th>}
                {visibleCols.amounts && <th className="text-end">Saldos (Ini. / Fin)</th>}
                {visibleCols.stats && <th className="text-center">Actividad (V / E / S)</th>}
                {visibleCols.financial && <th className="text-end">Totales</th>}
                <th className="text-center">Estado</th>
                {userData?.role === "superadmin" && <th className="text-center">Tienda</th>}
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cashBoxSessions.map(cb => (
                <tr key={cb.session_id}>
                  {/* COLUMNA AGRUPADA: Terminal y Usuario */}
                  <td>
                    <div className="fw-bold">{cb.terminal_name}</div>
                    <div className="text-muted small">{cb.user_full_name}</div>
                  </td>

                  {/* COLUMNA AGRUPADA: Fechas */}
                  {visibleCols.dates && (
                    <td>
                      <div className="small"><b>A:</b> {formatDateToShow(cb.opened_at)}</div>
                      <div className="small text-muted"><b>C:</b> {cb.closed_at ? formatDateToShow(cb.closed_at) : "En curso..."}</div>
                    </td>
                  )}

                  {/* COLUMNA AGRUPADA: Montos de caja */}
                  {visibleCols.amounts && (
                    <td className="text-end font-monospace">
                      <div className="text-success">↑ €{cb.opening_amount}</div>
                      <div className="text-danger">↓ {cb.closing_amount ? `€${cb.closing_amount}` : "---"}</div>
                    </td>
                  )}

                  {/* COLUMNA AGRUPADA: Stats (Ventas, Entradas, Salidas) */}
                  {visibleCols.stats && (
                    <td className="text-center">
                      <Badge bg="light" text="dark" className="border me-1" title="Ventas">🛒 {cb.total_sales_count}</Badge>
                      <Badge bg="light" text="success" className="border me-1" title="Entradas">➕ {cb.total_cash_in}</Badge>
                      <Badge bg="light" text="danger" className="border" title="Salidas">➖ {cb.total_cash_out}</Badge>
                    </td>
                  )}

                  {/* COLUMNA AGRUPADA: Resumen Financiero */}
                  {visibleCols.financial && (
                    <td className="text-end">
                      <div className="fw-bold">€{cb.total_collected}</div>
                      <div className="small text-muted" title="Esperado en caja">Esp: €{cb.expected_cash_balance}</div>
                    </td>
                  )}

                  <td className="text-center">
                    <Badge bg={cb.session_status === "OPEN" ? "success" : "secondary"} pill>
                      {cb.session_status}
                    </Badge>
                  </td>

                  {userData?.role === "superadmin" && <td className="text-center px-4">{cb.store_name}</td>}

                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
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
            </tbody>
          </Table>
          <TablePagination
            data={cashBoxSessions}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            loadData={getCashBoxSessions}
          />
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