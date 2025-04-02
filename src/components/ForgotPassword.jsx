import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css"; // Custom CSS for additional styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setMessage("Failed to send reset link.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="card forgot-password-card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Forgot Password</h2>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Send Reset Link
            </button>
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => navigate("/")}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;