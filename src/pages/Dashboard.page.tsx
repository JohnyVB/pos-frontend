import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
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
    if (data.response === "error") {
      handleLogout();
    }
  };

  useEffect(() => {
    verifyToken();
  }, [])

  return (
    <div className="padding-container">
      <PageHeader title="POS Dashboard" nav={false} />
      <div className="nav-button-container">
        <button className="btn-pos" onClick={() => navigation("/pos")}>Nueva Venta</button>
        <button className="btn-pos" onClick={() => navigation("/products")}>Productos</button>
        <button className="btn-pos" onClick={() => navigation("/register")}>Registrar Usuario</button>
        <button className="btn-pos btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
