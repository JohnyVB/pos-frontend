import API from "../config/api.config";
import type { createStoreResponse, getStoresResponse, storeForm } from "../interfaces/pages/Stores.interfaces";

export const onGetStores = async (): Promise<getStoresResponse> => {
  try {
    const { data } = await API.get("/stores");
    return data;
  } catch (error) {
    console.log("Error getting stores:", error);
    return { response: "error", message: "Error al obtener tiendas" };
  }
};

export const onCreateStore = async (storeData: storeForm): Promise<createStoreResponse> => {
  try {
    const { data } = await API.post("/stores", storeData);
    return data;
  } catch (error) {
    console.log("Error creating store:", error);
    return { response: "error", message: "Error al crear tienda" };
  }
};
