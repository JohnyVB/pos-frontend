import { Button, Modal } from "react-bootstrap"

interface Props {
  isOpen: boolean
  cashBoxId: number
  onCancel: () => void
  onConfirm: (cashBoxId: number) => void
}

export const CloseBoxModal = ({ isOpen, cashBoxId, onCancel, onConfirm }: Props) => {
  return (
    <Modal show={isOpen} onHide={onCancel} centered backdrop="static" size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Cerrar Caja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas cerrar la caja?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => onConfirm(cashBoxId)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
