import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginCard({ handleToggleSignup }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔍 Log when component mounts
  useEffect(() => {
    console.log("🟦 LoginCard mounted");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🔵 Login button clicked");
    console.log("➡️ Username:", username);
    console.log("➡️ Password length:", password.length);

    try {
      console.log("📡 Sending POST /login request...");

      const response = await axios.post(
        "http://localhost:8080/login",
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );

      console.log("✅ Login response status:", response.status);
      console.log("✅ Login response data:", response.data);

      if (response.status === 200) {
        console.log("🚀 Navigating to /home");
        navigate("/home");
      }
    } catch (err) {
      console.log("❌ Login failed");
      console.log("❌ Error response:", err?.response);
      console.log("❌ Error message:", err?.message);

      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-card">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              console.log("✏️ Username changed:", e.target.value);
              setUsername(e.target.value);
            }}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              console.log("✏️ Password typed (length):", e.target.value.length);
              setPassword(e.target.value);
            }}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="simple-auth-btn">
          Login
        </button>
      </form>

      <div className="oauth-buttons">
        <a href="http://localhost:8080/oauth2/authorization/google">
          <button className="btn-google">Login with Google</button>
        </a>

        <a href="http://localhost:8080/oauth2/authorization/github">
          <button className="btn-github">Login with GitHub</button>
        </a>
      </div>

      <div className="signup-link">
        Not an existing user?
        <button
          className="simple-auth-btn"
          onClick={() => {
            console.log("🔁 Switching to Signup page");
            handleToggleSignup();
          }}
        >
          Sign up here
        </button>
      </div>
    </div>
  );
}

export default LoginCard;
