import type { ToastFunction } from "./global.interface";

export interface categoryFormType {
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  active: boolean;
}

export interface TabCategoriesProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  handleDeleteCategory: (id: number) => void;
  toast: ToastFunction;
}

export interface createCategoryResponse {
  response: "success" | "error";
  category?: Category;
  message?: string;
}

export interface getCategoriesResponse {
  response: "success" | "error";
  categories?: Category[];
  message?: string;
}
