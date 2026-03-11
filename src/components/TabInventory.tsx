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
  const inputSearchRef = useRef<HTMLInputElement | null>(null);
  const inputQuantityRef = useRef<HTMLInputElement | null>(null);
  const inputReferenceRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    form,
    onChangeForm,
    resetForm,
  } = useForm<InventoryForm>({
    product_id: "",
    quantity: "0",
    reference: "",
  });

  const existingInventory = (selectedProduct: productSearchQuery): number => {
    return inventory.findIndex(
      (inv) => inv.product_id === selectedProduct.id,
    );
  };

  const movementIN = async (selectedProduct: productSearchQuery) => {
    const existingIndex = existingInventory(selectedProduct);

    let updated;
    if (existingIndex >= 0) {
      updated = [...inventory];
      updated[existingIndex].quantity = Number(updated[existingIndex].quantity) + Number(form.quantity);
    } else {
      updated = [
        ...inventory,
        {
          id: Date.now(),
          product_id: selectedProduct.id,
          quantity: Number(form.quantity),
        },
      ];
    }
    setInventory(updated);
  }

  const movementOUT = async (selectedProduct: productSearchQuery) => {
    const existingIndex = existingInventory(selectedProduct);

    if (existingIndex >= 0) {
      if (Number(selectedProduct.inventory_quantity) === Number(form.quantity)) {
        const updated = inventory.filter((inv) => inv.product_id !== selectedProduct.id);
        setInventory(updated);
        return;
      }
      const updated = [...inventory];
      updated[existingIndex].quantity -= Number(form.quantity);
      setInventory(updated);
    }
  }

  const updateProductInventory = async (selectedProduct: productSearchQuery, type: "IN" | "OUT") => {
    if (type === "IN") {
      movementIN(selectedProduct);
    } else {
      movementOUT(selectedProduct);
    }
  }

  // Handlers para Inventario
  const handleAddInventory = async () => {
    if (!form.product_id || !form.quantity) {
      toast.error("Por favor, completa todos los campos", { duration: 4000 });
      return;
    }

    const res = await onMovement(Number(form.product_id), Number(form.quantity), "IN", form.reference, token!);
    if (res.response === "success") {
      updateProductInventory(selectedProduct!, "IN");
      toast.success(res.message, { duration: 4000 });
      resetForm();
      setSelectedProduct(null);
      inputSearchRef.current?.focus();
    } else {
      toast.error(res.message, { duration: 4000 });
    }
  };

  const handleRemoveInventory = async () => {
    if (!form.product_id || !form.quantity || form.reference.trim() === "") {
      toast.error("Por favor, completa todos los campos", { duration: 4000 });
      return;
    }

    if (Number(form.quantity) > Number(selectedProduct?.inventory_quantity)) {
      toast.error("No puedes quitar más de lo que hay en inventario", { duration: 4000 });
      return;
    }

    const res = await onMovement(Number(form.product_id), Number(form.quantity), "OUT", form.reference, token!);
    if (res.response === "success") {
      updateProductInventory(selectedProduct!, "OUT");
      toast.success("Movimiento de inventario registrado exitosamente", { duration: 4000 });
      resetForm();
      setSelectedProduct(null);
      inputSearchRef.current?.focus();
    } else {
      toast.error(res.message, { duration: 4000 });
    }
  };

  const handleKeyDownSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== "") {
      const res = await onGetProductByQuery(query.toLowerCase().trim(), token!);
      if (res.response === "success" && res.product) {
        setSelectedProduct(res.product);
        inputQuantityRef.current?.focus();
        onChangeForm(res.product.id.toString(), "product_id");
        toast.success(`Producto encontrado: ${res.product.name}`, { duration: 4000 });
        setQuery("");
      } else {
        toast.error(res.message || "Producto no encontrado", { duration: 4000 });
        inputSearchRef.current?.focus();
      }
    }
  };

  const handleKeyDownQuantity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedProduct) {
      if (e.shiftKey && e.key === "Enter") {
        handleRemoveInventory();
        inputReferenceRef.current?.focus();
      } else if (e.key === 'Enter') {
        handleAddInventory();
      }
    } else {
      toast.error("Primero selecciona un producto válido", { duration: 4000 });
      inputSearchRef.current?.focus();
    }

  };

  const handleKeyDownReference = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (selectedProduct) {
      if (e.key === "Enter" && e.shiftKey) {
        handleRemoveInventory();
      }
    } else {
      toast.error("Primero selecciona un producto válido", { duration: 4000 });
      inputSearchRef.current?.focus();
    }
  }

  const removeSelectedProduct = () => {
    setSelectedProduct(null);
    onChangeForm("", "product_id");
  }

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }
  }, []);

  return (
    <div>
      <h2>Gestionar Inventario</h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px", flex: 1, backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
          <input
            ref={inputSearchRef}
            type="text"
            value={query}
            placeholder="Código de barras o nombre..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownSearch}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
            }}
          />

          <input
            ref={inputQuantityRef}
            type="text"
            placeholder="Cantidad"
            value={form.quantity}
            onChange={(e) => {
              let value = e.target.value;
              const regex = /^[0-9]*$/;
              if (regex.test(value)) {
                onChangeForm(Number(value), "quantity")
              }
            }}
            onKeyDown={handleKeyDownQuantity}
            required
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
            }}
          />

          <textarea
            ref={inputReferenceRef}
            placeholder="Referencia obligatoria para movimientos OUT"
            value={form.reference}
            onChange={(e) => onChangeForm(e.target.value, "reference")}
            onKeyDown={handleKeyDownReference}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "98%",
              resize: "vertical",
            }}
          />

          {selectedProduct && (
            <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <button onClick={handleAddInventory} style={{ padding: "10px" }}>
                Agregar a Inventario
              </button>
              <button onClick={handleRemoveInventory} style={{ padding: "10px" }}>
                Quitar de Inventario
              </button>
            </div>
          )}
        </div>
        <div style={{ marginBottom: "20px", flex: 1, backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
          {selectedProduct ? (
            <div style={{ marginBottom: "20px" }}>
              <h3>Producto Seleccionado</h3>
              <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                <p><strong>Código de Barras:</strong> {selectedProduct.barcode}</p>
                <p><strong>Cantidad en Inventario:</strong> {Number(selectedProduct.inventory_quantity)}</p>
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
          </tr>
        </thead>
        <tbody>
          {inventory.map((inv) => {
            const product = products.find((p) => p.id === inv.product_id);
            return (
              <tr key={inv.product_id}>
                <td>{product?.name || "Producto no encontrado"}</td>
                <td>{Number(inv.quantity)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div >
  );
};
