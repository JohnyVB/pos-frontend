import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TabCategories from "../components/TabCategories";
import TabCreateEditProduct from "../components/TabCreateEditProduct";
import { TabInventory } from "../components/TabInventory";
import TabProducts from "../components/TabProducts";
import { useForm } from "../hooks/useForm";
import type { Product } from "../interfaces/global.interface";
import type { ActiveTab } from "../interfaces/global.types";
import type { Category } from "../interfaces/TabCategories.interface";
import { onGetCategories } from "../services/categories.services";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products.services";
import userStore from "../store/userStore";

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
    loadInventory();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const res = await onGetCategories(token!);
    if (res.response === "success" && res.categories) {
      setCategories(res.categories);
    } else {
      console.error("Error fetching categories:", res.message);
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
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <button onClick={() => window.history.back()}>Ir atrás</button>
        <h1>Gestión de Productos</h1>
        <div style={{ width: "75px" }}></div>
      </div>

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
