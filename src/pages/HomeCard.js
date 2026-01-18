import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignUpCard";

function HomeCard() {
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Checking authentication from HomeCard...");

    fetch("http://localhost:8080/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        console.log("🔐 /auth/me status:", res.status);

        if (res.status !== 200) {
          console.log("❌ Not authenticated → stay on login");
          return;
        }

        const contentType = res.headers.get("content-type");

        // 🚨 CRITICAL CHECK
        if (!contentType || !contentType.includes("application/json")) {
          console.log("❌ Received HTML, not JWT auth");
          return;
        }

        console.log("✅ Authenticated → redirect to /home");
        navigate("/home");
      })
      .catch((err) => {
        console.log("❌ Auth check failed:", err);
      });
  }, [navigate]);

  const handleToggleSignup = () => {
    setShowSignup((prev) => !prev);
  };

  return (
    <div className="home-card">
      {showSignup ? (
        <SignupCard handleToggleSignup={handleToggleSignup} />
      ) : (
        <LoginCard handleToggleSignup={handleToggleSignup} />
      )}
    </div>
  );
}

export default HomeCard;
