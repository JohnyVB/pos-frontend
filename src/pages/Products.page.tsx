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
import type { Category } from "../interfaces/components/ProductsPage/TabCategories.interface";
import type { Inventory } from "../interfaces/components/ProductsPage/TabInventory.interface";
import type { Product, Store } from "../interfaces/global.interface";
import { onGetCategories } from "../services/categories.services";
import { onLoadInventory } from "../services/inventory.services";
import { onGetProducts, onGetProductsWithLowStock } from "../services/products.services";
import { onGetStores } from "../services/stores.services";
import userStore from "../store/userStore";
import TabPromotions from "../components/ProductsPage/TabPromotions";
import type { Promotion } from "../interfaces/components/ProductsPage/TabPromotions.interface";
import { onGetPromotions } from "../services/promotions.services";

export default function Products() {
  const { userData } = userStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProductPage, setCurrentProductPage] = useState<number>(1);
  const [totalProductPages, setTotalProductPages] = useState<number>(1);
  const [totalProductsRecords, setTotalProductsRecords] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryPage, setCurrentCategoryPage] = useState<number>(1);
  const [totalCategoryPages, setTotalCategoryPages] = useState<number>(1);
  const [totalCategoriesRecords, setTotalCategoriesRecords] = useState<number>(0);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [currentInventoryPage, setCurrentInventoryPage] = useState<number>(1);
  const [totalInventoryPages, setTotalInventoryPages] = useState<number>(1);
  const [totalInventoryRecords, setTotalInventoryRecords] = useState<number>(0);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentPromotionPage, setCurrentPromotionPage] = useState<number>(1);
  const [totalPromotionPages, setTotalPromotionPages] = useState<number>(1);
  const [totalPromotionsRecords, setTotalPromotionsRecords] = useState<number>(0);
  const [stores, setStores] = useState<Store[]>([]);
  const { form: filterForm, onChangeForm: onChangeFilterForm, resetForm: resetFilterForm } = useForm({
    vat: null,
    min_stock: null,
    category_id: null,
    sale_type: null,
    store_id: (userData && userData?.role === "superadmin") ? null : userData?.store_id || null,
  });

  const loadProducts = async (pageLoad: number = 1, limit: number = 10, searchTerm?: string) => {
    try {
      const res = await onGetProducts(filterForm, userData?.store_id!, pageLoad, limit, searchTerm);
      if (res.response === "success" && res.products && res.pagination) {
        setProducts(res.products);
        setTotalProductPages(res.pagination.totalPages);
        setCurrentProductPage(res.pagination.page);
        setTotalProductsRecords(res.pagination.total);
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

  const loadCategories = async (pageLoad: number = 1, limit: number = 10) => {
    const res = await onGetCategories(userData?.store_id!, pageLoad, limit);
    if (res.response === "success" && res.categories && res.pagination) {
      setCategories(res.categories);
      setTotalCategoryPages(res.pagination.totalPages);
      setCurrentCategoryPage(res.pagination.page);
      setTotalCategoriesRecords(res.pagination.total);
    } else {
      setCategories([]);
      toast.error("Error al cargar categorías", { duration: 4000 });
    }
  };

  const loadInventory = async (pageLoad: number = 1, limit: number = 10) => {
    try {
      const res = await onLoadInventory(userData?.store_id!, pageLoad, limit);
      if (res.response === "success" && res.inventory && res.pagination) {
        setInventory(res.inventory);
        setTotalInventoryPages(res.pagination.totalPages);
        setCurrentInventoryPage(res.pagination.page);
        setTotalInventoryRecords(res.pagination.total);
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

  const getPromotions = async (pageLoad: number = 1, limit: number = 10) => {
    try {
      const res = await onGetPromotions(userData?.store_id!, pageLoad, limit);
      if (res.response === "success" && res.promotions && res.pagination) {
        setPromotions(res.promotions);
        setTotalPromotionPages(res.pagination.totalPages);
        setCurrentPromotionPage(res.pagination.page);
        setTotalPromotionsRecords(res.pagination.total);
      } else {
        setPromotions([]);
        toast.error("Error al cargar promociones", { duration: 4000 });
      }
    } catch (error) {
      console.error(error);
      setPromotions([]);
      toast.error("Error al cargar promociones", { duration: 4000 });
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
    loadProducts(1);
    loadCategories(1);
    loadInventory(1);
    getProductsWithLowStock();
    getPromotions(1);
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
                currentProductPage={currentProductPage}
                totalProductPages={totalProductPages}
                totalProductsRecords={totalProductsRecords}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="categories" title="Categorías">
            <Card.Body className="p-4">
              <TabCategories
                categories={categories}
                setCategories={setCategories}
                currentCategoryPage={currentCategoryPage}
                totalCategoryPages={totalCategoryPages}
                totalCategoriesRecords={totalCategoriesRecords}
                loadCategories={loadCategories}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="inventory" title="Inventario">
            <Card.Body className="p-4">
              <TabInventory
                inventory={inventory}
                setInventory={setInventory}
                getProductsWithLowStock={getProductsWithLowStock}
                currentInventoryPage={currentInventoryPage}
                totalInventoryPages={totalInventoryPages}
                totalInventoryRecords={totalInventoryRecords}
                loadInventory={loadInventory}
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
          <Tab eventKey="promotions" title={
            <div className="d-flex align-items-center justify-content-center gap-2">
              Promociones
              {promotions.filter(p => p.is_effective).length > 0 && (
                <Badge
                  pill
                  bg="success"
                  style={{ fontSize: '0.75rem' }}
                >
                  {promotions.filter(p => p.is_effective).length}
                </Badge>
              )}
            </div>
          }>
            <Card.Body className="p-4">
              <TabPromotions
                products={products}
                promotions={promotions}
                currentPromotionPage={currentPromotionPage}
                totalPromotionPages={totalPromotionPages}
                totalPromotionsRecords={totalPromotionsRecords}
                getPromotions={getPromotions}
                currentProductPage={currentProductPage}
                totalProductPages={totalProductPages}
                totalProductsRecords={totalProductsRecords}
                loadProducts={loadProducts}
              />
            </Card.Body>
          </Tab>
        </Tabs>
      </Card>
      <Toaster position="top-center" />
    </Container>
  );
}
