import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../services/login.services";
import userStore from "../store/userStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUserData } = userStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await onLogin(email, password);
    if (data.response === "success" && data.token && data.user) {
      setToken(data.token);
      setUserData(data.user);
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>POS Login</h1>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        ¿No tienes cuenta?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
}
