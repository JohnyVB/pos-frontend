import API from "../config/api.config";
import type {
  categoryFormType,
  createCategoryResponse,
  deactivateCategoryResponse,
  getCategoriesResponse,
} from "../interfaces/components/POSPage/TabCategories.interface";

export const onGetCategories = async (store_id: string): Promise<getCategoriesResponse> => {
  try {
    const { data } = await API.get(`/categories/${store_id}`);
    return data;
  } catch (error: any) {
    console.log("Error fetching categories:", error);
    return { response: "error", message: "Failed to fetch categories" };
  }
};

export const onCreateCategory = async (category: categoryFormType, store_id: string): Promise<createCategoryResponse> => {
  try {
    const { data } = await API.post(`/categories/${store_id}`, category);
    return data;
  } catch (error: any) {
    console.log("Error creating category:", error);
    return { response: "error", message: "Failed to create category" };
  }
};

export const onDeactivateCategory = async (id: number): Promise<deactivateCategoryResponse> => {
  try {
    const { data } = await API.put(`/categories`, { id });
    if (data.response === "success") {
      return { response: "success" };
    } else {
      return {
        response: "error",
        message: data.message || "Failed to deactivate category",
      };
    }
  } catch (error: any) {
    console.log("Error deactivating category:", error);
    return { response: "error", message: "Failed to deactivate category" };
  }
};
