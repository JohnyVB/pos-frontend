import { BrowserRouter, Routes, Route } from "react-router-dom";
import userStore from "../store/userStore";
import Login from "../pages/Login.page";
import Dashboard from "../pages/Dashboard.page";
import Register from "../pages/Register.page";
import POS from "../pages/POS.page";
import Products from "../pages/Products.page";
import CashBoxes from "../pages/CashBoxes.page";
import { CashBoxGuard } from "./CashBoxGuard.routes";

export default function AppRoutes() {
  const { token } = userStore();
  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route element={<CashBoxGuard />}>
              <Route path="/pos" element={<POS />} />
            </Route>
            <Route path="/products" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cash-boxes" element={<CashBoxes />} />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
