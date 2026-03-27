import API from "../config/api.config";
import type { GetTopProductsChartForm, GetTopProductsChartResponse } from "../interfaces/pages/TopProductsChart.interface";

export const onGetTopProducts = async (form: GetTopProductsChartForm): Promise<GetTopProductsChartResponse> => {
  try {
    const { data } = await API.post("/reports/top-products", form);
    return { response: "success", topProducts: data.topProducts }
  } catch (error: any) {
    return { response: "error", message: error.response.data.error }
  }
}