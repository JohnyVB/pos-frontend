import API from "../config/api.config";

export const getProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await API.post("/products", product);
  return data;
};

export const updateProduct = async (id: number, product: any) => {
  const { data } = await API.put(`/products/${id}`, product);
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};
