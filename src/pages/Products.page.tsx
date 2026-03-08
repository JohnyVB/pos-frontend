import { useEffect, useState } from "react";
import type { Product } from "../types/global.types";
import { useForm } from "../hooks/useForm";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products.services";
import TabProducts from "../components/TabProducts";
import type { ActiveTab } from "../types/TabProducts.types";
import TabCreateEditProduct from "../components/TabCreateEditProduct";
import TabCategories from "../components/TabCategories";
import { TabInventory } from "../components/TabInventory";
import userStore from "../store/userStore";
import type { Category } from "../types/TabCategories.types";
import toast, { Toaster } from "react-hot-toast";

export default function Products() {
  const { token } = userStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);

  const { form, onChangeForm, resetForm } = useForm({
    name: "",
    barcode: "",
    price: 0,
    vat: 21,
    categoryId: 1,
    active: true,
  });

  const {
    form: inventoryForm,
    onChangeForm: onChangeInventoryForm,
    resetForm: resetInventoryForm,
  } = useForm({
    productId: "",
    quantity: "0",
  });

  useEffect(() => {
    // loadProducts();
    loadCategories();
    // loadInventory();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    try {
      // Si tienes un servicio de categorías, úsalo. Si no, simulamos con datos locales
      const stored = localStorage.getItem("categories");
      if (stored) {
        setCategories(JSON.parse(stored));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadInventory = async () => {
    try {
      const stored = localStorage.getItem("inventory");
      if (stored) {
        setInventory(JSON.parse(stored));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setEditingId(null);
      } else {
        await createProduct(form);
      }
      resetForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    }
  };

  const handleEdit = () => {
    // setEditingId(product.id!);
    // Object.keys(product).forEach((key) => {
    //   onChangeForm((product as any)[key], key as keyof Product);
    // });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Desea eliminar este producto?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm("¿Desea eliminar esta categoría?")) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      localStorage.setItem("categories", JSON.stringify(updated));
    }
  };

  // Handlers para Inventario
  const handleAddInventory = (e: any) => {
    e.preventDefault();
    if (!inventoryForm.productId || !inventoryForm.quantity) {
      alert("Complete todos los campos");
      return;
    }
    const existingIndex = inventory.findIndex(
      (inv) => inv.productId === parseInt(inventoryForm.productId as any),
    );
    let updated;
    if (existingIndex >= 0) {
      updated = [...inventory];
      updated[existingIndex].quantity += parseInt(
        inventoryForm.quantity as any,
      );
    } else {
      updated = [
        ...inventory,
        {
          id: Date.now(),
          productId: parseInt(inventoryForm.productId as any),
          quantity: parseInt(inventoryForm.quantity as any),
        },
      ];
    }
    setInventory(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
    resetInventoryForm();
  };

  const handleDeleteInventory = (id: number) => {
    const updated = inventory.filter((inv) => inv.id !== id);
    setInventory(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Productos</h1>
      <button onClick={() => window.history.back()}>Ir atrás</button>
      <br />

      {/* Tabs */}
      <TabProducts activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB PRODUCTOS */}
      {activeTab === "products" && (
        <TabCreateEditProduct
          handleSubmit={handleSubmit}
          form={form}
          onChangeForm={onChangeForm}
          editingId={editingId}
          products={products}
          resetForm={resetForm}
          setEditingId={setEditingId}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          categories={categories}
        />
      )}

      {/* TAB CATEGORÍAS */}
      {activeTab === "categories" && (
        <TabCategories
          categories={categories}
          setCategories={setCategories}
          handleDeleteCategory={handleDeleteCategory}
          toast={toast}
        />
      )}

      {/* TAB INVENTARIO */}
      {activeTab === "inventory" && (
        <TabInventory
          products={products}
          inventory={inventory}
          inventoryForm={inventoryForm}
          onChangeInventoryForm={onChangeInventoryForm}
          handleAddInventory={handleAddInventory}
          handleDeleteInventory={handleDeleteInventory}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
