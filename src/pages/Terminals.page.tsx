import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import type { Terminal } from "../interfaces/global.interface";
import { onCreateTerminal, onGetTerminals } from "../services/terminals.services";
import userStore from "../store/userStore";

export default function Terminals() {
  const { userData } = userStore();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [newTerminalName, setNewTerminalName] = useState("");
  const [loading, setLoading] = useState(false);

  const getTerminals = async () => {
    const res = await onGetTerminals(userData?.store_id!);
    if (res.response === "success" && res.terminals) {
      setTerminals(res.terminals);
    }
  };

  const handleCreateTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerminalName.trim()) return;

    setLoading(true);
    const res = await onCreateTerminal(newTerminalName, userData?.store_id!);
    if (res.response === "success") {
      toast.success("Terminal creada correctamente");
      setNewTerminalName("");
      getTerminals();
    } else {
      toast.error(res.message || "Error al crear terminal");
    }
    setLoading(false);
  };

  useEffect(() => {
    getTerminals();
  }, []);

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de Terminales (Cajas Físicas)" />

      <Card className="shadow-sm border-0 mb-4 bg-white mt-3">
        <Card.Body className="p-4">
          <h5 className="mb-3 fw-bold">Nueva Terminal</h5>
          <Form onSubmit={handleCreateTerminal}>
            <Row className="align-items-end g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-secondary small text-uppercase">Nombre de la terminal</Form.Label>
                  <Form.Control
                    placeholder="Ej: Terminal 01 o Caja Principal"
                    value={newTerminalName}
                    onChange={(e) => setNewTerminalName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Terminal"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">Nombre de la Terminal</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 text-muted"><small>#{t.id}</small></td>
                  <td className="fw-semibold">{t.name}</td>
                  <td className="text-center px-4">
                    <span className="text-muted small">Configurada</span>
                  </td>
                </tr>
              ))}
              {terminals.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-5">
                    No hay terminales registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Toaster position="top-center" />
    </Container>
  );
}
