import API from "../config/api.config";
import type {
  categoryFormType,
  createCategoryResponse,
} from "../types/TabCategories.types";

export const onGetCategories = async () => {
  try {
    const { data } = await API.get("/categories");
    return data;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return { response: "error", message: "Failed to fetch categories" };
  }
};

export const onCreateCategory = async (
  category: categoryFormType,
  token: string,
): Promise<createCategoryResponse> => {
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
