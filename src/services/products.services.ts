import API from "../config/api.config";
import type {
  createEditForm,
  createProductResponse,
  filterForm,
  getProductsResponse,
  updateProductResponse
} from "../interfaces/components/ProductsPage/TabCreateEdit.interface";

export const onGetProducts = async (filterForm: filterForm, store_id: string, page: number = 1, limit: number = 10): Promise<getProductsResponse> => {
  try {
    const { data } = await API.post(`/products/${store_id}`, { ...filterForm, page, limit });
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
      category_id: parseInt(product.category_id),
      min_stock: Number(product.min_stock)
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

export const onGetProductsWithLowStock = async (store_id: string) => {
  try {
    const { data } = await API.get(`/products/low-stock/${store_id}`);
    return data;
  } catch (error) {
    console.log("Low stock products fetch failed:", error);
    return { response: "error", message: "Low stock products fetch failed" };
  }
}
