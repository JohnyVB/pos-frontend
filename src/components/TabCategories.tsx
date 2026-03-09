import { useForm } from "../hooks/useForm";
import type {
  Category,
  TabCategoriesProps,
} from "../interfaces/TabCategories.interface";
import { onCreateCategory } from "../services/categories.services";
import userStore from "../store/userStore";

const TabCategories = ({
  categories,
  setCategories,
  handleDeleteCategory,
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

  return (
    <div>
      <h2>Crear Categorías</h2>
      <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
        <input
          placeholder="Nombre de categoría"
          value={form.name}
          onChange={(e) => onChangeForm(e.target.value, "name")}
          required
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <input
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) => onChangeForm(e.target.value, "description")}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
          }}
        />
        <button onClick={handleAddCategory} style={{ padding: "10px" }}>
          Agregar Categoría
        </button>
      </div>

      <h3>Lista de Categorías</h3>
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                {cat.active ? (
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={{ backgroundColor: "#dc3545", color: "white" }}
                  >
                    Deshactivar
                  </button>
                ) : (
                  <span style={{ color: "#6c757d" }}>Inactiva</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabCategories;
