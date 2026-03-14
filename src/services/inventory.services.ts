import API from "../config/api.config";
import type { InventoryMovementResponse, LoadInventoryResponse, ProductSearchResponse } from "../interfaces/components/POSPage/TabInventory.interface";

export const onMovement = async (
  product_id: number,
  quantity: number,
  type: "IN" | "OUT",
  reference: string,
  token: string
): Promise<InventoryMovementResponse> => {
  try {
    const { data } = await API.post("/inventory/movement", { product_id, quantity, type, reference }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

export const onGetProductByQuery = async (query: string, token: string): Promise<ProductSearchResponse> => {
  try {
    const { data } = await API.get(`/products/search/${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching product by query:", error);
    return { response: "error", message: "Error al buscar producto" };
  }
};

export const onLoadInventory = async (token: string): Promise<LoadInventoryResponse> => {
  try {
    const { data } = await API.get("/inventory", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error loading inventory:", error);
    return { response: "error", message: "Error al cargar inventario" };
  }
};