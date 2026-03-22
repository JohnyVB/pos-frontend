import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PageHeader } from "../components/common/PageHeader";
import useCashStore from "../store/useCashStore";
import { useForm } from "../hooks/useForm";
import userStore from "../store/userStore";
import { formatPriceValue } from "../helper/formatPriceValue.helper";
import { onCreateMovement } from "../services/cash-movements.services";
import toast, { Toaster } from "react-hot-toast";
import type { CashMovementBody } from "../interfaces/pages/CashMovements.interface";

export default function CashMovements() {
  const { userData } = userStore();
  const { cashBoxSession } = useCashStore();
  const { currentAmount, setCurrentAmount } = useCashStore();
  const { form, onChangeForm, resetForm } = useForm<CashMovementBody>({
    type: "IN",
    amount: "",
    reason: "",
  });

  const handlePriceValue = (value: string) => {
    const numValue = formatPriceValue(value)
    if (numValue || numValue === "") {
      if (Number(numValue) > Number(currentAmount) && form.type === "OUT") {
        toast.error("El monto no puede ser mayor al saldo actual");
        return;
      }
      onChangeForm(numValue, "amount")
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await onCreateMovement(userData?.store_id!, cashBoxSession!.session_id, form)
      if (result?.response === "success") {
        toast.success("Movimiento creado exitosamente");
        if (form.type === "IN") {
          setCurrentAmount((Number(currentAmount) + Number(form.amount)).toFixed(2))
        } else {
          setCurrentAmount((Number(currentAmount) - Number(form.amount)).toFixed(2))
        }
        resetForm();
      } else {
        toast.error("Error al crear el movimiento");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear el movimiento");
    }
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Movimientos de Caja" nav={true} />

      <Row className="mt-4 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4 p-3 bg-info bg-opacity-10 rounded">
                <h4 className="text-info fw-bold mb-1">Caja Actual</h4>
                <h2 className="display-4 fw-bold text-dark mb-0">$ {currentAmount}</h2>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="movementType">
                  <Form.Label className="fw-bold">Tipo de Movimiento</Form.Label>
                  <Form.Select size="lg" value={form.type} onChange={(e) => onChangeForm(e.target.value, "type")}>
                    <option value="IN">Entrada (Ingreso)</option>
                    <option value="OUT">Salida (Egreso)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="amount">
                  <Form.Label className="fw-bold">Monto</Form.Label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0 fw-bold text-secondary">$</span>
                    <Form.Control
                      type="text"
                      placeholder="0.00"
                      className="border-start-0"
                      value={form.amount?.toString()}
                      onChange={(e) => handlePriceValue(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="reason">
                  <Form.Label className="fw-bold">Motivo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe el motivo del movimiento..."
                    style={{ resize: "none" }}
                    value={form.reason}
                    onChange={(e) => onChangeForm(e.target.value, "reason")}
                  />
                </Form.Group>

                <Row className="mt-5">
                  <Col xs={6}>
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      className="w-100 py-3 fw-bold"
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 py-3 fw-bold"
                    >
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-center" />
    </Container>
  );
}
