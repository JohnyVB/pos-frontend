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
        style={{
          padding: "10px 20px",
          backgroundColor: activeTab === "products" ? "#007bff" : "#e9ecef",
          color: activeTab === "products" ? "white" : "black",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Productos
      </button>
      <button
        onClick={() => setActiveTab("categories")}
        style={{
          padding: "10px 20px",
          backgroundColor: activeTab === "categories" ? "#007bff" : "#e9ecef",
          color: activeTab === "categories" ? "white" : "black",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Categorías
      </button>
      <button
        onClick={() => setActiveTab("inventory")}
        style={{
          padding: "10px 20px",
          backgroundColor: activeTab === "inventory" ? "#007bff" : "#e9ecef",
          color: activeTab === "inventory" ? "white" : "black",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Inventario
      </button>
    </div>
  );
};

export default TabProducts;
