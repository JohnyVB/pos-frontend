import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, InputGroup, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useForm } from '../../hooks/useForm';
import type { PromoForm, TabPromotionsProps } from '../../interfaces/components/ProductsPage/TabPromotions.interface';
import type { Product } from '../../interfaces/global.interface';
import { TablePagination } from '../common/TablePagination';
import toast, { Toaster } from "react-hot-toast";
import { onCreatePromotion, onDeletePromotionItems, onStopPromotion } from '../../services/promotions.services';
import userStore from '../../store/userStore';

const TabPromotions = ({
  products,
  promotions,
  currentPromotionPage,
  totalPromotionPages,
  totalPromotionsRecords,
  getPromotions,
  currentProductPage,
  totalProductPages,
  totalProductsRecords,
  loadProducts
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [expandedPromoId, setExpandedPromoId] = useState<number | null>(null);

  const toggleExpandPromo = (id: number) => {
    setExpandedPromoId(prev => prev === id ? null : id);
  };

  const handleRemoveProductFromPromo = async (promoId: number, productId: number) => {
    try {
      const res = await onDeletePromotionItems(promoId, productId);
      if (res.response === "success") {
        toast.success("Producto eliminado de la promoción");
        getPromotions(currentPromotionPage, 10);
      } else {
        toast.error(res.message || "Error al eliminar el producto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el producto");
    }
  };

  const handleStopPromotion = async (promoId: number) => {
    try {
      const res = await onStopPromotion(promoId);
      if (res.response === "success") {
        toast.success("Promoción detenida exitosamente");
        getPromotions(currentPromotionPage, 10);
      } else {
        toast.error(res.message || "Error al detener la promoción");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al detener la promoción");
    }
  };

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm === "") {
        loadProducts(1, 10, searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
                            onChange={(e) => onChangeForm(parseInt(e.target.value), 'discount_rate')}
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
                          <th>Promoción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? products.map(p => (
                          <tr key={p.id} className={p.promo_name ? 'text-muted opacity-50' : ''} onClick={() => !p.promo_name && toggleProduct(p)} style={{ cursor: p.promo_name ? 'not-allowed' : 'pointer' }}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={!!selectedProducts.find(sp => sp.id === p.id)}
                                disabled={!!p.promo_name}
                              />
                            </td>
                            <td>{p.name} <br /><small className="text-muted">{p.barcode}</small></td>
                            <td>{p.price}€</td>
                            <td>
                              {p.promo_name ? (
                                <div className='text-truncate' style={{ maxWidth: '250px' }}>
                                  {p.promo_name} - {p.promo_type === 'PERCENTAGE' ? (
                                    <Badge bg="success">{p.discount_rate}%</Badge>
                                  ) : p.promo_type === 'MULTIBUY' ? (
                                    <Badge bg="success">{p.buy_qty}x{p.pay_qty}</Badge>
                                  ) : null}
                                </div>
                              ) : (
                                <Badge bg="secondary">Sin promoción</Badge>
                              )}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center">No hay productos</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <TablePagination
                    data={products}
                    currentPage={currentProductPage}
                    totalPages={totalProductPages}
                    totalRecords={totalProductsRecords}
                    loadData={loadProducts}
                  />
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
                  <React.Fragment key={promo.id}>
                    <tr onClick={() => toggleExpandPromo(promo.id)} style={{ cursor: 'pointer' }}>
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
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopPromotion(promo.id);
                          }}
                        >
                          Detener
                        </Button>
                      </td>
                    </tr>
                    {expandedPromoId === promo.id && (
                      <tr>
                        <td colSpan={6} className="bg-light p-0">
                          <div className="p-3 border-bottom shadow-inner">
                            <h6 className="mb-3 text-primary">Productos Asociados a la Campaña</h6>
                            {promo.associated_products && promo.associated_products.length > 0 ? (
                              <Table size="sm" bordered hover className="bg-white mb-0 shadow-sm">
                                <thead className="table-light">
                                  <tr>
                                    <th>Producto</th>
                                    <th>Código de Barras</th>
                                    <th>Precio</th>
                                    <th className="text-center" style={{ width: '100px' }}>Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {promo.associated_products.map(product => (
                                    <tr key={product.id}>
                                      <td className="align-middle">{product.name}</td>
                                      <td className="align-middle">{product.barcode}</td>
                                      <td className="align-middle">{product.price}€</td>
                                      <td className="text-center">
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveProductFromPromo(promo.id, product.id);
                                          }}
                                          title="Eliminar producto de la campaña"
                                        >
                                          Eliminar
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            ) : (
                              <p className="text-muted mb-0">No hay productos asociados en esta campaña.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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