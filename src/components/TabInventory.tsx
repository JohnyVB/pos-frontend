import React from "react";
import type { Product } from "../interfaces/global.interface";
import type {
  inventoryFormType,
  inventoryType,
} from "../interfaces/TabInventory.interface";

type TabInventoryProps = {
  products: Product[];
  inventory: inventoryType[];
  inventoryForm: inventoryFormType;
  onChangeInventoryForm: (
    value: string,
    field: keyof inventoryFormType,
  ) => void;
  handleAddInventory: (e: React.FormEvent) => void;
  handleDeleteInventory: (id: number) => void;
};

export const TabInventory = ({
  products,
  inventory,
  inventoryForm,
  onChangeInventoryForm,
  handleAddInventory,
  handleDeleteInventory,
}: TabInventoryProps) => {
  return (
    <div>
      <h2>Gestionar Inventario</h2>
      <form
        onSubmit={handleAddInventory}
        style={{ marginBottom: "20px", maxWidth: "400px" }}
      >
        <select
          value={inventoryForm.productId}
          onChange={(e) => onChangeInventoryForm(e.target.value, "productId")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        >
          <option value="">Seleccionar Producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={inventoryForm.quantity}
          onChange={(e) => onChangeInventoryForm(e.target.value, "quantity")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          Agregar a Inventario
        </button>
      </form>

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
          {inventory.map((inv, index) => {
            const product = products.find((p) => p.id === inv.productId);
            return (
              <tr key={index}>
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
    </div>
  );
};
