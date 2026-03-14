import type { User } from "../global.interface";

export interface loginResponse {
  response: string;
  token?: string;
  user?: User;
  message?: string;
}