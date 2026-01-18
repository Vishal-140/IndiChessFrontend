import React, { useState, useEffect } from "react";
import axios from "axios";

function SignupCard({ handleToggleSignup }) {

  const [username, setUsername] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  // 🔍 Log when component mounts
  useEffect(() => {
    console.log("🟩 SignupCard mounted");
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🟢 Signup button clicked");
    console.log("➡️ Username:", username);
    console.log("➡️ Email:", emailId);
    console.log("➡️ Password length:", password.length);
    console.log("➡️ Country:", country);

    try {
      console.log("📡 Sending POST /signup request...");

      const response = await axios.post(
        "http://localhost:8080/signup",
        {
          username,
          emailId,
          password,
          country,
        }
      );

      console.log("✅ Signup response status:", response.status);
      console.log("✅ Signup response data:", response.data);

      // If signup is successful, show login
      if (response.status === 200 || response.status === 201) {
        console.log("🔁 Signup successful, switching to Login");
        handleToggleSignup();
      }
    } catch (err) {
      console.log("❌ Signup failed");
      console.log("❌ Error response:", err?.response);
      console.log("❌ Error message:", err?.message);

      setError("Error in signup. Please try again.");
    }
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "India",
    "Germany",
    "France",
    "Japan",
    "South Korea",
    "Mexico",
    "Brazil",
    "China",
    "Russia",
    "Italy",
  ];

  return (
    <div className="signup-card">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup} className="signup-form">
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={emailId}
            onChange={(e) => {
              console.log("✏️ Email changed:", e.target.value);
              setEmailId(e.target.value);
            }}
            placeholder="Enter your email"
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

        <div className="input-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => {
              console.log("✏️ Country selected:", e.target.value);
              setCountry(e.target.value);
            }}
            required
          >
            <option value="">Select your country</option>
            {countries.map((countryName, index) => (
              <option key={index} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="simple-auth-btn">
          Sign Up
        </button>
      </form>

      <div className="login-link">
        Already an existing user?
        <button
          className="simple-auth-btn"
          onClick={() => {
            console.log("🔁 Switching to Login from Signup");
            handleToggleSignup();
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default SignupCard;
