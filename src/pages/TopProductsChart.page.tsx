import { Container } from "react-bootstrap"
import { PageHeader } from "../components/common/PageHeader"
import { useForm } from "../hooks/useForm";
import userStore from "../store/userStore";
import type { TopProductsChartProduct } from "../interfaces/pages/TopProductsChart.interface";
import { useEffect, useState } from "react";
import { onGetTopProducts } from "../services/top-products-chart.services";

// Colores modernos para las barras
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TopProductsChart = () => {
  const { userData } = userStore();
  const [topProducts, setTopProducts] = useState<TopProductsChartProduct[]>([]);
  const { form, onChangeForm, resetForm } = useForm({
    store_id: (userData && userData.role === "admin" || userData?.role === "superadmin") ? null : userData?.store_id || null,
    start_date: null,
    end_date: null,
    limit: 10
  })

  const getTopProducts = async () => {
    const data = await onGetTopProducts(form);
    if (data.response === "success" && data.topProducts) {
      console.log(data.topProducts);
      setTopProducts(data.topProducts);
    }
  }

  useEffect(() => {
    getTopProducts();
  }, [form])

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Top Productos" />
    </Container>
  )
}

export default TopProductsChart