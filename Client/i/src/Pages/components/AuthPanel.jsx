import { useState } from "react";
import "./AuthPanel.css";
import { SunIcon, MoonIcon, GlobeIcon } from "./Icons";

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

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      if (isRegister) {
        // Registration: Check if email already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.some((u) => u.email === email)) {
          throw new Error("Email already registered");
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          username,
          email,
          password, // In production, this would be hashed
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Auto-login after registration
        const token = btoa(`${email}:${newUser.id}`);
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        onAuthSuccess({ token, user: newUser });
        resetForm();
      } else {
        // Login: Check credentials
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u) => u.email === email && u.password === password,
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const token = btoa(`${email}:${user.id}`);
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        onAuthSuccess({ token, user });
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth integration
    alert("Google login will be implemented with OAuth integration");
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Dark Left Side */}
        <div className="auth-dark-side">
          <div className="auth-theme-toggle">
            <button className="theme-btn light-mode" title="Light mode">
              <SunIcon />
            </button>
            <button className="theme-btn dark-mode active" title="Dark mode">
              <MoonIcon />
            </button>
          </div>

          <div className="auth-moon-container">
            <div className="red-moon"></div>
            <div className="silhouette"></div>
          </div>

          <div className="auth-designer-credit">
            <div className="designer-avatar">OP</div>
            <div className="designer-info">
              <p className="designer-name">Oyegbile privilege</p>
              <p className="designer-title">Software developper</p>
            </div>
          </div>
        </div>

        {/* Light Right Side */}
        <div className="auth-right-side">
          <div className="auth-header">
            <h1 className="auth-brand">Privokeep</h1>
            <div className="auth-language-selector">
              <button className="lang-btn" title="Language selector">
                <GlobeIcon />
                <span>EN</span>
              </button>
            </div>
          </div>

          <div className="auth-content">
            <h2 className="auth-title">
              {isRegister ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="auth-subtitle">
              {isRegister ? "welcome to Privokeep" : "welcome to Privokeep"}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="form-group">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    minLength={3}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {isRegister && (
                <div className="form-group">
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-icon">G</span>
              {isRegister ? "Sign up with Google" : "Login with Google"}
            </button>

            <p className="auth-toggle-text">
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={() => {
                  setMode(isRegister ? "login" : "register");
                  setError("");
                }}
              >
                {isRegister ? "Sign In" : "Sign Up"}
              </button>
            </p>

            <div className="auth-social-icons">
              <a href="#" className="social-icon" title="Facebook">
                f
              </a>
              <a href="#" className="social-icon" title="LinkedIn">
                in
              </a>
              <a href="#" className="social-icon" title="Instagram">
                📷
              </a>
              <a href="#" className="social-icon" title="Twitter">
                𝕏
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
