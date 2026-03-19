import type { User } from "../global.interface";

export interface registerResponse {
  response: string;
  user?: User;
  message?: string;
}

export interface getUsersResponse {
  response: string;
  users?: User[];
  message?: string;
}