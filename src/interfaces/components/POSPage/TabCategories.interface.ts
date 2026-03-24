
export interface categoryFormType {
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  store_id: string;
  store_name: string;
  active: boolean;
}

export interface TabCategoriesProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
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

export interface deactivateCategoryResponse {
  response: "success" | "error";
  message?: string;
}
