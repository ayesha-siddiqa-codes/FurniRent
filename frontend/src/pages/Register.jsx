import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroBg from "../images/hero-bg.jpg";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <main className="register-page">

      {/* LEFT SIDE */}
      <div
        className="register-left"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="register-overlay"></div>

        <div className="register-brand">
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

      {/* RIGHT SIDE */}
      <div className="register-right">

        <div className="register-card">

          <p className="register-label">
            CREATE YOUR ACCOUNT
          </p>

          <h2>Register</h2>

          <p className="register-subtitle">
            Fill in the details below to create your account.
          </p>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="register-form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          <div className="register-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>

      </div>

    </main>
  );
}

export default Register;
