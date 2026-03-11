import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onLogin } from "../services/login.services";
import userStore from "../store/userStore";
import { PageHeader } from "../components/common/PageHeader";
import '../css/pages/Login.css'

export default function Login() {
  const { setToken, setUserData } = userStore();
  const [loading, setLoading] = useState(false);
  const { email, password, onChangeForm, resetForm } = useForm({
    email: "johny.villegas.dev@gmail.com",
    password: "351723",
  });

  const handleLogin = async () => {
    setLoading(true);
    const data = await onLogin(email, password);
    if (data.response === "success" && data.token && data.user) {
      setToken(data.token);
      setUserData(data.user);
      resetForm();
    } else {
      alert(data.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="padding-container">
      <PageHeader title="POS Login" nav={false} />
      <div className="login-container">
        <div className="input-container">
          <div>
            <label htmlFor="">Correo</label>
            <input
              placeholder="email"
              value={email}
              onChange={(e) => onChangeForm(e.target.value, "email")}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="">Contraseña</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => onChangeForm(e.target.value, "password")}
              className="input"
              required
            />
          </div>
          <div className="btn-container">
            <button className="btn-pos btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
