import { BrowserRouter, Routes, Route } from "react-router-dom";
import userStore from "../store/userStore";
import Login from "../pages/Login.page";
import Dashboard from "../pages/Dashboard.page";
import Register from "../pages/Resgister.page";
import POS from "../pages/POS.page";

export default function AppRoutes() {
  const { token } = userStore();
  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            {/* <Route path="/products" element={<Products />} /> */}
          </>
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
