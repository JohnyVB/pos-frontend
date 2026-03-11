import { useNavigate } from 'react-router-dom';
import './../../css/components/common/PageHeader.css';

export const PageHeader = ({ title, nav = true }: { title: string, nav?: boolean }) => {
  const navigation = useNavigate();
  return (
    <div className="container">
      {nav ? (
        <button className="btn-pos" onClick={() => navigation(-1)}>Ir atrás</button>
      ) : <div style={{ width: "75px" }} />}
      <h1>{title}</h1>
      <div style={{ width: "75px" }} />
    </div>
  )
}
