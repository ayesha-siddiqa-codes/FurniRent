import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);

      // Development only:
      // The backend currently returns the reset token.
      if (response.data.resetToken) {
        console.log("Reset Token:", response.data.resetToken);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process your request."
      );
    }
  };

  return (
    <div className="auth-page">
      <h2>Forgot Password?</h2>

      <p>
        Enter your registered email address to reset your password.
      </p>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <button type="submit">
          Send Reset Request
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;