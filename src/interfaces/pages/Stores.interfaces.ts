import type { Store } from "../global.interface";

export interface getStoresResponse {
  response: "success" | "error";
  message?: string;
  stores?: Store[];
}

export interface storeForm {
  name: string;
  address: string;
  city: string;
  phone: string;
  cif_nif: string;
  legal_name: string;
  zip_code: string;
}
