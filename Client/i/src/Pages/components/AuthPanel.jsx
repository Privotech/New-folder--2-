import { useState } from "react";
import "./AuthPanel.css";

const API_BASE = "http://localhost:5001/api/auth";

export default function AuthPanel({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? "register" : "login";
      const payload = isRegister
        ? { username, email, password, passwordConfirm }
        : { email, password };

      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed");
      }

      onAuthSuccess({ token: data.token, user: data.user });
      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{isRegister ? "Create account" : "Sign in"}</h2>
      <p className="auth-subtitle">
        {isRegister
          ? "Register to manage your personal tasks."
          : "Sign in to access your tasks and dashboard."}
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            required
          />
        )}
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
        {isRegister && (
          <input
            type="password"
            className="auth-input"
            placeholder="Confirm password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            minLength={6}
            required
          />
        )}
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        type="button"
        className="auth-switch"
        onClick={() => {
          setMode(isRegister ? "login" : "register");
          setError("");
        }}
      >
        {isRegister
          ? "Already have an account? Sign in"
          : "No account? Create one"}
      </button>
    </div>
  );
}
