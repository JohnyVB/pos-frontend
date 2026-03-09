import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onRegister } from "../services/register.services";

export default function Register() {
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
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <button onClick={() => window.history.back()}>Ir atrás</button>
        <h1>Registrar Usuario</h1>
        <div style={{ width: "75px" }}></div>
      </div>

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
    </div>
  );
}
