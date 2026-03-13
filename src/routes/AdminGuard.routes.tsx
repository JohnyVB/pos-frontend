import { Navigate, Outlet } from 'react-router-dom';
import userStore from '../store/userStore';

export const AdminGuard = () => {
  const { userData } = userStore();

  if (!userData || userData.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};