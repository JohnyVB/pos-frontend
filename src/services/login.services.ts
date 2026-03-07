import API from "../config/api.config";
import type { loginResponse } from "../types/types";

export const onLogin = async (
  name: string,
  email: string,
): Promise<loginResponse> => {
  try {
    const { data } = await API.post<loginResponse>("/auth/login", {
      name,
      email,
    });
    return data;
  } catch (error) {
    console.log("Login failed:", error);
    return { response: "error", message: "Login failed" };
  }
};
