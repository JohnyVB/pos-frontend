import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Container, Card, Nav } from "react-bootstrap";
import { PageHeader } from "../components/common/PageHeader";
import TabCategories from "../components/ProductsPage/TabCategories";
import TabCreateEditProduct from "../components/ProductsPage/TabCreateEditProduct";
import { TabInventory } from "../components/ProductsPage/TabInventory";
import type { Category } from "../interfaces/components/POSPage/TabCategories.interface";
import type { Inventory } from "../interfaces/components/POSPage/TabInventory.interface";
import type { Product } from "../interfaces/global.interface";
import type { ActiveTab } from "../interfaces/global.types";
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
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Gestión de productos" />

      <Card className="shadow-sm border-0 mt-3">
        <Card.Header className="bg-white border-bottom-0 pt-3 pb-0 px-4">
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k as ActiveTab)}>
            <Nav.Item>
              <Nav.Link eventKey="products" className="fw-bold fs-5 px-4 text-dark">
                Productos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="categories" className="fw-bold fs-5 px-4 text-dark">
                Categorías
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="inventory" className="fw-bold fs-5 px-4 text-dark">
                Inventario
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body className="p-4">
          {activeTab === "products" && (
            <TabCreateEditProduct
              products={products}
              setProducts={setProducts}
              categories={categories}
              toast={toast}
            />
          )}

          {activeTab === "categories" && (
            <TabCategories
              categories={categories}
              setCategories={setCategories}
              toast={toast}
            />
          )}

          {activeTab === "inventory" && (
            <TabInventory
              products={products}
              inventory={inventory}
              setInventory={setInventory}
              toast={toast}
            />
          )}
        </Card.Body>
      </Card>

      <Toaster position="top-right" />
    </Container>
  );
}
