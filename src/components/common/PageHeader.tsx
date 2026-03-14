import { useNavigate } from 'react-router-dom';
import useCashStore from '../../store/useCashStore';
import './../../css/components/common/PageHeader.css';
import userStore from '../../store/userStore';
import { formatDateToShow } from '../../helper/formatDate.helper';

export const PageHeader = ({ title, nav = true }: { title: string, nav?: boolean }) => {
  const navigation = useNavigate();
  const { cashBox } = useCashStore();
  const { userData } = userStore();
  return (
    <div className="container">
      <div className="cashbox-info">
        <p>Apertura: {cashBox ? formatDateToShow(cashBox.opened_at) : "N/A"}</p>
        <p>Usuario: {userData ? userData.name : "N/A"}</p>
        <p>Rol: {userData ? userData.role : "N/A"}</p>
      </div>
      {nav ? (
        <button className="btn-pos" onClick={() => navigation(-1)}>Ir atrás</button>
      ) : <div style={{ width: "75px" }} />}
      <h1>{title}</h1>
      <div style={{ width: "75px" }} />
    </div>
  )
}
