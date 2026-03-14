import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { PageHeader } from "../components/common/PageHeader";
import CardPaymentForm from "../components/POSPage/CardPaymentForm";
import CashPaymentForm from "../components/POSPage/CashPaymentForm";
import PaymentModal from "../components/POSPage/PaymentModal";
import WeightForm from "../components/POSPage/WeightForm";
import useSounds from "../hooks/useSounds";
import type { ProductByBarcode } from "../interfaces/pages/POS.interfaces";
import { onGetProductByBarcode, onRegisterSale } from "../services/POS.services";
import useCashStore from "../store/useCashStore";
import userStore from "../store/userStore";

export default function POS() {
  const { token } = userStore();
  const [cart, setCart] = useState<ProductByBarcode[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const inputBarcodeRef = useRef<HTMLInputElement | null>(null);
  const { playSuccessSound, playErrorSound } = useSounds()
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [paymentType, setPaymentType] = useState<string>("")
  const [showCashForm, setShowCashForm] = useState<boolean>(false)
  const [showCardForm, setShowCardForm] = useState<boolean>(false)
  const { cashBox, currentAmount, setCurrentAmount } = useCashStore()
  const [showWeightForm, setShowWeightForm] = useState<boolean>(false)
  const [productWeight, setProductWeight] = useState<ProductByBarcode | null>(null)

  const searchProductByBarcode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const res = await onGetProductByBarcode(Number(barcode), token!)
      if (res.response === "success" && res.product) {
        if (res.product.sale_type === "WEIGHT") {
          setProductWeight(res.product)
          setShowWeightForm(true)
          return
        }
        addToCart(res.product)
        setBarcode("")
      } else {
        playErrorSound()
      }
    }
  };

  const addToCart = (product: ProductByBarcode, weight?: number) => {
    if (Number(product.stock) > 0) {
      const existingInCart = cart.find((p) => p.id === product.id);
      if (existingInCart) {
        if (Number(product.stock) >= Number(existingInCart?.quantity!)) {
          const quantity = weight ? Number(weight) + Number(existingInCart?.quantity) : Number(existingInCart?.quantity) + 1
          const total = (Number(quantity) * Number(product.price))
          setCart(cart.map((p) =>
            p.id === product.id ? {
              ...p,
              quantity,
              total
            } : p,
          ));
          playSuccessSound()
          inputBarcodeRef.current?.focus()
        } else {
          toast.error("Producto agotado", { duration: 5000 })
          playErrorSound()
        }
      } else {
        const total = Number(product.price) * Number(weight ? weight : 1)
        setCart([...cart, { ...product, quantity: weight ? Number(weight) : 1, total }]);
        playSuccessSound()
        inputBarcodeRef.current?.focus()
      }
    } else {
      toast.error("Producto agotado", { duration: 5000 })
      playErrorSound()
    }
  };

  const handleWeightConfirm = (weight: number) => {
    if (!productWeight) return;
    if (Number(productWeight.stock) >= Number(weight)) {
      addToCart(productWeight, weight)
      setShowWeightForm(false)
      setProductWeight(null)
      setBarcode("")
    } else {
      toast.error("Stock insuficiente", { duration: 5000 })
      playErrorSound()
    }
  }

  const removeItem = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const vatTotal = cart.reduce(
    (acc, item) => acc + (item.price * item.quantity * item.vat) / 100,
    0,
  );

  const total = subtotal + vatTotal;

  const filteredProducts = () => {
    return cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      vat: item.vat,
    }));
  }

  const handleCashPayment = async (amount_received: number) => {
    const items = filteredProducts()
    const body = {
      payment_method: paymentType,
      amount_received,
      reference: null,
      cash_box_id: cashBox!.id,
      items,
    }
    const res = await onRegisterSale(body, token!)
    if (res.response === "success" && res.data) {
      setCart([]);
      setShowCashForm(false)
      toast.success("Pago registrado", { duration: 4000 })
      setCurrentAmount(Number((Number(currentAmount) + Number(res.data.total)).toFixed(2)));
      // TODO: imprimir ticket
    } else {
      toast.error("Error al registrar pago", { duration: 4000 })
    }
  }

  const handleCardPayment = async (reference: string) => {
    const items = filteredProducts()
    const body = {
      payment_method: paymentType,
      amount_received: 0,
      reference,
      cash_box_id: cashBox!.id,
      items,
    }
    const res = await onRegisterSale(body, token!)
    if (res.response === "success" && res.data) {
      setCart([]);
      setShowCardForm(false)
      toast.success("Pago registrado", { duration: 4000 })
      setCurrentAmount(currentAmount + Number(res.data.total))
      // TODO: imprimir ticket
    } else {
      toast.error("Error al registrar pago", { duration: 4000 })
    }
  }

  const handlePayment = (method: string) => {
    if (method === "CASH") {
      setPaymentType("CASH")
      setShowCashForm(true)
      setShowCardForm(false)
    }

    if (method === "CARD") {
      setPaymentType("CARD")
      setShowCardForm(true)
      setShowCashForm(false)
    }
    setBarcode("")
    setShowPaymentModal(false)
  }

  useEffect(() => {
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus()
    }
  }, [])

  return (
    <Container fluid className="p-4" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Venta" />
      <Row className="flex-grow-1 overflow-hidden gx-4">
        {/* LADO IZQUIERDO: CARRITO */}
        <Col md={6} lg={5} className="d-flex flex-column h-100">
          <Card className="h-100 shadow-sm border-0 d-flex flex-column">
            <Card.Header className="bg-white border-bottom py-3">
              <h4 className="m-0 fw-bold">Carrito</h4>
            </Card.Header>

            <Card.Body className="overflow-auto flex-grow-1 p-3" style={{ backgroundColor: '#f8fafc' }}>
              <div className="d-flex flex-column gap-2">
                {cart.map((item) => (
                  <Card key={item.id} className="border-0 shadow-sm">
                    <Card.Body className="p-3 d-flex align-items-center justify-content-between gap-3">
                      <div className="fw-bold px-2 py-1 bg-light rounded" style={{ minWidth: "60px", textAlign: "center" }}>
                        {item.quantity} <span className="text-muted small">{item.sale_type === "WEIGHT" ? "kg" : "ud"}</span>
                      </div>
                      <div className="flex-grow-1 text-truncate fw-semibold">
                        {item.name}
                      </div>
                      <div className="text-muted small text-end" style={{ minWidth: "90px" }}>
                        {item.price} €/{item.sale_type === "WEIGHT" ? "kg" : "ud"}
                      </div>
                      <div className="fw-bold text-primary text-end fs-5" style={{ minWidth: "80px" }}>
                        €{item.total?.toFixed(2)}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="fw-bold border-0"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
                {cart.length === 0 && (
                  <div className="text-center text-muted my-5 pb-5">
                    <p className="fs-5">El carrito está vacío</p>
                    <p className="small">Escanea un producto para empezar</p>
                  </div>
                )}
              </div>
            </Card.Body>

            <Card.Footer className="bg-white border-top-0 p-4 shadow-sm" style={{ zIndex: 10 }}>
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Subtotal:</span>
                <span className="fw-semibold">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-3">
                <span>IVA:</span>
                <span className="fw-semibold">€{vatTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
                <span className="fs-4 fw-bold">Total:</span>
                <span className="fs-2 fw-bold text-dark">€{total.toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 py-3 fw-bold shadow-sm"
                style={{ fontSize: '1.25rem' }}
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0 || showWeightForm || showCashForm || showCardForm}
              >
                C O B R A R
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* LADO DERECHO: PRODUCTOS / ESCÁNER */}
        <Col md={6} lg={7} className="d-flex flex-column h-100">
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Escáner de Productos</h4>
            <InputGroup size="lg" className="shadow-sm">
              <InputGroup.Text className="bg-white text-muted border-end-0 px-4">
                <span fs-5="true">🔍</span>
              </InputGroup.Text>
              <Form.Control
                ref={inputBarcodeRef}
                placeholder="Escanea el código de barras o ingresa código interno..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={searchProductByBarcode}
                className="border-start-0 py-3 bg-white"
                style={{ fontSize: '1.1rem' }}
              />
            </InputGroup>
            <Form.Text className="text-muted mt-2 d-block ms-1">
              Presiona Enter después de ingresar el código manualmente. El escáner lo hará automáticamente.
            </Form.Text>
          </div>

          <CashPaymentForm
            isOpen={showCashForm}
            total={total}
            onConfirm={handleCashPayment}
            onCancel={() => {
              setShowCashForm(false)
              inputBarcodeRef.current?.focus()
            }}
          />

          <CardPaymentForm
            isOpen={showCardForm}
            total={total}
            onConfirm={handleCardPayment}
            onCancel={() => {
              setShowCardForm(false)
              inputBarcodeRef.current?.focus()
            }}
          />

          <WeightForm
            isOpen={showWeightForm}
            product={productWeight!}
            onConfirm={handleWeightConfirm}
            onClose={() => {
              setShowWeightForm(false)
              inputBarcodeRef.current?.focus()
            }}
          />
        </Col>
      </Row>

      <Toaster position="top-center" />
      <PaymentModal
        isOpen={showPaymentModal}
        total={total}
        onSelectPayment={handlePayment}
        onClose={() => setShowPaymentModal(false)}
      />
    </Container>
  );
}

