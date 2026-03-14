import type { ActiveTab } from "../../interfaces/global.types";

type TabProductsProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

const TabProducts = ({ activeTab, setActiveTab }: TabProductsProps) => {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <button
        onClick={() => setActiveTab("products")}
        className={`btn-pos ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`}
      >
        Productos
      </button>
      <button
        onClick={() => setActiveTab("categories")}
        className={`btn-pos ${activeTab === "categories" ? "btn-primary" : "btn-secondary"}`}
      >
        Categorías
      </button>
      <button
        onClick={() => setActiveTab("inventory")}
        className={`btn-pos ${activeTab === "inventory" ? "btn-primary" : "btn-secondary"}`}
      >
        Inventario
      </button>
    </div>
  );
};

export default TabProducts;
