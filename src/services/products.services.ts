import API from "../config/api.config";
import type {
  createEditForm,
  createProductResponse,
  getProductsResponse,
  updateProductResponse
} from "../interfaces/components/POSPage/TabCreateEdit.interface";

export const onGetProducts = async (store_id: string): Promise<getProductsResponse> => {
  try {
    const { data } = await API.get(`/products/${store_id}`);
    return data;
  } catch (error: any) {
    console.log("Error fetching products:", error);
    return { response: "error", message: "Error en onGetProducts" };
  }
};

export const onCreateProduct = async (product: createEditForm, store_id: string): Promise<createProductResponse> => {
  try {
    const { data } = await API.post(`/products/${store_id}`, {
      ...product,
      price: parseFloat(product.price),
      vat: parseFloat(product.vat),
      category_id: parseInt(product.category_id)
    });
    return data;
  } catch (error: any) {
    console.log("Error creating product:", error);
    return { response: "error", message: "Error al crear producto" };
  }
};

export const onUpdateProduct = async (id: number, product: createEditForm): Promise<updateProductResponse> => {
  try {
    const { data } = await API.put(`/products/${id}`, {
      ...product,
      price: parseFloat(product.price),
      vat: parseFloat(product.vat),
      category_id: parseInt(product.category_id)
    });
    return data;
  } catch (error) {
    console.log("Error updating product:", error);
    return { response: "error", message: "Error al actualizar producto" };
  }
};

export const onDeleteProduct = async (id: number) => {
  try {
    const { data } = await API.delete(`/products/${id}`);
    return data;
  } catch (error: any) {
    console.log("Error deleting product:", error);
    return { response: "error", message: "Error al eliminar producto" };
  }
};
