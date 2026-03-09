import type { Product } from "../interfaces/global.interface";
import type { Category } from "../interfaces/TabCategories.interface";
import type { createEditForm } from "../interfaces/TabCreateEdit.interface";

type TabProductsProps = {
  handleSubmit: (e: React.FormEvent) => void;
  form: createEditForm;
  onChangeForm: (value: string, field: keyof createEditForm) => void;
  editingId: number | null;
  products: Product[];
  resetForm: () => void;
  setEditingId: (id: number | null) => void;
  handleEdit: (product: Product) => void;
  handleDelete: (id: number) => void;
  categories: Category[];
};

const TabCreateEditProduct = ({
  handleSubmit,
  form,
  onChangeForm,
  editingId,
  products,
  resetForm,
  setEditingId,
  handleEdit,
  handleDelete,
  categories,
}: TabProductsProps) => {
  return (
    <div>
      <h2>Crear/Editar Productos</h2>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", maxWidth: "400px" }}
      >
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => onChangeForm(e.target.value, "name")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          placeholder="Código de barras"
          value={form.barcode}
          onChange={(e) => onChangeForm(e.target.value, "barcode")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => onChangeForm(e.target.value, "price")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          type="number"
          placeholder="IVA"
          value={form.vat}
          onChange={(e) => onChangeForm(e.target.value, "vat")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <select
          value={form.categoryId}
          onChange={(e) => onChangeForm(e.target.value, "categoryId")}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        >
          <option value={0}>Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" style={{ padding: "10px", marginRight: "10px" }}>
          {editingId ? "Actualizar" : "Agregar"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingId(null);
            }}
            style={{ padding: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h3>Lista de Productos</h3>
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Nombre</th>
            <th>Barcode</th>
            <th>Precio</th>
            <th>IVA</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.barcode}</td>
              <td>€{p.price.toFixed(2)}</td>
              <td>{p.vat}%</td>
              <td>
                {categories.find((c) => c.id === p.categoryId)?.name || "N/A"}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(p)}
                  style={{ marginRight: "5px" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  style={{ backgroundColor: "#dc3545", color: "white" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabCreateEditProduct;
