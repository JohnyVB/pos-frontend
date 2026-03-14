import { Form, Button, Table, Card, Row, Col } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";
import type {
  Category,
  TabCategoriesProps,
} from "../../interfaces/components/POSPage/TabCategories.interface";
import {
  onCreateCategory,
  onDeactivateCategory,
} from "../../services/categories.services";
import userStore from "../../store/userStore";

const TabCategories = ({
  categories,
  setCategories,
  toast,
}: TabCategoriesProps) => {
  const { token } = userStore();
  const { form, onChangeForm, resetForm } = useForm({
    name: "",
    description: "",
  });

  // Handlers para Categorías
  const handleAddCategory = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      alert("El nombre y la descripción de la categoría son requeridos");
      return;
    }
    const res = await onCreateCategory(form, token!);

    if (res.response === "success" && res.category) {
      toast.success("Categoría creada exitosamente", { duration: 4000 });
      const newCategory = {
        ...res.category,
      };
      const updated: Category[] = [...categories, newCategory];
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
    const res = await onDeactivateCategory(id, token!);
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
      <h3 className="mb-4">Nueva Categoría</h3>
      <Card className="mb-5 shadow-sm border-0 bg-light" style={{ maxWidth: "600px" }}>
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={12}>
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
            
            <Col md={12}>
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

            <Col xs={12} className="mt-4">
              <Button onClick={handleAddCategory} variant="primary" className="fw-bold px-4">
                Agregar Categoría
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Lista de Categorías</h3>
      <Table responsive hover bordered className="align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th className="text-center" style={{ width: "120px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="fw-semibold">{cat.name}</td>
              <td className="text-muted">{cat.description}</td>
              <td className="text-center">
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-muted py-4">
                No hay categorías registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TabCategories;
