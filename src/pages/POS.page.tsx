import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import CardPaymentForm from "../components/POSPage/CardPaymentForm";
import CashPaymentKeyboard from "../components/POSPage/CashPaymentKeyboard";
import PaymentModal from "../components/POSPage/PaymentModal";
import useSounds from "../hooks/useSounds";
import type { ProductByBarcode } from "../interfaces/pages/POS.interfaces";
import { onGetProductByBarcode, onRegisterSale } from "../services/POS.services";
import userStore from "../store/userStore";
import './../css/pages/POS.css';
import { useCashStore } from "../store/useCashStore";

export default function POS() {
  const { token } = userStore();
  const [cart, setCart] = useState<ProductByBarcode[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const inputBarcodeRef = useRef<HTMLInputElement | null>(null);
  const { playSuccessSound, playErrorSound } = useSounds()
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [paymentType, setPaymentType] = useState<string>("")
  const [showCashKeyboard, setShowCashKeyboard] = useState<boolean>(false)
  const [showCardForm, setShowCardForm] = useState<boolean>(false)
  const { currentAmount, setCurrentAmount } = useCashStore()


  const searchProductByBarcode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const res = await onGetProductByBarcode(Number(barcode), token!)
      if (res.response === "success" && res.product) {
        addToCart(res.product)
        setBarcode("")
        playSuccessSound()
      } else {
        playErrorSound()
      }
    }
  };

  const addToCart = (product: ProductByBarcode) => {
    if (product.stock > 0) {
      const existing = cart.find((p) => p.id === product.id);
      if (existing) {
        setCart(cart.map((p) =>
          p.id === product.id ? { ...p, quantity: Number(p.quantity) + 1 } : p,
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    } else {
      toast.error("Producto agotado", { duration: 5000 })
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

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

  const handleCashPayment = async (amount_received: number) => {
    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      vat: item.vat,
    }));
    const body = {
      payment_method: paymentType,
      amount_received,
      cash_box_id: 1,
      items,
    }
    const res = await onRegisterSale(body, token!)
    if (res.response === "success" && res.data) {
      setCart([]);
      setShowCashKeyboard(false)
      toast.success("Pago registrado", { duration: 4000 })
      setCurrentAmount(currentAmount + Number(res.data.total))
      // TODO: imprimir ticket
    } else {
      toast.error("Error al registrar pago", { duration: 4000 })
    }
  }

  const handleCardPayment = (reference: string) => {
    setCart([]);
    setShowCardForm(false)
    toast.success("Pago registrado")
  }

  const handlePayment = (method: string) => {
    if (method === "CASH") {
      setPaymentType("CASH")
      setShowCashKeyboard(true)
    }

    if (method === "CARD") {
      setPaymentType("CARD")
      setShowCardForm(true)
    }

    setShowPaymentModal(false)
  }

  // const filteredProducts = products.filter((p) =>
  //   p.name.toLowerCase().includes(barcode.toLowerCase()),
  // );

  useEffect(() => {
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus()
    }
  }, [])


  return (
    <div className="padding-container">
      <PageHeader title="Venta" />
      <div className="pos-container">
        {/* CARRITO */}
        <div className="cart-section">
          <h2>Carrito</h2>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-item-name">{item.name}</span>
                <input
                  className="cart-item-quantity"
                  type="text"
                  value={item.quantity}
                  onChange={(e) => {
                    let value = e.target.value;
                    const regex = /^[0-9]*$/;
                    if (regex.test(value)) {
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  }}
                />
                <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                <button className="cart-item-remove" onClick={() => removeItem(item.id)}>X</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>IVA:</span>
              <span>€{vatTotal.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="checkout-btn"
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
          >
            Cobrar
          </button>
        </div>

        {/* PRODUCTOS */}
        <div className="products-section">
          <h2>Productos</h2>

          <input
            className="search-input"
            placeholder="Buscar producto..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={searchProductByBarcode}
          />

          {showCashKeyboard && (
            <CashPaymentKeyboard
              total={total}
              onConfirm={handleCashPayment}
              onCancel={() => setShowCashKeyboard(false)}
            />
          )}

          {showCardForm && (
            <CardPaymentForm
              total={total}
              onConfirm={handleCardPayment}
              onCancel={() => setShowCardForm(false)}
            />
          )}
        </div>
      </div>
      <Toaster position="top-right" />
      {showPaymentModal && (
        <PaymentModal
          total={total}
          onSelectPayment={handlePayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
