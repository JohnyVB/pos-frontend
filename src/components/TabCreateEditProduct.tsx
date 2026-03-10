import { useState } from "react";
import { useForm } from "../hooks/useForm";
import type { Product } from "../interfaces/global.interface";
import type { createEditForm, TabProductsProps } from "../interfaces/TabCreateEdit.interface";
import { onCreateProduct, onDeleteProduct, onUpdateProduct } from "../services/products.services";
import userStore from "../store/userStore";
import { formatDateToShow } from "../helper/formatDate.helper";

const TabCreateEditProduct = ({ products, setProducts, categories, toast }: TabProductsProps) => {
  const { token } = userStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { form, onChangeForm, setFormValues, resetForm } = useForm<createEditForm>({
    name: "",
    barcode: "",
    price: 0,
    vat: 21,
    category_id: 1,
  });

  const addProductToList = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  }

  const updateProductInList = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleCreateEdit = async () => {
    try {
      if (!editingId) {
        const res = await onCreateProduct(form, token!);
        if (res.response === "success" && res.product) {
          toast.success("Producto creado exitosamente", { duration: 4000 });
          addProductToList(res.product);
        }
      } else {
        const res = await onUpdateProduct(editingId, form, token!);
        if (res.response === "success" && res.product) {
          updateProductInList(res.product);
          toast.success("Producto actualizado exitosamente", { duration: 4000 });
          setEditingId(null);
        }
      }
      resetForm();
    } catch (error: any) {
      console.error("Error en creación/edición:", error);
      toast.error("Error al crear/editar producto", { duration: 4000 });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id!);
    setFormValues({
      name: product.name,
      barcode: product.barcode,
      price: product.price,
      vat: product.vat,
      category_id: product.category_id,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await onDeleteProduct(id, token!);
      if (res.response === "success") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Producto eliminado exitosamente", { duration: 4000 });
      }
    } catch (error) {
      toast.error("Error al eliminar producto", { duration: 4000 });
    }
  };


  return (
    <div>
      <h2>Crear/Editar Productos</h2>
      <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
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
          value={form.category_id}
          onChange={(e) => onChangeForm(e.target.value, "category_id")}
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
        <button onClick={handleCreateEdit} style={{ padding: "10px", marginRight: "10px" }}>
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
      </div>

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
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.barcode}</td>
              <td>€{p.price}</td>
              <td>{p.vat}%</td>
              <td>
                {categories.find((c) => c.id === p.category_id)?.name || "N/A"}
              </td>
              <td>{formatDateToShow(p.created_at) || "N/A"}</td>
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
