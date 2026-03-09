import { useEffect, useState } from "react";
import API from "../config/api.config";
import type { CartItem, Product } from "../interfaces/global.interface";

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", gap: "40px" }}>
      {/* PRODUCTOS */}

      <div style={{ width: "50%" }}>
        <h2>Productos</h2>

        <input
          placeholder="Buscar producto..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "5px",
            }}
          >
            <b>{product.name}</b>

            <p>€{product.price}</p>

            <button onClick={() => addToCart(product)}>Agregar</button>
          </div>
        ))}
      </div>

      {/* CARRITO */}

      <div style={{ width: "50%" }}>
        <h2>Carrito</h2>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid gray",
              marginBottom: "10px",
            }}
          >
            {item.name}
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            />
            €{(item.price * item.quantity).toFixed(2)}
            <button onClick={() => removeItem(item.id)}>X</button>
          </div>
        ))}

        <hr />

        <p>Subtotal: €{subtotal.toFixed(2)}</p>

        <p>IVA: €{vatTotal.toFixed(2)}</p>

        <h3>Total: €{total.toFixed(2)}</h3>

        <button onClick={handleCheckout}>Cobrar</button>
      </div>
    </div>
  );
}
