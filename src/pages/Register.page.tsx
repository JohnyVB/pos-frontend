import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import { useForm } from "../hooks/useForm";
import { onGetUsers, onRegister, onToggleUserStatus } from "../services/register.services";
import userStore from "../store/userStore";
import type { Store, User } from "../interfaces/global.interface";
import { onGetStores } from "../services/stores.services";

export default function Register() {
  const { userData } = userStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const { name, email, username, password, role, onChangeForm, resetForm } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const updateUsers = (updatedUser: User) => {
    setUsers(prev => [updatedUser, ...prev]);
  }

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name || !username || !password) {
      toast.error("Los campos nombre, usuario y contraseña son obligatorios", { duration: 4000 })
      return;
    }
    setLoading(true);
    try {
      const result = await onRegister(name, username, email, password, role, selectedStoreId || userData?.store_id!);
      if (result.response === "success" && result.user) {
        resetForm();
        toast.success("Usuario registrado correctamente", { duration: 4000 })
        updateUsers(result.user);
      } else {
        toast.error(result.message || "Error al registrar usuario", { duration: 4000 })
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar usuario", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGetUsers = async () => {
    try {
      const result = await onGetUsers(userData?.store_id!);
      if (result.response === "success" && result.users) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener usuarios", { duration: 4000 });
    }
  }

  const handleToggleStatus = async (user_id: number, current_status: boolean) => {
    try {
      const newStatus = !current_status;
      const result = await onToggleUserStatus(user_id, newStatus);
      if (result.response === "success") {
        toast.success(`Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`);
        setUsers(prev => prev.map(u => u.id === user_id ? { ...u, active: newStatus } : u));
      } else {
        toast.error(result.message || "Error al cambiar el estado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado del usuario");
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
    if (userData) {
      handleGetUsers();
      if (userData.role === "superadmin") {
        getStores();
      }
    }
  }, [userData?.role]);

  return (
    <Container fluid className="min-vh-100 bg-light p-4 d-flex flex-column gap-4">
      <PageHeader title="Registrar Trabajador" />

      {/* Formulario de Registro */}
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4 gap-2">
                <h4 className="fw-bold text-dark mb-0">Nuevo Usuario</h4>
              </div>

              <Form onSubmit={handleRegister}>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-secondary">Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        name="name"
                        value={name}
                        onChange={(e) => onChangeForm(e.target.value, "name")}
                        required
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-secondary">Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: javier_perez"
                        name="username"
                        value={username}
                        onChange={(e) => onChangeForm(e.target.value, "username")}
                        required
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-secondary">Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@example.com (opcional)"
                        name="email"
                        value={email}
                        onChange={(e) => onChangeForm(e.target.value, "email")}
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-secondary">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="******"
                        name="password"
                        value={password}
                        onChange={(e) => onChangeForm(e.target.value, "password")}
                        required
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-secondary">Rol</Form.Label>
                      <Form.Select
                        name="role"
                        value={role}
                        onChange={(e) => onChangeForm(e.target.value, "role")}
                        required
                        className="form-select-sm"
                      >
                        <option value="admin">Administrador</option>
                        <option value="cashier">Cajero</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {userData?.role === "superadmin" && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-uppercase text-secondary">Tienda</Form.Label>
                        <Form.Select
                          name="store_id"
                          value={selectedStoreId || userData?.store_id!}
                          onChange={(e) => setSelectedStoreId(e.target.value)}
                          required
                          className="form-select-sm"
                        >
                          <option value="">Seleccionar tienda</option>
                          {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={3} className="d-flex align-items-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="fw-bold rounded-3 w-100"
                    >
                      {loading ? "Registrando..." : "Registrar"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de Usuarios */}
      <Row className="justify-content-center flex-grow-1">
        <Col xs={12} lg={10} xl={8}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="py-3 px-4">Nombre / Usuario</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Rol</th>
                    {userData?.role === "superadmin" && (
                      <th className="py-3 text-center">Tienda</th>
                    )}
                    <th className="py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className={!u.active ? 'opacity-50' : ''}>
                      <td className="py-3 px-4">
                        <div className="fw-bold text-dark">{u.name}</div>
                        <small className="text-muted">@{u.username}</small>
                      </td>
                      <td className="py-3 text-muted">{u.email || "-"}</td>
                      <td className="py-3">
                        <span className={`badge rounded-pill bg-opacity-10 text-${u.role === 'admin' ? 'primary' : 'secondary'} bg-${u.role === 'admin' ? 'primary' : 'secondary'}`}>
                          {u.role === 'admin' ? 'Administrador' : 'Cajero'}
                        </span>
                      </td>
                      {userData?.role === "superadmin" && (
                        <td className="py-3 text-center">
                          <span className={`badge rounded-pill bg-opacity-10 text-${u.role === 'admin' ? 'primary' : 'secondary'} bg-${u.role === 'admin' ? 'primary' : 'secondary'}`}>
                            {u.store_name}
                          </span>
                        </td>
                      )}
                      <td className="py-3 text-center">
                        <div className="d-flex justify-content-center">
                          <Form.Check
                            type="switch"
                            id={`user-status-${u.id}`}
                            checked={u.active}
                            onChange={() => handleToggleStatus(u.id, u.active)}
                            label={u.active ? "Activo" : "Inactivo"}
                            className="fw-semibold small"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-5">
                        No hay usuarios registrados en esta tienda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-center" />
    </Container>
  );
}
