import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { useForm } from "../../hooks/useForm";
import type {
  Category,
  TabCategoriesProps,
} from "../../interfaces/components/ProductsPage/TabCategories.interface";
import {
  onCreateCategory,
  onDeactivateCategory,
} from "../../services/categories.services";
import userStore from "../../store/userStore";
import { TablePagination } from "../common/TablePagination";

const TabCategories = ({
  categories,
  setCategories,
  currentCategoryPage,
  totalCategoryPages,
  totalCategoriesRecords,
  loadCategories,
}: TabCategoriesProps) => {
  const { userData } = userStore();
  const { form, onChangeForm, resetForm } = useForm({
    name: "",
    description: "",
  });

  // Handlers para Categorías
  const handleAddCategory = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("El nombre y la descripción de la categoría son requeridos", { duration: 4000 });
      return;
    }
    const res = await onCreateCategory(form, userData?.store_id!);

    if (res.response === "success" && res.category) {
      toast.success("Categoría creada exitosamente", { duration: 4000 });
      const newCategory = {
        ...res.category,
      };
      const updated: Category[] = [newCategory, ...categories];
      setCategories(updated);
      resetForm();
    } else {
      toast.error(res.message || "Error al crear la categoría", {
        duration: 4000,
      });
    }
  };

  // Función para eliminar (desactivar) una categoría
  const handleDeleteCategory = async (id: number) => {
    const res = await onDeactivateCategory(id);
    if (res.response === "success") {
      const updatedCategories = categories.filter((cat) => cat.id !== id);
      setCategories(updatedCategories);
      toast.success("Categoría eliminada exitosamente", {
        duration: 4000,
      });
      return;
    }
    toast.error(res.message || "Error al eliminar la categoría", {
      duration: 4000,
    });
    return
  };

  return (
    <div>
      <h3 className="mb-4">Gestionar Categorías</h3>
      <Card className="mb-5 shadow-sm border-0 bg-light">
        <Card.Body>
          <Row className="align-items-end g-3">
            <Col md={6} lg={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Nombre de categoría</Form.Label>
                <Form.Control
                  placeholder="Ej: Bebidas"
                  value={form.name}
                  onChange={(e) => onChangeForm(e.target.value, "name")}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={4}>
              <Button onClick={handleAddCategory} variant="primary" className="fw-bold px-4">
                Agregar Categoría
              </Button>
            </Col>
            <Col lg={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Descripción breve (opcional)"
                  value={form.description}
                  onChange={(e) => onChangeForm(e.target.value, "description")}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h3 className="mb-4">Lista de Categorías</h3>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="py-3">Descripción</th>
                {userData?.role === "superadmin" && <th className="text-center py-3">Tienda</th>}
                <th className="text-center px-4 py-3" style={{ width: "120px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 fw-semibold text-dark">{cat.name}</td>
                  <td className="text-secondary">{cat.description}</td>
                  {userData?.role === "superadmin" && <td className="text-center px-4">{cat.store_name}</td>}
                  <td className="text-center px-4">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="fw-bold shadow-sm"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={userData?.role === "superadmin" ? 4 : 3} className="text-center text-muted py-5">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <TablePagination
            data={categories}
            totalRecords={totalCategoriesRecords}
            currentPage={currentCategoryPage}
            totalPages={totalCategoryPages}
            loadData={loadCategories}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabCategories;
