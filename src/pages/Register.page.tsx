import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onRegister } from "../services/register.services";
import { PageHeader } from "../components/common/PageHeader";
import toast, { Toaster } from "react-hot-toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const { name, email, username, password, role, onChangeForm, resetForm } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !username || !password) {
      toast.error("Los campos nombre, usuario y contraseña son obligatorios", { duration: 4000 })
      return;
    }
    setLoading(true);
    try {
      const result = await onRegister(name, username, email, password, role);
      if (result.response === "error") {
        toast.error(result.message || "Error al registrar usuario", { duration: 4000 })
        setLoading(false);
        return;
      }
      resetForm();
      toast.success("Usuario registrado correctamente", { duration: 4000 })
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar usuario", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 bg-light p-4 d-flex flex-column">
      <PageHeader title="Registrar Trabajador" />
      
      <Row className="flex-grow-1 justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark mb-2">Nuevo Usuario</h3>
                <p className="text-muted">Crea una cuenta para un nuevo empleado en el sistema</p>
              </div>

              <Form onSubmit={handleRegister}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary">Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        name="name"
                        value={name}
                        onChange={(e) => onChangeForm(e.target.value, "name")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary">Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: jperez"
                        name="username"
                        value={username}
                        onChange={(e) => onChangeForm(e.target.value, "username")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary">Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@example.com (opcional)"
                        name="email"
                        value={email}
                        onChange={(e) => onChangeForm(e.target.value, "email")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="******"
                        name="password"
                        value={password}
                        onChange={(e) => onChangeForm(e.target.value, "password")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary">Rol del Usuario</Form.Label>
                      <Form.Select
                        name="role"
                        value={role}
                        onChange={(e) => onChangeForm(e.target.value, "role")}
                        required
                      >
                        <option value="admin">Administrador</option>
                        <option value="cashier">Cajero</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-4">
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit" 
                        disabled={loading}
                        className="fw-bold rounded-3 py-2 shadow-sm"
                      >
                        {loading ? "Registrando..." : "Registrar Usuario"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
}
