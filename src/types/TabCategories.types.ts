import type { ToastFunction } from "../interfaces/global.interface";

export type categoryFormType = {
  name: string;
  description: string;
};

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  active: boolean;
}

export type TabCategoriesProps = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  handleDeleteCategory: (id: number) => void;
  toast: ToastFunction;
};

export type createCategoryResponse = {
  response: "success" | "error";
  category?: Category;
  message?: string;
};
