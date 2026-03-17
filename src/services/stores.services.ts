import API from "../config/api.config";
import type { getStoresResponse, storeForm } from "../interfaces/pages/Stores.interfaces";

export const onGetStores = async (token: string): Promise<getStoresResponse> => {
  try {
    const { data } = await API.get("/stores", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error getting stores:", error);
    return { response: "error", message: "Error al obtener tiendas" };
  }
};

export const onCreateStore = async (storeData: storeForm, token: string) => {
  try {
    const { data } = await API.post("/stores", storeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error creating store:", error);
    return { response: "error", message: "Error al crear tienda" };
  }
};
