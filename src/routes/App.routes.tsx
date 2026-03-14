import { BrowserRouter, Routes, Route } from "react-router-dom";
import userStore from "../store/userStore";
import Login from "../pages/Login.page";
import Dashboard from "../pages/Dashboard.page";
import Register from "../pages/Register.page";
import POS from "../pages/POS.page";
import Products from "../pages/Products.page";
import CashboxSessions from "../pages/Cashbox-sessions.page";
import { CashBoxGuard } from "./CashBoxGuard.routes";
import { AdminGuard } from "./AdminGuard.routes";
import { SalesHistory } from "../pages/SalesHistory.page";
import Terminals from "../pages/Terminals.page";

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
            <Route element={<AdminGuard />}>
              <Route path="/register" element={<Register />} />
              <Route path="/sales-history" element={<SalesHistory />} />
              <Route path="/terminals" element={<Terminals />} />
            </Route>
            <Route path="/cashbox-sessions" element={<CashboxSessions />} />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
