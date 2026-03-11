import { useEffect, useRef, useState } from "react";
import { useForm } from "../hooks/useForm";
import type { Product } from "../interfaces/global.interface";
import type { createEditForm, TabProductsProps } from "../interfaces/TabCreateEdit.interface";
import { onCreateProduct, onDeleteProduct, onUpdateProduct } from "../services/products.services";
import userStore from "../store/userStore";
import { formatDateToShow } from "../helper/formatDate.helper";

const TabCreateEditProduct = ({ products, setProducts, categories, toast }: TabProductsProps) => {
  const { token } = userStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputNameRef = useRef<HTMLInputElement | null>(null);
  const inputBarcodeRef = useRef<HTMLInputElement | null>(null);
  const inputPriceRef = useRef<HTMLInputElement | null>(null);
  const inputVatRef = useRef<HTMLInputElement | null>(null);
  const inputCategoryRef = useRef<HTMLSelectElement | null>(null);
  const { form, onChangeForm, setFormValues, resetForm } = useForm<createEditForm>({
    name: "",
    barcode: "",
    price: "0",
    vat: "21",
    category_id: "1",
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
          inputBarcodeRef.current?.focus();
        }
      } else {
        const res = await onUpdateProduct(editingId, form, token!);
        if (res.response === "success" && res.product) {
          updateProductInList(res.product);
          toast.success("Producto actualizado exitosamente", { duration: 4000 });
          setEditingId(null);
          inputBarcodeRef.current?.focus();
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
      price: String(product.price),
      vat: String(product.vat),
      category_id: String(product.category_id),
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    nextRef?: React.RefObject<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === "Enter") {
      if (nextRef) {
        nextRef.current.focus()
      } else {
        handleCreateEdit()
      }

    }
  }

  const valueAjustment = (value: string, field: keyof createEditForm) => {
    if (field === "price") {
      value = value.replace(',', '.');
      const regex = /^\d*(\.\d{0,2})?$/;
      if (value === "" || value === "." || regex.test(value)) {
        onChangeForm(value, field);
      }
    } else if (field === "vat") {
      const numericValue = value.replace(/\D/g, '');
      onChangeForm(numericValue, field);
    } else {
      onChangeForm(value, field);
    }
  }

  useEffect(() => {
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus();
    }
  }, [])

  return (
    <div>
      <h2>Crear/Editar Productos</h2>
      <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
        <input
          ref={inputBarcodeRef}
          placeholder="Código de barras"
          value={form.barcode}
          onChange={(e) => valueAjustment(e.target.value, "barcode")}
          onKeyDown={(e) => handleKeyDown(e, inputNameRef as React.RefObject<HTMLInputElement>)}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          ref={inputNameRef}
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => valueAjustment(e.target.value, "name")}
          onKeyDown={(e) => handleKeyDown(e, inputPriceRef as React.RefObject<HTMLInputElement>)}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          ref={inputPriceRef}
          type="text"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => valueAjustment(e.target.value, "price")}
          onKeyDown={(e) => handleKeyDown(e, inputVatRef as React.RefObject<HTMLInputElement>)}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          ref={inputVatRef}
          type="text"
          placeholder="IVA"
          value={form.vat}
          onChange={(e) => valueAjustment(e.target.value, "vat")}
          onKeyDown={(e) => handleKeyDown(e, inputCategoryRef as React.RefObject<HTMLSelectElement>)}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <select
          ref={inputCategoryRef}
          value={form.category_id}
          onChange={(e) => valueAjustment(e.target.value, "category_id")}
          onKeyDown={(e) => handleKeyDown(e)}
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
