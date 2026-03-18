import API from "../config/api.config";
import type { registerResponse } from "../interfaces/pages/Register.interface";

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
