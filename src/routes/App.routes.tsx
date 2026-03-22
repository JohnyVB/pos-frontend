import { BrowserRouter, Routes, Route } from "react-router-dom";
import userStore from "../store/userStore";
import Login from "../pages/Login.page";
import Dashboard from "../pages/Dashboard.page";
import Register from "../pages/Register.page";
import POS from "../pages/POS.page";
import Products from "../pages/Products.page";
import CashboxSessions from "../pages/Cashbox-sessions.page";
import CashMovements from "../pages/CashMovements.page";
import { CashBoxGuard } from "./CashBoxGuard.routes";
import { AdminGuard } from "./AdminGuard.routes";
import { SalesHistory } from "../pages/Sales-history.page";
import Terminals from "../pages/Terminals.page";
import Stores from "../pages/Stores.page";

export default function AppRoutes() {
  const { token } = userStore();
  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales-history" element={<SalesHistory />} />
            <Route path="/cashbox-sessions" element={<CashboxSessions />} />
            <Route path="/cash-movements" element={<CashMovements />} />
            <Route element={<CashBoxGuard />}>
              <Route path="/pos" element={<POS />} />
            </Route>
            <Route element={<AdminGuard />}>
              <Route path="/products" element={<Products />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terminals" element={<Terminals />} />
              <Route path="/stores" element={<Stores />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
