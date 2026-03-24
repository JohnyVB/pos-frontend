import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onLogin } from "../services/login.services";
import userStore from "../store/userStore";
import { PageHeader } from "../components/common/PageHeader";
import toast, { Toaster } from "react-hot-toast";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

export default function Login() {
  const { setToken, setUserData } = userStore();
  const [loading, setLoading] = useState(false);
  const { user, password, onChangeForm, resetForm } = useForm({
    user: "johny_superadmin",
    password: "351723",
  });

  const handleLogin = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const data = await onLogin(user, password);
    if (data.response === "success" && data.token && data.user) {
      setToken(data.token);
      setUserData(data.user);
      resetForm();
    } else {
      toast.error(data.message || "Login failed", { duration: 4000 })
    }
    setLoading(false);
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column bg-light p-4">
      <PageHeader title="POS Local" nav={false} />

      <Row className="flex-grow-1 justify-content-center align-items-center">
        <Col xs={12} md={8} lg={5} xl={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Iniciar Sesión</h3>
                <p className="text-muted">Introduce tus credenciales para acceder al sistema</p>
              </div>

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary">Usuario o Email</Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="Escribe tu usuario"
                    value={user}
                    onChange={(e) => onChangeForm(e.target.value, "user")}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    size="lg"
                    placeholder="Escribe tu contraseña"
                    value={password}
                    onChange={(e) => onChangeForm(e.target.value, "password")}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className="fw-bold rounded-3 py-2 shadow-sm"
                  >
                    {loading ? "Entrando..." : "Entrar al POS"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-center" />
    </Container>
  );
}
