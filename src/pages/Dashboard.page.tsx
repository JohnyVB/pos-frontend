import { Link, useNavigate } from "react-router-dom";
import userStore from "../store/userStore";

export default function Dashboard() {
  const { setToken, setUserData } = userStore();
  const navigation = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    navigation("/");
  };

  return (
    <div>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <h1>POS Dashboard</h1>
      </div>

      <Link to="/pos">Nueva Venta</Link>
      <br />

      <Link to="/products">Productos</Link>
      <br />

      <Link to="/register">Registrar Usuario</Link>
      <br />

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
