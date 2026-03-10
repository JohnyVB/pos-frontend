import API from "../config/api.config";
import type { verifyTokenResponse } from "../interfaces/Dashboard.interface";

export const onVerifyToken = async (token: string): Promise<verifyTokenResponse> => {
  try {
    const { data } = await API.post("/auth/verifyToken", { token });
    return data;
  } catch (error) {
    console.log("Token verification failed:", error);
    return { response: "error", message: "Token verification failed" };
  }
}