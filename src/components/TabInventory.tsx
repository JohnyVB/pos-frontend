import { useEffect, useRef, useState } from "react";
import { useForm } from "../hooks/useForm";
import type {
  InventoryForm,
  productSearchQuery,
  TabInventoryProps
} from "../interfaces/TabInventory.interface";
import { onGetProductByQuery, onMovement } from "../services/inventory.services";
import userStore from "../store/userStore";

export const TabInventory = ({
  products,
  inventory,
  setInventory,
  toast
}: TabInventoryProps) => {
  const { token } = userStore();
  const [query, setQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<productSearchQuery | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    form,
    onChangeForm,
    resetForm,
  } = useForm<InventoryForm>({
    product_id: "",
    quantity: 0,
    reference: "",
  });

  const updateProductInventory = async (selectedProduct: productSearchQuery) => {
    const existingIndex = inventory.findIndex(
      (inv) => inv.product_id === selectedProduct.id,
    );

    let updated;
    if (existingIndex >= 0) {
      updated = [...inventory];
      updated[existingIndex].quantity += form.quantity;
    } else {
      updated = [
        ...inventory,
        {
          id: Date.now(),
          product_id: selectedProduct.id,
          quantity: form.quantity,
        },
      ];
    }
    setInventory(updated);
  }

  // Handlers para Inventario
  const handleAddInventory = async () => {
    if (!form.product_id || !form.quantity) {
      toast.error("Por favor, completa todos los campos", { duration: 4000 });
      return;
    }

    const res = await onMovement(Number(form.product_id), form.quantity, "IN", form.reference, token!);
    if (res.response === "success") {
      updateProductInventory(selectedProduct!);
      toast.success(res.message, { duration: 4000 });
      resetForm();
      setSelectedProduct(null);
    } else {
      toast.error(res.message, { duration: 4000 });
    }
  };

  const handleDeleteInventory = (id: number) => {
    const updated = inventory.filter((inv) => inv.id !== id);
    setInventory(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== "") {
      const res = await onGetProductByQuery(query.toLowerCase().trim(), token!);
      if (res.response === "success" && res.product) {
        setSelectedProduct(res.product);
        console.log("Producto encontrado:", JSON.stringify(res.product, null, 2));
        onChangeForm(res.product.id.toString(), "product_id");
        toast.success(`Producto encontrado: ${res.product.name}`, { duration: 4000 });
        setQuery("");
      }
    }
  };

  const removeSelectedProduct = () => {
    setSelectedProduct(null);
    onChangeForm("", "product_id");
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div>
      <h2>Gestionar Inventario</h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px", flex: 1, backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Código de barras o nombre..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
            }}
          />

          <input
            type="number"
            placeholder="Cantidad"
            value={form.quantity}
            onChange={(e) => onChangeForm(e.target.value, "quantity")}
            required
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
            }}
          />

          <textarea
            placeholder="Referencia (opcional)"
            value={form.reference}
            onChange={(e) => onChangeForm(e.target.value, "reference")}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <button onClick={handleAddInventory} style={{ padding: "10px" }}>
              Agregar a Inventario
            </button>
            {selectedProduct && (
              <button onClick={handleAddInventory} style={{ padding: "10px" }}>
                Quitar de Inventario
              </button>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "20px", flex: 1, backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
          {selectedProduct ? (
            <div style={{ marginBottom: "20px" }}>
              <h3>Producto Seleccionado</h3>
              <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                <p><strong>Código de Barras:</strong> {selectedProduct.barcode}</p>
                <p><strong>Cantidad en Inventario:</strong> {selectedProduct.inventory_quantity}</p>
              </div>
              <button onClick={removeSelectedProduct} style={{ padding: "10px", marginTop: "10px", backgroundColor: "#dc3545", color: "white" }}>
                Eliminar
              </button>
            </div>
          ) : (
            <p>No hay producto seleccionado</p>
          )}
        </div>
      </div>

      <h3>Inventario Actual</h3>
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((inv) => {
            const product = products.find((p) => p.id === inv.product_id);
            return (
              <tr key={inv.product_id}>
                <td>{product?.name || "Producto no encontrado"}</td>
                <td>{inv.quantity}</td>
                <td>
                  <button
                    onClick={() => handleDeleteInventory(inv.id)}
                    style={{ backgroundColor: "#dc3545", color: "white" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div >
  );
};
