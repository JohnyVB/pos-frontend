import API from "../config/api.config";
import type {
  categoryFormType,
  createCategoryResponse,
  deactivateCategoryResponse,
  getCategoriesResponse,
} from "../interfaces/TabCategories.interface";

export const onGetCategories = async (token: string): Promise<getCategoriesResponse> => {
  try {
    const { data } = await API.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return { response: "error", message: "Failed to fetch categories" };
  }
};

export const onCreateCategory = async (category: categoryFormType, token: string): Promise<createCategoryResponse> => {
  try {
    const { data } = await API.post("/categories", category, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error creating category:", error);
    return { response: "error", message: "Failed to create category" };
  }
};

export const onDeactivateCategory = async (id: number, token: string): Promise<deactivateCategoryResponse> => {
  try {
    const { data } = await API.put(`/categories`, { id }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.response === "success") {
      return { response: "success" };
    } else {
      return {
        response: "error",
        message: data.message || "Failed to deactivate category",
      };
    }
  } catch (error) {
    console.log("Error deactivating category:", error);
    return { response: "error", message: "Failed to deactivate category" };
  }
};
