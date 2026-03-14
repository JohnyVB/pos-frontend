import { useNavigate } from 'react-router-dom';
import useCashStore from '../../store/useCashStore';
import userStore from '../../store/userStore';
import { formatDateToShow } from '../../helper/formatDate.helper';
import { Button, Badge, Row, Col } from 'react-bootstrap';

export const PageHeader = ({ title, nav = true }: { title: string, nav?: boolean }) => {
  const navigation = useNavigate();
  const { cashBox } = useCashStore();
  const { userData } = userStore();
  
  return (
    <div className="mb-4">
      {/* Información de Sesión / Caja */}
      <Row className="mb-3 justify-content-end">
        <Col xs={12} md="auto">
          <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center bg-white p-2 border rounded shadow-sm text-secondary" style={{ fontSize: '0.85rem' }}>
            <div className="d-flex align-items-center gap-1">
              <span title="Apertura de Caja">🕒</span>
              <span className="fw-semibold">
                {cashBox ? formatDateToShow(cashBox.opened_at) : "Caja no abierta"}
              </span>
            </div>
            <div className="vr d-none d-md-block mx-1"></div>
            <div className="d-flex align-items-center gap-1">
              <span title="Usuario">👤</span>
              <span className="fw-semibold">{userData ? userData.name : "Invitado"}</span>
            </div>
            <div className="vr d-none d-md-block mx-1"></div>
            <div className="d-flex align-items-center gap-1">
              <Badge bg={userData?.role === 'ADMIN' ? 'danger' : 'primary'} className="rounded-pill">
                {userData ? userData.role : "N/A"}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Título y Navegación */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 border rounded shadow-sm">
        <div className="d-flex align-items-center" style={{ width: "120px" }}>
          {nav && (
            <Button 
              variant="outline-secondary" 
              onClick={() => navigation(-1)}
              className="fw-bold d-flex align-items-center gap-2"
              size="sm"
            >
              <span>←</span> Atrás
            </Button>
          )}
        </div>
        
        <h2 className="m-0 fw-bold text-dark text-center flex-grow-1">{title}</h2>
        
        <div style={{ width: "120px" }} /> {/* Spacer */}
      </div>
    </div>
  )
}
