import { Navigate, Outlet } from 'react-router-dom';
import useCashStore from '../store/useCashStore';

export const CashBoxGuard = () => {
  const { cashBoxSession } = useCashStore();
  console.log(cashBoxSession);


  // Si no hay caja o el estatus no es OPEN, bloqueamos el acceso
  if (!cashBoxSession || cashBoxSession.session_status === "CLOSED") {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza las rutas hijas
  return <Outlet />;
};