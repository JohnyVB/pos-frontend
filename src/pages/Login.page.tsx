import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onLogin } from "../services/login.services";
import userStore from "../store/userStore";
import { PageHeader } from "../components/common/PageHeader";
import '../css/pages/Login.css'
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const { setToken, setUserData } = userStore();
  const [loading, setLoading] = useState(false);
  const { user, password, onChangeForm, resetForm } = useForm({
    user: "johny.villegas.dev@gmail.com",
    password: "351723",
  });

  const handleLogin = async () => {
    setLoading(true);
    const data = await onLogin(user, password);
    if (data.response === "success" && data.token && data.user) {
      setToken(data.token);
      setUserData(data.user);
      resetForm();
    } else {
      toast.error(data.message || "Login failed", { duration: 4000 })
    }
    setLoading(false);
  };

  return (
    <div className="padding-container">
      <PageHeader title="POS Login" nav={false} />
      <div className="login-container">
        <div className="input-container">
          <div>
            <label htmlFor="">Usuario</label>
            <input
              placeholder="User name o email"
              value={user}
              onChange={(e) => onChangeForm(e.target.value, "user")}
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
      <Toaster position="top-right" />
    </div>
  );
}
