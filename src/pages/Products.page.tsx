import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import TabCategories from "../components/ProductsPage/TabCategories";
import TabCreateEditProduct from "../components/ProductsPage/TabCreateEditProduct";
import { TabInventory } from "../components/ProductsPage/TabInventory";
import TabProducts from "../components/ProductsPage/TabProducts";
import type { Product } from "../interfaces/global.interface";
import type { ActiveTab } from "../interfaces/global.types";
import type { Category } from "../interfaces/components/POSPage/TabCategories.interface";
import type { Inventory } from "../interfaces/TabInventory.interface";
import { onGetCategories } from "../services/categories.services";
import { onLoadInventory } from "../services/inventory.services";
import { onGetProducts } from "../services/products.services";
import userStore from "../store/userStore";

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
    <div className="padding-container">
      <PageHeader title="Gestión de productos" />

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
