import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>POS Dashboard</h1>

      <Link to="/pos">Nueva Venta</Link>
      <br />

      <Link to="/products">Productos</Link>
    </div>
  );
}
