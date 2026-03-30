import { useEffect, useState } from "react";
import { Badge, Card, Container, Tab, Tabs } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { PageHeader } from "../components/common/PageHeader";
import TabCategories from "../components/ProductsPage/TabCategories";
import TabCreateEditProduct from "../components/ProductsPage/TabCreateEditProduct";
import { TabInventory } from "../components/ProductsPage/TabInventory";
import type { LowStockProduct } from "../components/ProductsPage/TabLowStock";
import TabLowStock from "../components/ProductsPage/TabLowStock";
import { useForm } from "../hooks/useForm";
import type { Category } from "../interfaces/components/POSPage/TabCategories.interface";
import type { Inventory } from "../interfaces/components/POSPage/TabInventory.interface";
import type { Product, Store } from "../interfaces/global.interface";
import { onGetCategories } from "../services/categories.services";
import { onLoadInventory } from "../services/inventory.services";
import { onGetProducts, onGetProductsWithLowStock } from "../services/products.services";
import { onGetStores } from "../services/stores.services";
import userStore from "../store/userStore";

export default function Products() {
  const { userData } = userStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const { form: filterForm, onChangeForm: onChangeFilterForm, resetForm: resetFilterForm } = useForm({
    vat: null,
    min_stock: null,
    category_id: null,
    sale_type: null,
    store_id: (userData && userData?.role === "superadmin") ? null : userData?.store_id || null,
  });

  const loadProducts = async () => {
    try {
      const res = await onGetProducts(filterForm, userData?.store_id!);
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
    const res = await onGetCategories(userData?.store_id!);
    if (res.response === "success" && res.categories) {
      setCategories(res.categories);
    } else {
      setCategories([]);
      toast.error("Error al cargar categorías", { duration: 4000 });
    }
  };

  const loadInventory = async () => {
    try {
      const res = await onLoadInventory(userData?.store_id!);
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

  const getProductsWithLowStock = async () => {
    try {
      const data = await onGetProductsWithLowStock(userData?.store_id!);
      if (data.response === "success" && data.products) {
        setLowStockProducts(data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar productos con bajo stock", { duration: 4000 });
    }
  }

  const getStores = async () => {
    try {
      const res = await onGetStores();
      if (res.response === "success" && res.stores) {
        setStores(res.stores);
      } else {
        toast.error(res.message || "Error al obtener tiendas");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener tiendas");
    }
  };

  const handleClearFilters = async () => {
    const initialFilters = {
      vat: null,
      min_stock: null,
      category_id: null,
      sale_type: null,
      store_id: (userData && userData.role === "admin" || userData?.role === "superadmin") ? null : userData?.store_id || null,
    };
    resetFilterForm();
    const res = await onGetProducts(initialFilters, userData?.store_id!);
    if (res.response === "success" && res.products) {
      setProducts(res.products)
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadInventory();
    getProductsWithLowStock();
    if (userData?.role === "superadmin") {
      getStores();
    }
  }, [userData?.role]);

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de productos" />
      <Card className="shadow-sm border-0 mt-3">
        <Tabs
          defaultActiveKey="products"
          variant="tabs"
          justify
          fill
        >
          <Tab eventKey="products" title="Productos">
            <Card.Body className="p-4">
              <TabCreateEditProduct
                products={products}
                setProducts={setProducts}
                categories={categories}
                stores={stores}
                filterForm={filterForm}
                onChangeFilterForm={onChangeFilterForm}
                loadProducts={loadProducts}
                handleClearFilters={handleClearFilters}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="categories" title="Categorías">
            <Card.Body className="p-4">
              <TabCategories
                categories={categories}
                setCategories={setCategories}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="inventory" title="Inventario">
            <Card.Body className="p-4">
              <TabInventory
                inventory={inventory}
                setInventory={setInventory}
                getProductsWithLowStock={getProductsWithLowStock}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="low_stock" title={
            <div className="d-flex align-items-center justify-content-center gap-2">
              Bajo Stock
              {lowStockProducts.length > 0 && (
                <Badge
                  pill
                  bg="danger"
                  style={{ fontSize: '0.75rem' }}
                >
                  {lowStockProducts.length}
                </Badge>
              )}
            </div>
          }>
            <Card.Body className="p-4">
              <TabLowStock products={lowStockProducts} />
            </Card.Body>
          </Tab>
        </Tabs>
      </Card>
      <Toaster position="top-center" />
    </Container>
  );
}
