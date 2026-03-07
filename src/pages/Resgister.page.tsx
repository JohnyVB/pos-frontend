import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onRegister } from "../services/register.services";
import { useForm } from "../hooks/useForm";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { name, email, password, role, onChangeForm, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onRegister(name, email, password, role);
      if (result.response === "error") {
        alert(result.message || "Error al registrar usuario");
        setLoading(false);
        return;
      }
      resetForm();
      alert("Usuario registrado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registrar Usuario</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => onChangeForm(e.target.value, "name")}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => onChangeForm(e.target.value, "email")}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
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
            name="role"
            value={role}
            onChange={(e) => onChangeForm(e.target.value, "role")}
            required
          >
            <option value="admin">Administrador</option>
            <option value="cashier">Cajero</option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Vuelve al login
        </button>
      </p>
    </div>
  );
}
