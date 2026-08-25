import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroBg from "../images/hero-bg.jpg";
function Login() {
  const { login,logout } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

     if (data.user.role !== role) {
  logout();

  setError(
    `This account is not registered as ${
      role === "admin" ? "an admin" : "a user"
    }.`
  );

  return;
}

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="login-page">

      <div
  className="login-left"
  style={{ backgroundImage: `url(${heroBg})` }}
>
        <div className="login-overlay"></div>

        <div className="login-brand">
          <p>FurniRent</p>

          <h1>
            Beautiful furniture.
            <br />
            <em>Without the commitment.</em>
          </h1>

          <span>
            Rent furniture that fits your space, style and lifestyle.
          </span>
        </div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <p className="login-label">WELCOME BACK</p>

          <h2>Sign in</h2>

          <p className="login-subtitle">
            Choose how you want to continue.
          </p>

          <div className="role-selection">

            <button
              type="button"
              className={`role-card ${
                role === "user" ? "active" : ""
              }`}
              onClick={() => {
                setRole("user");
                setError("");
              }}
            >
              <span className="role-icon">👤</span>

              <span>
                <strong>Continue as User</strong>
                <small>Rent furniture & manage rentals</small>
              </span>
            </button>

            <button
              type="button"
              className={`role-card ${
                role === "admin" ? "active" : ""
              }`}
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              <span className="role-icon">👑</span>

              <span>
                <strong>Continue as Admin</strong>
                <small>Manage furniture & rentals</small>
              </span>
            </button>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <p className="forgot-password-link">
  <a href="/forgot-password">Forgot password?</a>
</p>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Sign in as {role === "admin" ? "Admin" : "User"}
            </button>

          </form>

          <p className="login-footer">
            Furniture Rental · Find your perfect space
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;