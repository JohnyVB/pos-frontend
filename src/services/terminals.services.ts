import API from "../config/api.config";
import type { getTerminalsResponse } from "../interfaces/pages/Terminals.interfaces";

export const onGetTerminals = async (store_id: string): Promise<getTerminalsResponse> => {
  try {
    const { data } = await API.get(`/terminals/${store_id}`);
    return data;
  } catch (error) {
    console.log("Error getting terminals:", error);
    return { response: "error", message: "Error al obtener terminales" };
  }
};

export const onCreateTerminal = async (name: string, store_id: string) => {
  try {
    const { data } = await API.post(`/terminals/${store_id}`, { name });
    return data;
  } catch (error) {
    console.log("Error creating terminal:", error);
    return { response: "error", message: "Error al crear terminal" };
  }
};
