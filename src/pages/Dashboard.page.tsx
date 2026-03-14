import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { onVerifyToken } from "../services/dashboard.services";
import userStore from "../store/userStore";

export default function Dashboard() {
  const { setUserData, token, setToken } = userStore();
  const navigation = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    navigation("/");
  };

  const verifyToken = async () => {
    const data = await onVerifyToken(token!);
    if (data.response === "error") {
      handleLogout();
    }
  };

  useEffect(() => {
    verifyToken();
  }, [])

  const menuItems = [
    { label: "Nueva Venta", icon: "🛒", path: "/pos", bg: "primary" },
    { label: "Productos", icon: "📦", path: "/products", bg: "success" },
    { label: "Reporte Cajas", icon: "💶", path: "/cashbox-sessions", bg: "info" },
    { label: "Usuarios", icon: "👥", path: "/register", bg: "warning" },
    { label: "Terminales", icon: "🖥️", path: "/terminals", bg: "secondary" },
  ];

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="POS Dashboard" nav={false} />
      <Row className="g-4 mt-2 justify-content-center">
        {menuItems.map((item, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              className="h-100 shadow-sm border-0 text-center text-decoration-none"
              onClick={() => navigation(item.path)}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-5">
                <div className={`display-1 mb-3 text-${item.bg}`}>
                  <span fs-1="true">{item.icon}</span>
                </div>
                <Card.Title className="fs-4 fw-bold text-dark">{item.label}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5 justify-content-center">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Button
            variant="outline-danger"
            size="lg"
            className="w-100 fw-bold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
            style={{ borderRadius: '12px' }}
          >
            <span fs-4="true">🚪</span> Cerrar Sesión
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
