import { Navigate, Outlet } from 'react-router-dom';
import userStore from '../store/userStore';

export const AdminGuard = () => {
  const { userData } = userStore();

  if (userData?.role === "admin" || userData?.role === "superadmin") {
    return <Outlet />;
  }
  return <Navigate to="/" replace />;

};