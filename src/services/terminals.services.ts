import API from "../config/api.config";
import type { getTerminalsResponse } from "../interfaces/pages/Terminals.interfaces";

export const onGetTerminals = async (token: string): Promise<getTerminalsResponse> => {
  try {
    const { data } = await API.get("/terminals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error getting terminals:", error);
    return { response: "error", message: "Error al obtener terminales" };
  }
};

export const onCreateTerminal = async (name: string, token: string) => {
  try {
    const { data } = await API.post("/terminals", { name }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error creating terminal:", error);
    return { response: "error", message: "Error al crear terminal" };
  }
};
