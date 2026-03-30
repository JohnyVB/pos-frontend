import { useEffect, useRef, useState } from "react";
import { Form, Button, Table, Row, Col, Card, Badge, Accordion } from "react-bootstrap";
import { formatDateToShow } from "../../helper/formatDate.helper";
import { useForm } from "../../hooks/useForm";
import type { Category } from "../../interfaces/components/POSPage/TabCategories.interface";
import type { createEditForm, TabProductsProps } from "../../interfaces/components/POSPage/TabCreateEdit.interface";
import type { Product } from "../../interfaces/global.interface";
import { onCreateProduct, onDeleteProduct, onUpdateProduct } from "../../services/products.services";
import userStore from "../../store/userStore";
import toast from "react-hot-toast";

type ActiveKey = string | string[] | null | undefined;

const TabCreateEditProduct = ({
  products,
  setProducts,
  categories,
  stores,
  filterForm,
  onChangeFilterForm,
  loadProducts,
  handleClearFilters
}: TabProductsProps) => {
  const { userData } = userStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputNameRef = useRef<HTMLInputElement | null>(null);
  const inputSaleTypeRef = useRef<HTMLSelectElement | null>(null);
  const inputBarcodeRef = useRef<HTMLInputElement | null>(null);
  const inputPriceRef = useRef<HTMLInputElement | null>(null);
  const inputCostPriceRef = useRef<HTMLInputElement | null>(null);
  const inputVatRef = useRef<HTMLInputElement | null>(null);
  const inputMinStockRef = useRef<HTMLInputElement | null>(null);
  const inputCategoryRef = useRef<HTMLSelectElement | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<ActiveKey>("0"); // "0" inicia abierto el formulario
  const { form, onChangeForm, setFormValues, resetForm } = useForm<createEditForm>({
    name: "",
    barcode: "",
    price: "0",
    vat: "21",
    sale_type: "UNIT",
    category_id: "1",
    min_stock: "5.00",
    cost_price: "0",
  });

  const addProductToList = (newProduct: Product) => {
    setProducts((prev: Product[]) => [newProduct, ...prev]);
  }

  const updateProductInList = (updatedProduct: Product) => {
    setProducts((prev: Product[]) =>
      prev.map((p: Product) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleCreateEdit = async () => {
    if (!form.name || !form.barcode || !form.price || !form.vat || !form.sale_type || !form.category_id || !form.cost_price) {
      toast.error("Todos los campos son obligatorios", { duration: 4000 });
      return;
    }
    try {
      if (!editingId) {
        const res = await onCreateProduct(form, userData?.store_id!);
        if (res.response === "success" && res.product) {
          toast.success("Producto creado exitosamente", { duration: 4000 });
          addProductToList(res.product);
          inputBarcodeRef.current?.focus();
        }
      } else {
        const res = await onUpdateProduct(editingId, form);
        if (res.response === "success" && res.product) {
          updateProductInList({
            ...res.product,
            category_name: categories.find((c) => c.id === Number(form.category_id))?.name || "",
            store_name: stores.find((s) => s.id === res.product?.store_id)?.name || "",
          });
          toast.success("Producto actualizado exitosamente", { duration: 4000 });
          setEditingId(null);
          inputBarcodeRef.current?.focus();
        }
      }
      resetForm();
    } catch (error: any) {
      console.error("Error en creación/edición:", error);
      toast.error("Error al crear/editar producto", { duration: 4000 });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id!);
    setActiveKey("0");
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth", // Movimiento fluido
        block: "start"      // Alinea el inicio del elemento con la parte superior
      });
    }, 100);
    setFormValues({
      name: product.name,
      barcode: product.barcode,
      price: String(product.price),
      vat: String(product.vat),
      category_id: String(product.category_id),
      min_stock: String(product.min_stock),
      sale_type: product.sale_type,
      cost_price: String(product.cost_price),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await onDeleteProduct(id);
      if (res.response === "success") {
        setProducts((prev: Product[]) => prev.filter((p) => p.id !== id));
        toast.success("Producto eliminado exitosamente", { duration: 4000 });
      }
    } catch (error) {
      toast.error("Error al eliminar producto", { duration: 4000 });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | any>,
    nextRef?: React.RefObject<any>
  ) => {
    if (e.key === "Enter") {
      if (nextRef) {
        nextRef.current?.focus()
      } else {
        handleCreateEdit()
      }
    }
  }

  const valueAdjustment = (value: string, field: keyof createEditForm) => {
    if (field === "price" || field === "min_stock" || field === "cost_price") {
      value = value.replace(',', '.');
      const regex = /^\d*(\.\d{0,2})?$/;
      if (value === "" || value === "." || regex.test(value)) {
        onChangeForm(value, field);
      }
    } else if (field === "vat") {
      const numericValue = value.replace(/\D/g, '');
      onChangeForm(numericValue, field);
    } else {
      onChangeForm(value, field);
    }
  }

  useEffect(() => {
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus();
    }
  }, [])

  return (
    <div>
      <Accordion
        ref={formRef}
        className="mb-3 mt-3 shadow-sm border-0"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
      >
        <Accordion.Item eventKey="0" className="bg-light">
          <Accordion.Header><h4 className="text-dark">{editingId ? "Editar Producto" : "Nuevo Producto"}</h4></Accordion.Header>
          <Accordion.Body>
            <Row className="align-items-end g-3">
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Código de barras</Form.Label>
                  <Form.Control
                    ref={inputBarcodeRef}
                    placeholder="Ej: 123456789"
                    value={form.barcode}
                    onChange={(e) => valueAdjustment(e.target.value, "barcode")}
                    onKeyDown={(e) => handleKeyDown(e, inputNameRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Nombre</Form.Label>
                  <Form.Control
                    ref={inputNameRef}
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={(e) => valueAdjustment(e.target.value, "name")}
                    onKeyDown={(e) => handleKeyDown(e, inputSaleTypeRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Tipo de Venta</Form.Label>
                  <Form.Select
                    ref={inputSaleTypeRef}
                    value={form.sale_type}
                    onChange={(e) => valueAdjustment(e.target.value, "sale_type")}
                    onKeyDown={(e) => handleKeyDown(e, inputCostPriceRef)}
                  >
                    <option value="UNIT">Unidad</option>
                    <option value="WEIGHT">Peso</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4} lg={1}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Costo (€)</Form.Label>
                  <Form.Control
                    ref={inputCostPriceRef}
                    type="text"
                    placeholder="0.00"
                    value={form.cost_price}
                    onChange={(e) => valueAdjustment(e.target.value, "cost_price")}
                    onKeyDown={(e) => handleKeyDown(e, inputPriceRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4} lg={1}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Precio (€)</Form.Label>
                  <Form.Control
                    ref={inputPriceRef}
                    type="text"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => valueAdjustment(e.target.value, "price")}
                    onKeyDown={(e) => handleKeyDown(e, inputCostPriceRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4} lg={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">IVA (%)</Form.Label>
                  <Form.Control
                    ref={inputVatRef}
                    type="text"
                    placeholder="21"
                    value={form.vat}
                    onChange={(e) => valueAdjustment(e.target.value, "vat")}
                    onKeyDown={(e) => handleKeyDown(e, inputMinStockRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4} lg={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Stock Mínimo</Form.Label>
                  <Form.Control
                    ref={inputMinStockRef}
                    type="text"
                    placeholder="0"
                    value={form.min_stock}
                    onChange={(e) => valueAdjustment(e.target.value, "min_stock")}
                    onKeyDown={(e) => handleKeyDown(e, inputCategoryRef)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4} lg={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Categoría</Form.Label>
                  <Form.Select
                    ref={inputCategoryRef}
                    value={form.category_id}
                    onChange={(e) => valueAdjustment(e.target.value, "category_id")}
                    onKeyDown={(e) => handleKeyDown(e)}
                  >
                    <option value={0}>Sin categoría</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={userData?.role === "cashier" ? 4 : 3}>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="w-100 fw-bold"
                    onClick={handleCreateEdit}
                  >
                    {editingId ? "Actualizar" : "Agregar"}
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-100 fw-bold"
                    disabled={!editingId}
                    onClick={() => {
                      resetForm();
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="bg-light">
          <Accordion.Header><h4 className="text-dark">Filtros de Búsqueda</h4></Accordion.Header>
          <Accordion.Body>
            <Row className="align-items-end g-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">IVA</Form.Label>
                  <Form.Select
                    value={filterForm.vat || "all"}
                    onChange={(e) => onChangeFilterForm(e.target.value === "all" ? null : e.target.value, "vat")}
                  >
                    <option value="all">Todos los IVA</option>
                    <option value="21">21%</option>
                    <option value="10">10%</option>
                    <option value="4">4%</option>
                    <option value="0">0%</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Stock Mínimo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="0.00"
                    value={filterForm.min_stock || ""}
                    onChange={(e) => onChangeFilterForm(e.target.value === "" ? null : e.target.value, "min_stock")}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={userData?.role === "superadmin" ? 2 : userData?.role === "cashier" ? 4 : 3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Categoría</Form.Label>
                  <Form.Select
                    value={filterForm.category_id || ""}
                    onChange={(e) => onChangeFilterForm(e.target.value === "" ? null : e.target.value, "category_id")}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Tipo de Venta</Form.Label>
                  <Form.Select
                    value={filterForm.sale_type || "all"}
                    onChange={(e) => onChangeFilterForm(e.target.value === "all" ? null : e.target.value, "sale_type")}
                  >
                    <option value="all">Todos los tipos de venta</option>
                    <option value="UNIT">Unidad</option>
                    <option value="WEIGHT">Peso</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {userData?.role === "superadmin" && (
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Tienda</Form.Label>
                    <Form.Select
                      value={filterForm.store_id || "all"}
                      onChange={(e) => onChangeFilterForm(e.target.value === "all" ? null : e.target.value, "store_id")}
                    >
                      <option value="all">Todas las tiendas</option>
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
              <Col xs={12} md={userData?.role !== "superadmin" ? 4 : 3}>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="w-100 fw-bold"
                    onClick={loadProducts}
                  >
                    Filtrar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-100 fw-bold"
                    onClick={handleClearFilters}
                  >
                    Limpiar
                  </Button>
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h3 className="mb-4">Lista de Productos</h3>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="py-3">Barcode</th>
                <th className="text-end py-3">Costo</th>
                <th className="text-end py-3">Precio</th>
                <th className="text-center py-3">IVA</th>
                <th className="text-center py-3">Stock Mínimo</th>
                <th className="py-3">Categoría</th>
                <th className="text-center py-3">Tipo de Venta</th>
                <th className="py-3">Creación</th>
                <th className="text-center py-3">Stock</th>
                {userData?.role === "superadmin" && <th className="text-center py-3">Tienda</th>}
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: Product) => (
                <tr key={p.id}>
                  <td className="px-4 fw-semibold">{p.name}</td>
                  <td className="text-muted"><small className="font-monospace">{p.barcode}</small></td>
                  <td className="font-monospace text-end fw-bold text-success">€{p.cost_price}</td>
                  <td className="font-monospace text-end fw-bold text-success">€{p.price}</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="px-2 py-1">{p.vat}%</Badge>
                  </td>
                  <td className="text-center">
                    <Badge bg="secondary" className="px-2 py-1">{p.min_stock || 0}</Badge>
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="border shadow-sm px-2 py-1 text-wrap" style={{ maxWidth: '120px' }}>
                      {p.category_name}
                    </Badge>
                  </td>
                  <td className="text-center">
                    {p.sale_type === 'WEIGHT' ? (
                      <Badge bg="info" className="px-2 py-1 rounded-pill">Granel</Badge>
                    ) : (
                      <Badge bg="primary" className="px-2 py-1 rounded-pill">Unidad</Badge>
                    )}
                  </td>
                  <td className="text-muted"><small>{formatDateToShow(p.created_at) || "N/A"}</small></td>
                  <td className="text-center">
                    <Badge bg="success" className="px-2 py-1">{p.stock || 0}</Badge>
                  </td>
                  {userData?.role === "superadmin" && (
                    <td className="text-center">
                      <Badge bg="success" className="px-2 py-1">{p.store_name}</Badge>
                    </td>
                  )}
                  <td className="text-center px-4">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="fw-bold shadow-sm"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="fw-bold shadow-sm"
                        onClick={() => handleDelete(p.id!)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={userData?.role === "superadmin" ? 11 : 10} className="text-center text-muted py-5">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabCreateEditProduct;

