import API from "../config/api.config";
import type { getUsersResponse, registerResponse } from "../interfaces/pages/Register.interface";

export const onRegister = async (
  name: string,
  username: string,
  email: string,
  password: string,
  role: string,
  store_id: string,
): Promise<registerResponse> => {
  try {
    const { data } = await API.post<registerResponse>("/users/register", {
      name,
      username,
      email,
      password,
      role,
      store_id,
    });
    return data;
  } catch (error: any) {
    console.log("Registration failed:", error);
    return { response: "error", message: error.response.data.message };
  }
};

export const onGetUsers = async (store_id: string): Promise<getUsersResponse> => {
  try {
    const { data } = await API.get<getUsersResponse>(`/users/${store_id}`);
    return data;
  } catch (error: any) {
    console.log("Get users failed:", error);
    return { response: "error", message: "Error al obtener usuarios" };
  }
}

export const onToggleUserStatus = async (user_id: number, active: boolean): Promise<registerResponse> => {
  try {
    const { data } = await API.patch<registerResponse>(`/users/toggle-status/${user_id}`, {
      active,
    });
    return data;
  } catch (error: any) {
    console.log("Toggle user status failed:", error);
    return { response: "error", message: "Error al cambiar estado del usuario" };
  }
}