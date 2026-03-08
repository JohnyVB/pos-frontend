import API from "../config/api.config";
import type { loginResponse } from "../types/global.types";

export const onLogin = async (
  email: string,
  password: string,
): Promise<loginResponse> => {
  try {
    const { data } = await API.post<loginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log("Login failed:", error);
    return { response: "error", message: "Login failed" };
  }
};
