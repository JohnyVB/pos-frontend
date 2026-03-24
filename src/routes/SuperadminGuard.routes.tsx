import { Navigate, Outlet } from "react-router-dom";
import userStore from "../store/userStore";

export const SuperadminGuard = () => {
  const { userData } = userStore();
  if (userData && userData.role === "superadmin") {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}
