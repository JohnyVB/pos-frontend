import API from "../config/api.config";
import type {
  createEditForm,
  createProductResponse,
  getProductsResponse,
  updateProductResponse
} from "../interfaces/TabCreateEdit.interface";

export const onGetProducts = async (token: string): Promise<getProductsResponse> => {
  try {
    const { data } = await API.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { response: "error", message: "Error al cargar productos" };
  }
};

export const onCreateProduct = async (product: createEditForm, token: string): Promise<createProductResponse> => {
  try {
    const { data } = await API.post("/products", product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return { response: "error", message: "Error al crear producto" };
  }
};

export const onUpdateProduct = async (id: number, product: createEditForm, token: string): Promise<updateProductResponse> => {
  try {
    const { data } = await API.put(`/products/${id}`, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return { response: "error", message: "Error al actualizar producto" };
  }
};

export const onDeleteProduct = async (id: number, token: string) => {
  try {
    const { data } = await API.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return { response: "error", message: "Error al eliminar producto" };
  }
};
