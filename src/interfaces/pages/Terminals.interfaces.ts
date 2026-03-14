import type { Terminal } from "../global.interface";

export interface getTerminalsResponse {
  response: "success" | "error";
  message?: string;
  terminals?: Terminal[];
}