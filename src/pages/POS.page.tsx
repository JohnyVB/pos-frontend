import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import API from "../config/api.config";
import type { ProductByBarcode } from "../interfaces/POS.interfaces";
import { onGetProductByBarcode } from "../services/POS.services";
import userStore from "../store/userStore";
import './../css/pages/POS.css';
import useSounds from "../hooks/useSounds";

export default function POS() {
  const { token } = userStore();
  // const [products, setProducts] = useState<ProductByBarcode[]>([]);
  const [cart, setCart] = useState<ProductByBarcode[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const inputBarcodeRef = useRef<HTMLInputElement | null>(null);
  const { playSuccessSound, playErrorSound } = useSounds()


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

  const handleCheckout = async () => {
    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    await API.post("/sales", {
      items,
      paymentType: "CASH",
      cashBoxId: 1,
    });

    setCart([]);
    alert("Venta registrada");
  };

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

          {/* <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <b>{product.name}</b>
                <p>€{product.price}</p>
                <button onClick={() => addToCart(product)}>Agregar</button>
              </div>
            ))}
          </div> */}
        </div>

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

          <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
            Cobrar
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
