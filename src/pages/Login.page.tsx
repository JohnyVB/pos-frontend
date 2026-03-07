import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { onLogin } from "../services/login.services";
import userStore from "../store/userStore";

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
    <div>
      <h1>POS Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => onChangeForm(e.target.value, "email")}
        required
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => onChangeForm(e.target.value, "password")}
        required
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
