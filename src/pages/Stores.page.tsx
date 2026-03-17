import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import { useForm } from "../hooks/useForm";
import type { Store } from "../interfaces/global.interface";
import type { storeForm } from "../interfaces/pages/Stores.interfaces";
import { onCreateStore, onGetStores } from "../services/stores.services";
import userStore from "../store/userStore";

export default function Stores() {
  const { token } = userStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { form, onChangeForm, resetForm } = useForm<storeForm>({
    name: "",
    address: "",
    city: "",
    phone: "",
    cif_nif: "",
    legal_name: "",
    zip_code: "",
  });

  const getStores = async () => {
    const res = await onGetStores(token!);
    if (res.response === "success") {
      setStores(res.stores || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await onCreateStore(form, token!);
    if (res.response === "success") {
      toast.success("Tienda creada correctamente");
      handleCloseModal();
    } else {
      toast.error(res.message || "Error al crear tienda");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    // const res = await onDeleteStore(id, token!);
    // if (res.response === "success") {
    //   toast.success("Tienda eliminada");
    // } else {
    //   toast.error(res.message || "Error al eliminar tienda");
    // }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de Tiendas" />
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" className="fw-bold shadow-sm" onClick={() => setShowModal(true)}>
          + Nueva Tienda
        </Button>
      </div>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3">Nombre / Razón Social</th>
                <th className="py-3">CIF/NIF</th>
                <th className="py-3">Contacto</th>
                <th className="text-center py-3">Estado</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td className="d-flex flex-column">
                    <div className="fw-bold">{s.name}</div>
                    <small className="text-muted">{s.legal_name}</small>
                    <small className="text-muted">{s.id}</small>
                  </td>
                  <td>{s.cif_nif}</td>
                  <td>
                    <div>{s.phone}</div>
                    <small className="text-muted">{s.city}</small>
                  </td>
                  <td className="text-center">
                    <span className={`badge bg-${s.is_active ? 'success' : 'danger'}`}>
                      {s.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="text-center px-4">
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No hay tiendas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            Nueva Tienda
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Nombre Comercial</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={(e) => onChangeForm(e.target.value, "name")}
                    required
                    placeholder="Ej: Sucursal Centro"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">CIF / NIF</Form.Label>
                  <Form.Control
                    name="cif_nif"
                    value={form.cif_nif}
                    onChange={(e) => onChangeForm(e.target.value, "cif_nif")}
                    required
                    placeholder="Identificación Fiscal"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Razón Social</Form.Label>
                  <Form.Control
                    name="legal_name"
                    value={form.legal_name}
                    onChange={(e) => onChangeForm(e.target.value, "legal_name")}
                    placeholder="Ej: Mi Empresa S.L."
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Dirección</Form.Label>
                  <Form.Control
                    name="address"
                    value={form.address}
                    onChange={(e) => onChangeForm(e.target.value, "address")}
                    placeholder="Calle, número, etc."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Código Postal</Form.Label>
                  <Form.Control
                    name="zip_code"
                    value={form.zip_code}
                    onChange={(e) => onChangeForm(e.target.value, "zip_code")}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Ciudad</Form.Label>
                  <Form.Control
                    name="city"
                    value={form.city}
                    onChange={(e) => onChangeForm(e.target.value, "city")}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary">Teléfono</Form.Label>
                  <Form.Control
                    name="phone"
                    value={form.phone}
                    onChange={(e) => onChangeForm(e.target.value, "phone")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 p-4">
            <Button variant="light" onClick={handleCloseModal} className="fw-bold">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading} className="fw-bold px-4 shadow-sm">
              {loading ? "Guardando..." : "Crear Tienda"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Toaster position="top-center" />
    </Container>
  );
}
