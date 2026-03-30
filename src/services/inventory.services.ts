import API from "../config/api.config";
import type { InventoryMovementResponse, LoadInventoryResponse, ProductSearchResponse } from "../interfaces/components/POSPage/TabInventory.interface";

export const onMovement = async (
  product_id: number,
  quantity: number,
  cost_price: number,
  type: "IN" | "OUT",
  reference: string,
  store_id: string,
): Promise<InventoryMovementResponse> => {
  try {
    const { data } = await API.post(`/inventory/movement/${store_id}`, { product_id, quantity, type, reference, cost_price });
    return data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

export const onGetProductByQuery = async (query: string, store_id: string): Promise<ProductSearchResponse> => {
  try {
    const { data } = await API.get(`/products/search/${encodeURIComponent(query)}/${store_id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product by query:", error);
    return { response: "error", message: "Error al buscar producto" };
  }
};

export const onLoadInventory = async (store_id: string): Promise<LoadInventoryResponse> => {
  try {
    const { data } = await API.get(`/inventory/${store_id}`);
    return data;
  } catch (error) {
    console.error("Error loading inventory:", error);
    return { response: "error", message: "Error al cargar inventario" };
  }
};