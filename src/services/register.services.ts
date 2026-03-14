import API from "../config/api.config";
import type { registerResponse } from "../interfaces/pages/Register.interface";

export const onRegister = async (
  name: string,
  username: string,
  email: string,
  password: string,
  role: string,
): Promise<registerResponse> => {
  try {
    const { data } = await API.post<registerResponse>("/auth/register", {
      name,
      username,
      email,
      password,
      role,
    });
    return data;
  } catch (error: any) {
    console.log("Registration failed:", error);
    return { response: "error", message: error.response.data.message };
  }
};
