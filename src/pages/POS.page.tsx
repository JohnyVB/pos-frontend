import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import './../css/pages/POS.css';

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
    <div className="padding-container">
      <PageHeader title="Venta" />
      <div className="pos-container">
        {/* CARRITO */}
        <div className="cart-section">
          <h2>Carrito</h2>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-item-quantity">{item.quantity} {item.sale_type === "WEIGHT" ? "kg" : "ud"}</span>
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price-unit">{item.price} €/{item.sale_type === "WEIGHT" ? "kg" : "ud"}</span>
                <span className="cart-item-price">€{item.total?.toFixed(2)}</span>
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
            disabled={
              cart.length === 0 || showWeightForm || showCashForm || showCardForm
            }
          >
            Cobrar
          </button>
        </div>

        {/* PRODUCTOS */}
        <div className="products-section">
          <h2>Productos</h2>

          <input
            ref={inputBarcodeRef}
            className="search-input"
            placeholder="Codigo de barras o codigo interno"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={searchProductByBarcode}
          />

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
        </div>
      </div>
      <Toaster position="top-right" />
      <PaymentModal
        isOpen={showPaymentModal}
        total={total}
        onSelectPayment={handlePayment}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
