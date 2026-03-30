import { useEffect, useRef, useState } from "react";
import { Form, Button, Table, Card, Row, Col, Badge } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";

import { onGetProductByQuery, onMovement } from "../../services/inventory.services";
import userStore from "../../store/userStore";
import type { Inventory, InventoryForm, TabInventoryProps } from "../../interfaces/components/POSPage/TabInventory.interface";
import toast from "react-hot-toast";
import { TablePagination } from "../common/TablePagination";

export const TabInventory = ({
  inventory,
  setInventory,
  getProductsWithLowStock,
  currentInventoryPage,
  totalInventoryPages,
  totalInventoryRecords,
  loadInventory,
}: TabInventoryProps) => {
  const { userData } = userStore();
  const [query, setQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(null);
  const inputSearchRef = useRef<HTMLInputElement | null>(null);
  const inputQuantityRef = useRef<HTMLInputElement | null>(null);
  const inputCostPriceRef = useRef<HTMLInputElement | null>(null);
  const inputReferenceRef = useRef<HTMLTextAreaElement | null>(null);

  const { form, onChangeForm, resetForm } = useForm<InventoryForm>({
    product_id: "",
    quantity: "",
    reference: "",
    cost_price: "",
  });

  const existingInventory = (selectedProduct: Inventory): number => {
    return inventory.findIndex(
      (inv: Inventory) => inv.product_id === selectedProduct.id,
    );
  };

  const movementIN = async (selectedProduct: Inventory) => {
    const existingIndex = existingInventory(selectedProduct);

    let updated;
    if (existingIndex >= 0) {
      updated = [...inventory];
      updated[existingIndex].quantity = Number(updated[existingIndex].quantity) + Number(form.quantity);
    } else {
      updated = [
        {
          ...selectedProduct,
          id: Date.now(),
          product_id: selectedProduct.id,
          quantity: Number(form.quantity),
        },
        ...inventory,
      ];
    }
    setInventory(updated);
  }

  const movementOUT = async (selectedProduct: Inventory) => {
    const existingIndex = existingInventory(selectedProduct);

    if (existingIndex >= 0) {
      if (Number(selectedProduct.quantity) === Number(form.quantity)) {
        const updated = inventory.filter((inv: Inventory) => inv.product_id !== selectedProduct.id);
        setInventory(updated);
        return;
      }
      const updated = [...inventory];
      updated[existingIndex].quantity -= Number(form.quantity);
      setInventory(updated);
    }
  }

  const updateProductInventory = async (selectedProduct: Inventory, type: "IN" | "OUT") => {
    if (type === "IN") {
      movementIN(selectedProduct);
    } else {
      movementOUT(selectedProduct);
    }
  }

  // Handlers para Inventario
  const handleAddInventory = async () => {
    if (!form.product_id || !form.quantity) {
      toast.error("Por favor, completa todos los campos", { duration: 4000 });
      return;
    }

    const res = await onMovement(Number(form.product_id), Number(form.quantity), Number(form.cost_price), "IN", form.reference, userData?.store_id!);
    if (res.response === "success") {
      updateProductInventory(selectedProduct!, "IN");
      getProductsWithLowStock();
      toast.success(res.message, { duration: 4000 });
      resetForm();
      setSelectedProduct(null);
      inputSearchRef.current?.focus();
    } else {
      toast.error(res.message, { duration: 4000 });
    }
  };

  const handleRemoveInventory = async () => {
    if (!form.product_id || !form.quantity || form.reference.trim() === "") {
      toast.error("Por favor, completa todos los campos", { duration: 4000 });
      return;
    }

    if (Number(form.quantity) > Number(selectedProduct?.quantity)) {
      toast.error("No puedes quitar más de lo que hay en inventario", { duration: 4000 });
      return;
    }

    const res = await onMovement(Number(form.product_id), Number(form.quantity), Number(form.cost_price), "OUT", form.reference, userData?.store_id!);
    if (res.response === "success") {
      updateProductInventory(selectedProduct!, "OUT");
      getProductsWithLowStock();
      toast.success("Movimiento de inventario registrado exitosamente", { duration: 4000 });
      resetForm();
      setSelectedProduct(null);
      inputSearchRef.current?.focus();
    } else {
      toast.error(res.message, { duration: 4000 });
    }
  };

  const handleKeyDownSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== "") {
      const res = await onGetProductByQuery(query.toLowerCase().trim(), userData?.store_id!);
      if (res.response === "success" && res.product) {
        setSelectedProduct({
          id: res.product.id,
          product_id: res.product.id,
          name: res.product.name,
          barcode: res.product.barcode,
          quantity: res.product.quantity || 0,
          store_id: res.product.store_id,
          store_name: res.product.store_name,
          cost_price: res.product.cost_price,
        });
        onChangeForm(res.product.cost_price.toString(), "cost_price");
        inputQuantityRef.current?.focus();
        onChangeForm(res.product.id.toString(), "product_id");
        toast.success(`Producto encontrado: ${res.product.name}`, { duration: 4000 });
        setQuery("");
      } else {
        toast.error(res.message || "Producto no encontrado", { duration: 4000 });
        inputSearchRef.current?.focus();
      }
    }
  };

  const handleKeyDownQuantity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedProduct) {
      if (e.key === "Enter") {
        inputCostPriceRef.current?.focus();
      }
    } else {
      toast.error("Primero selecciona un producto válido", { duration: 4000 });
      inputSearchRef.current?.focus();
    }
  };

  const handleKeyDownCostPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedProduct) {
      if (e.key === "Enter") {
        inputReferenceRef.current?.focus();
      }
    } else {
      toast.error("Primero selecciona un producto válido", { duration: 4000 });
      inputSearchRef.current?.focus();
    }
  }

  const handleKeyDownReference = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (selectedProduct) {
      if (e.key === "Enter") {
        handleAddInventory();
      }
    } else {
      toast.error("Primero selecciona un producto válido", { duration: 4000 });
      inputSearchRef.current?.focus();
    }
  }

  const removeSelectedProduct = () => {
    setSelectedProduct(null);
    onChangeForm("", "product_id");
  }

  const valueAdjustment = (value: string, field: keyof InventoryForm) => {
    if (field === "cost_price") {
      value = value.replace(',', '.');
      const regex = /^\d*(\.\d{0,2})?$/;
      if (value === "" || value === "." || regex.test(value)) {
        onChangeForm(value, field);
      }
    } else if (field === "quantity") {
      const regex = /^[0-9]*$/;
      if (value === "" || regex.test(value)) {
        onChangeForm(value, field);
      }
    } else {
      onChangeForm(value, field);
    }
  }

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }
  }, []);

  return (
    <div>
      <h3 className="mb-4">Gestionar Inventario</h3>
      <Row className="g-4 mb-5">
        <Col lg={7}>
          <Card className="h-100 shadow-sm border-0 bg-light">
            <Card.Body>
              <h5 className="mb-3 text-secondary">Registro de Movimiento</h5>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Buscar producto</Form.Label>
                    <Form.Control
                      ref={inputSearchRef}
                      type="text"
                      value={query}
                      placeholder="Escanea el código de barras o escribe el nombre y presiona Enter..."
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDownSearch}
                      size="lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Cantidad a mover</Form.Label>
                    <Form.Control
                      ref={inputQuantityRef}
                      type="text"
                      placeholder="0"
                      value={form.quantity}
                      onChange={(e) => valueAdjustment(e.target.value, "quantity")}
                      onKeyDown={handleKeyDownQuantity}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Costo unitario</Form.Label>
                    <Form.Control
                      ref={inputCostPriceRef}
                      type="text"
                      placeholder="0"
                      value={form.cost_price}
                      onChange={(e) => valueAdjustment(e.target.value, "cost_price")}
                      onKeyDown={handleKeyDownCostPrice}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Referencia (Requerido para Salidas)</Form.Label>
                    <Form.Control
                      ref={inputReferenceRef}
                      as="textarea"
                      rows={2}
                      placeholder="Ej: Merma, Caducidad, Devolución..."
                      value={form.reference}
                      onChange={(e) => valueAdjustment(e.target.value, "reference")}
                      onKeyDown={handleKeyDownReference}
                    />
                  </Form.Group>
                </Col>

                {selectedProduct && (
                  <Col xs={12} className="d-flex gap-2 mt-4">
                    <Button onClick={handleAddInventory} variant="success" className="fw-bold px-4">
                      Ingresar (+)
                    </Button>
                    <Button onClick={handleRemoveInventory} variant="warning" className="fw-bold px-4">
                      Retirar (-)
                    </Button>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="h-100 shadow-sm border-0 text-white" style={{ backgroundColor: selectedProduct ? '#3b82f6' : '#94a3b8' }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              {selectedProduct ? (
                <>
                  <h4 className="mb-4">Producto Seleccionado</h4>
                  <div className="bg-white text-dark p-3 rounded mb-2 shadow-sm">
                    <p className="mb-2"><span className="fw-bold text-secondary">Código:</span> <br /><span className="font-monospace">{selectedProduct.barcode}</span></p>
                    <p className="mb-2"><span className="fw-bold text-secondary">Nombre:</span> <br />{selectedProduct.name}</p>
                    <p className="mb-0"><span className="fw-bold text-secondary">Stock actual:</span> <br />
                      <Badge bg="primary" className="fs-5">{Number(selectedProduct.quantity)}</Badge>
                    </p>
                    <p className="mb-0"><span className="fw-bold text-secondary">Costo inicial:</span> <br />
                      <Badge bg="warning" className="fs-5">{Number(selectedProduct.cost_price)}</Badge>
                    </p>
                  </div>
                  <Button
                    variant="light"
                    className="text-danger fw-bold mt-2 align-self-start"
                    onClick={removeSelectedProduct}
                  >
                    Olvidar Producto
                  </Button>
                </>
              ) : (
                <div className="text-center py-5 opacity-75">
                  <span className="display-4 d-block mb-3">🔍</span>
                  <h5>Ningún producto seleccionado</h5>
                  <p className="mb-0 small">Usa el buscador para seleccionar un producto y registrar movimientos de stock.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-4">Inventario Actual Global</h3>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Barcode</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="text-end px-4 py-3" style={{ width: "200px" }}>Stock Disponible</th>
                <th className="text-end px-4 py-3" style={{ width: "200px" }}>Costo</th>
                {userData?.role === "superadmin" && (
                  <th className="text-end px-4 py-3" style={{ width: "200px" }}>Tienda</th>
                )}
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv: Inventory) => {
                return (
                  <tr key={inv.product_id}>
                    <td className="px-4 fw-semibold text-secondary">{inv.barcode}</td>
                    <td className="px-4 fw-semibold text-secondary">{inv.name}</td>
                    <td className="text-end px-4">
                      <Badge bg="primary" className="fs-5">{Number(inv.quantity)}</Badge>
                    </td>
                    <td className="text-end px-4">
                      <Badge bg="primary" className="fs-5">{Number(inv.cost_price)}</Badge>
                    </td>
                    {userData?.role === "superadmin" && (
                      <td className="text-end px-4">
                        <Badge bg="primary" className="fs-5">{inv.store_name}</Badge>
                      </td>
                    )}
                  </tr>
                );
              })}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={userData?.role === "superadmin" ? 4 : 3} className="text-center text-muted py-5">
                    El inventario está vacío.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <TablePagination
            data={inventory}
            currentPage={currentInventoryPage}
            totalPages={totalInventoryPages}
            totalRecords={totalInventoryRecords}
            loadData={loadInventory}
          />
        </Card.Body>
      </Card>
    </div >
  );
};
