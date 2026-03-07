import API from "../config/api.config";
import type { registerResponse } from "../types/types";

export const onRegister = async (
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<registerResponse> => {
  try {
    const { data } = await API.post<registerResponse>("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return data;
  } catch (error) {
    console.log("Registration failed:", error);
    return { response: "error", message: "Registration failed" };
  }
};
