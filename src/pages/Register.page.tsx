import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onRegister } from "../services/register.services";
import { PageHeader } from "../components/common/PageHeader";
import toast, { Toaster } from "react-hot-toast";
import './../css/pages/Register.css'

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const { name, email, username, password, role, onChangeForm, resetForm } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const handleRegister = async () => {
    if (!name || !username || !password) {
      toast.error("Los campos nombre, usuario y contraseña son obligatorios", { duration: 4000 })
      return;
    }
    setLoading(true);
    try {
      const result = await onRegister(name, username, email, password, role);
      if (result.response === "error") {
        toast.error(result.message || "Error al registrar usuario", { duration: 4000 })
        setLoading(false);
        return;
      }
      resetForm();
      toast.success("Usuario registrado correctamente", { duration: 4000 })
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar usuario", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding-container">
      <PageHeader title="Registrar Usuario" />
      <div className="register-container">
        <div className="form-container">
          <div>
            <label>Nombre</label>
            <input
              className="input"
              placeholder="nombre"
              type="text"
              name="name"
              value={name}
              onChange={(e) => onChangeForm(e.target.value, "name")}
              required
            />
          </div>
          <div>
            <label>Usuario</label>
            <input
              className="input"
              placeholder="username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => onChangeForm(e.target.value, "username")}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              className="input"
              placeholder="example@example.com (opcional)"
              type="email"
              name="email"
              value={email}
              onChange={(e) => onChangeForm(e.target.value, "email")}
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              className="input"
              placeholder="******"
              type="password"
              name="password"
              value={password}
              onChange={(e) => onChangeForm(e.target.value, "password")}
              required
            />
          </div>
          <div>
            <label>Rol</label>
            <select
              className="select"
              name="role"
              value={role}
              onChange={(e) => onChangeForm(e.target.value, "role")}
              required
            >
              <option value="admin">Administrador</option>
              <option value="cashier">Cajero</option>
            </select>
          </div>
          <div className="btn-container">
            <button className="btn-pos btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
