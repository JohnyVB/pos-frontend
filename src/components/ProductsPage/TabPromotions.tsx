import { useState } from 'react';
import { Badge, Button, Card, Col, Form, InputGroup, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useForm } from '../../hooks/useForm';
import type { PromoForm, TabPromotionsProps } from '../../interfaces/components/ProductsPage/TabPromotions.interface';
import type { Product } from '../../interfaces/global.interface';
import { TablePagination } from '../common/TablePagination';
import toast, { Toaster } from "react-hot-toast";
import { onCreatePromotion } from '../../services/promotions.services';
import userStore from '../../store/userStore';

const TabPromotions = ({
  products,
  promotions,
  currentPromotionPage,
  totalPromotionPages,
  totalPromotionsRecords,
  getPromotions
}: TabPromotionsProps) => {
  const { userData } = userStore();
  const { form, onChangeForm, resetForm } = useForm<PromoForm>({
    name: '',
    type: 'PERCENTAGE', // 'PERCENTAGE' o 'MULTIBUY'
    discount_rate: 10,
    buy_qty: 2,
    pay_qty: 1,
    start_date: '',
    end_date: ''
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos para el buscador interno
  const availableProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  const toggleProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleCreatePromotion = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.type === "PERCENTAGE") {
      if (!form.discount_rate) {
        toast.error('Debe ingresar un porcentaje de descuento');
        return;
      }
    }

    if (form.type === "MULTIBUY") {
      if (!form.buy_qty || !form.pay_qty) {
        toast.error('Debe ingresar la cantidad de productos a llevar y pagar');
        return;
      }
    }

    if (!form.start_date || !form.end_date || !form.name) {
      toast.error('Debe ingresar un nombre y fechas de inicio y fin');
      return;
    }

    if (selectedProducts.length <= 0) {
      toast.error('Debe seleccionar al menos un producto');
      return;
    }
    try {
      const product_ids = selectedProducts.map(p => p.id);
      const res = await onCreatePromotion(userData?.store_id!, form, product_ids);
      if (res.response === "success" && res.promotion) {
        toast.success(res.message);
        resetForm();
        setSelectedProducts([]);
        getPromotions(1, 10);
        toast.success("Promoción creada exitosamente");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la promoción");
    }
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="products"
        variant="tabs"
        justify
        fill
      >
        <Tab eventKey="products" title="Productos">
          <Row className='mt-4'>
            <Col md={5}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">Configurar Regla</Card.Header>
                <Card.Body>
                  <Form onSubmit={(e) => handleCreatePromotion(e)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre de la Promo</Form.Label>
                      <Form.Control
                        placeholder="Ej: Oferta de Navidad"
                        value={form.name}
                        onChange={(e) => onChangeForm(e.target.value, 'name')}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Oferta</Form.Label>
                      <Form.Select
                        value={form.type}
                        onChange={(e) => onChangeForm(e.target.value, 'type')}
                      >
                        <option value="PERCENTAGE">Porcentaje de Descuento (%)</option>
                        <option value="MULTIBUY">Multicompra (2x1, 3x2, etc)</option>
                      </Form.Select>
                    </Form.Group>

                    {form.type === 'PERCENTAGE' ? (
                      <Form.Group className="mb-3">
                        <Form.Label>Porcentaje a descontar</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="15"
                            value={form.discount_rate}
                            onChange={(e) => onChangeForm(e.target.value, 'discount_rate')}
                            min={0}
                            max={100}
                          />
                          <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    ) : (
                      <Row className="mb-3">
                        <Col>
                          <Form.Label>Lleva</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="2"
                            value={form.buy_qty}
                            onChange={(e) => onChangeForm(e.target.value, 'buy_qty')}
                            min={1}
                          />
                        </Col>
                        <Col>
                          <Form.Label>Paga</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="1"
                            value={form.pay_qty}
                            onChange={(e) => onChangeForm(e.target.value, 'pay_qty')}
                            min={1}
                          />
                        </Col>
                      </Row>
                    )}

                    <Row className="mb-3">
                      <Col>
                        <Form.Label>Desde</Form.Label>
                        <Form.Control
                          type="date"
                          value={form.start_date}
                          onChange={(e) => onChangeForm(e.target.value, 'start_date')}
                        />
                      </Col>
                      <Col>
                        <Form.Label>Hasta</Form.Label>
                        <Form.Control
                          type="date"
                          value={form.end_date}
                          onChange={(e) => onChangeForm(e.target.value, 'end_date')}
                        />
                      </Col>
                    </Row>

                    <Button variant="success" type="submit" className="w-100 mt-3">
                      Crear Promoción Activa
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={7}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <span>Seleccionar Productos</span>
                  <Badge bg="info">{selectedProducts.length} seleccionados</Badge>
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    className="mb-3"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th>Sel.</th>
                          <th>Producto</th>
                          <th>Precio Reg.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableProducts.map(p => (
                          <tr key={p.id} onClick={() => toggleProduct(p)} style={{ cursor: 'pointer' }}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={!!selectedProducts.find(sp => sp.id === p.id)}
                                readOnly
                              />
                            </td>
                            <td>{p.name} <br /><small className="text-muted">{p.barcode}</small></td>
                            <td>{p.price}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="promotions" title="Promociones">
          <Card className="mt-4 shadow-sm border-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between">
              <span>Promociones Activas y Programadas</span>
            </Card.Header>
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Tipo</th>
                  <th>Aplicación</th>
                  <th>Vigencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map(promo => (
                  <tr key={promo.id}>
                    <td><strong>{promo.name}</strong></td>
                    <td>
                      {promo.type === 'PERCENTAGE'
                        ? <Badge bg="info">{promo.discount_rate}% OFF</Badge>
                        : <Badge bg="warning text-dark">{promo.buy_qty}x{promo.pay_qty}</Badge>
                      }
                    </td>
                    <td>{promo.associated_products.length} productos</td>
                    <td>
                      <small>
                        {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      {new Date() > new Date(promo.end_date) || !promo.is_effective
                        ? <Badge bg="secondary">Expirada</Badge>
                        : <Badge bg="success">Activa</Badge>
                      }
                    </td>
                    <td>
                      <Button variant="outline-danger" size="sm">Detener</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TablePagination
              data={promotions}
              currentPage={currentPromotionPage}
              totalPages={totalPromotionPages}
              totalRecords={totalPromotionsRecords}
              loadData={getPromotions}
            />
          </Card>
        </Tab>
      </Tabs>
      <Toaster position='top-center' />
    </div>
  );
};

export default TabPromotions;