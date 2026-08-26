import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);

      if (response.data.resetToken) {
        console.log("Reset Token:", response.data.resetToken);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="password-page">

      <div className="password-card">

        <div className="password-icon">
          🔐
        </div>

        <p className="password-label">
          ACCOUNT RECOVERY
        </p>

        <h1>
          Forgot Password?
        </h1>

        <p className="password-description">
          No worries. Enter your registered email address
          and we'll help you reset your password.
        </p>

        {message && (
          <div className="password-message success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="password-message error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="password-form">

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <Link
          to="/login"
          className="back-to-login"
        >
          ← Back to Login
        </Link>

      </div>

    </main>
  );
}

export default ForgotPassword;