import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TabCategories from "../components/TabCategories";
import TabCreateEditProduct from "../components/TabCreateEditProduct";
import { TabInventory } from "../components/TabInventory";
import TabProducts from "../components/TabProducts";
import type { Product } from "../interfaces/global.interface";
import type { ActiveTab } from "../interfaces/global.types";
import type { Category } from "../interfaces/TabCategories.interface";
import { onGetCategories } from "../services/categories.services";
import { onGetProducts } from "../services/products.services";
import userStore from "../store/userStore";
import type { Inventory } from "../interfaces/TabInventory.interface";
import { onLoadInventory } from "../services/inventory.services";

export default function Products() {
  const { token } = userStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);


  useEffect(() => {
    loadProducts();
    loadCategories();
    loadInventory();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await onGetProducts(token!);
      if (res.response === "success" && res.products) {
        setProducts(res.products);
      } else {
        setProducts([]);
        toast.error("Error al cargar productos", { duration: 4000 });
      }
    } catch (error) {
      setProducts([]);
      console.error("Error fetching products:", error);
      toast.error("Error al cargar productos", { duration: 4000 });
    }
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
      const res = await onLoadInventory(token!);
      if (res.response === "success" && res.inventory) {
        setInventory(res.inventory);
      } else {
        setInventory([]);
        toast.error("Error al cargar inventario", { duration: 4000 });
      }
    } catch (error) {
      console.error(error);
      setInventory([]);
      toast.error("Error al cargar inventario", { duration: 4000 });
    }
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
          products={products}
          setProducts={setProducts}
          categories={categories}
          toast={toast}
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
          setInventory={setInventory}
          toast={toast}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
