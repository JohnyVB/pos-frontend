import API from "../config/api.config";
import type { getPromotionsResponse, PromoForm } from "../interfaces/components/ProductsPage/TabPromotions.interface";

export const onGetPromotions = async (storeId: string, page: number, limit: number): Promise<getPromotionsResponse> => {
  try {
    const res = await API.get(`/promotions/${storeId}`, { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.error(error);
    return { response: "error", message: "Error al obtener promociones" };
  }
}

export const onCreatePromotion = async (storeId: string, promotion: PromoForm, product_ids: number[]) => {
  try {
    const res = await API.post(`/promotions/${storeId}`, { promotion, product_ids });
    return res.data;
  } catch (error) {
    console.error(error);
    return { response: "error", message: "Error al crear promocion" };
  }
}

export const onUpdatePromotion = async (promotion: any) => {
  try {
    const res = await API.put(`/promotions/${promotion.id}`, promotion);
    return res.data;
  } catch (error) {
    console.error(error);
    return { response: "error", message: "Error al actualizar promocion" };
  }
}

export const onStopPromotion = async (id: number) => {
  try {
    const res = await API.put(`/promotions/${id}/stop`);
    return res.data;
  } catch (error) {
    console.error(error);
    return { response: "error", message: "Error al detener promocion" };
  }
}

export const onDeletePromotionItems = async (promotion_id: number, product_ids: number) => {
  try {
    const res = await API.delete(`/promotions/items`, { data: { promotion_id, product_ids } });
    return res.data;
  } catch (error) {
    console.error(error);
    return { response: "error", message: "Error al eliminar promocion" };
  }
}