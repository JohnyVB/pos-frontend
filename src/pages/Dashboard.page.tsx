import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onVerifyToken } from "../services/dashboard.services";
import userStore from "../store/userStore";

export default function Dashboard() {
  const { token, setToken, setUserData } = userStore();
  const navigation = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    navigation("/");
  };

  const verifyToken = async () => {
    const data = await onVerifyToken(token!);
    console.log(JSON.stringify(data, null, 2));
    if (data.response === "error") {
      handleLogout();
    }
  };

  useEffect(() => {
    verifyToken();
  }, [])

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
