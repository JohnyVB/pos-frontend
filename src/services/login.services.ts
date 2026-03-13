import API from "../config/api.config";
import type { loginResponse } from "../interfaces/global.interface";

export const onLogin = async (
  user: string,
  password: string,
): Promise<loginResponse> => {
  try {
    const { data } = await API.post<loginResponse>("/auth/login", {
      user,
      password,
    });
    return data;
  } catch (error) {
    console.log("Login failed:", error);
    return { response: "error", message: "Login failed" };
  }
};
