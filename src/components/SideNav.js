import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./component-styles/SideNav.css";
import {
  FaChessPawn,
  FaSun,
  FaCog,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";

const SideNav = () => {
  const [lightMode, setLightMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleToggleLightMode = () => {
    setLightMode((prev) => !prev);
  };

  // 🚪 LOGOUT HANDLER (JWT COOKIE CLEAR)
  const handleLogout = async () => {
    if (loggingOut) return; // prevent double click
    setLoggingOut(true);

    console.log("🚪 Logging out...");

    try {
      const res = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // 🔴 REQUIRED to clear cookie
      });

      console.log("🔐 Logout response:", res.status);

      // Always redirect to login after logout
      console.log("✅ Redirecting to login");
      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ Logout failed:", err);
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className={`side-nav ${lightMode ? "light-mode" : ""}`}>
      <div className="logo">
        <h2>Chess.com</h2>
        <FaChessPawn size={40} />
      </div>

      <div className="menu">
        <button className="menu-item">
          <FaChessPawn size={20} />
          Play
        </button>
      </div>

      <div className="settings">
        <button className="settings-item" onClick={handleToggleLightMode}>
          <FaSun size={20} />
          Light UI
        </button>

        <button className="settings-item">
          <FaBars size={20} />
          Collapse
        </button>

        <button className="settings-item">
          <FaCog size={20} />
          Settings
        </button>

        <button className="settings-item">
          <FaBars size={20} />
          Support
        </button>

        {/* 🚪 LOGOUT */}
        <button
          className="settings-item logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <FaSignOutAlt size={20} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default SideNav;