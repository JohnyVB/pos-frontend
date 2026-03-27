import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { useForm } from "../hooks/useForm";
import type { TopProductsChartProduct } from "../interfaces/pages/TopProductsChart.interface";
import { onGetStores } from "../services/stores.services";
import { onGetTopProducts } from "../services/top-products-chart.services";
import userStore from "../store/userStore";
import type { Store } from "../interfaces/global.interface";

const TopProductsChart = () => {
  const { userData } = userStore();
  const [topProducts, setTopProducts] = useState<TopProductsChartProduct[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdminOrSuperadmin = userData?.role === "admin" || userData?.role === "superadmin";

  const { form, onChangeForm } = useForm({
    store_id: isAdminOrSuperadmin ? "" : userData?.store_id || "",
    start_date: "",
    end_date: "",
    limit: 10
  });

  const getStoresData = async () => {
    if (userData?.role === "superadmin") {
      const data = await onGetStores();
      if (data.response === "success" && data.stores) {
        setStores(data.stores);
      }
    }
  };

  const getTopProducts = async () => {
    setLoading(true);
    const data = await onGetTopProducts({
      ...form,
      store_id: form.store_id || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    });
    if (data.response === "success" && data.topProducts) {
      // Parse numbers if they come as strings from DB
      const formattedData = data.topProducts.map(p => ({
        ...p,
        total_quantity: Number(p.total_quantity),
        total_revenue: Number(p.total_revenue)
      }));
      setTopProducts(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    getStoresData();
  }, []);

  useEffect(() => {
    getTopProducts();
  }, [form.store_id, form.start_date, form.end_date, form.limit]);

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <PageHeader title="Métricas de Productos Top" />

      <Card className="shadow-sm border-0 mb-4 bg-white rounded-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3 text-primary">Filtros de Búsqueda</h5>
          <Form>
            <Row className="g-3">
              {userData?.role === "superadmin" && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold text-muted small">Tienda</Form.Label>
                    <Form.Select
                      name="store_id"
                      value={form.store_id || ""}
                      onChange={(e) => onChangeForm(e.target.value, "store_id")}
                      className="form-control-lg fs-6"
                    >
                      <option value="">Todas las tiendas</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}

              <Col md={userData?.role === "superadmin" ? 3 : 4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted small">Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={form.start_date || ""}
                    onChange={(e) => onChangeForm(e.target.value, "start_date")}
                    className="form-control-lg fs-6"
                  />
                </Form.Group>
              </Col>

              <Col md={userData?.role === "superadmin" ? 3 : 4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted small">Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={form.end_date || ""}
                    onChange={(e) => onChangeForm(e.target.value, "end_date")}
                    className="form-control-lg fs-6"
                  />
                </Form.Group>
              </Col>

              <Col md={userData?.role === "superadmin" ? 3 : 4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted small">Cantidad (Top)</Form.Label>
                  <Form.Select
                    name="limit"
                    value={form.limit.toString()}
                    onChange={(e) => onChangeForm(Number(e.target.value), "limit")}
                    className="form-control-lg fs-6"
                  >
                    <option value="5">Top 5</option>
                    <option value="10">Top 10</option>
                    <option value="20">Top 20</option>
                    <option value="50">Top 50</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 bg-white rounded-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4 text-dark text-center">
            Rendimiento de Productos (Cantidad vs Ingresos)
          </h5>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : topProducts.length > 0 ? (
            <div style={{ width: '100%', height: 500 }}>
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <BarChart
                  data={topProducts}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis
                    dataKey="product_name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fill: '#6c757d', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#0088FE"
                    tick={{ fill: '#0088FE' }}
                    label={{ value: 'Cantidad Vendida', angle: -90, position: 'insideLeft', fill: '#0088FE' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#00C49F"
                    tick={{ fill: '#00C49F' }}
                    label={{ value: 'Ingresos (€)', angle: 90, position: 'insideRight', fill: '#00C49F' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => {
                      if (name === "Ingresos Totales") return [`€${Number(value).toFixed(2)}`, name];
                      return [value, name];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="total_quantity"
                    name="Cantidad Vendida"
                    fill="#0088FE"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="total_revenue"
                    name="Ingresos Totales"
                    fill="#00C49F"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center text-muted" style={{ height: "400px" }}>
              <p className="fs-5">No se encontraron datos para estos filtros.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TopProductsChart;