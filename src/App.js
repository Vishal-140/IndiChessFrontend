import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import HomeCard from "./pages/HomeCard";
import HomePage from "./pages/Home";
import Game from "./pages/Game";

import "./App.css";

/*
 🔐 PROTECTED ROUTE
 - Checks JWT ONLY ONCE
 - Stable (no redirect loops)
*/
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    let mounted = true;

    console.log("🔍 ProtectedRoute → checking /auth/me");

    axios
      .get("http://localhost:8080/auth/me", {
        withCredentials: true,
      })
      .then(() => {
        if (mounted) {
          console.log("✅ JWT valid");
          setIsAuth(true);
        }
      })
      .catch(() => {
        if (mounted) {
          console.log("❌ JWT invalid");
          setIsAuth(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // ⏳ Wait until auth is known
  if (isAuth === null) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Not logged in
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 PUBLIC */}
        <Route path="/" element={<HomeCard />} />
        <Route path="/login" element={<HomeCard />} />
        <Route path="/signup" element={<HomeCard />} />

        {/* 🔐 PROTECTED */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/game/:matchId"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
