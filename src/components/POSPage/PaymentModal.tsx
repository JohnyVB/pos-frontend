import { Modal, Button } from 'react-bootstrap';

type Props = {
  isOpen: boolean
  total: number
  onSelectPayment: (method: string) => void
  onClose: () => void
}

export default function PaymentModal({ isOpen, total, onSelectPayment, onClose }: Props) {
  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-4 fw-bold">Total: €{total.toFixed(2)}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center pt-2 pb-4">
        <h5 className="mb-4 text-secondary">Seleccionar método de pago</h5>
        
        <div className="d-flex flex-column gap-3 px-4">
          <Button
            variant="success"
            size="lg"
            className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={() => onSelectPayment("CASH")}
            style={{ fontSize: '1.2rem', borderRadius: '12px' }}
          >
            <span fs-3="true">💶</span> Efectivo
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={() => onSelectPayment("CARD")}
            style={{ fontSize: '1.2rem', borderRadius: '12px' }}
          >
            <span fs-3="true">💳</span> Tarjeta
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}