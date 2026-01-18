import React from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import GameInfo from "../components/game-page-components/GameInfo";

function Home() {
  const navigate = useNavigate();

  /*
    ❗ IMPORTANT
    - Auth is already handled by ProtectedRoute
    - DO NOT check /auth/me here
  */

  // 🎮 GAME MODE HANDLER
  const handleGameMode = (mode) => {
    console.log(`🎮 Selected game mode: ${mode}`);

    // For now, create a dummy matchId with mode
    // Later this will come from backend matchmaking
    const matchId = `new-${mode.toLowerCase()}`;

    navigate(`/game/${matchId}`, {
      state: { mode }, // pass mode safely
    });
  };

  return (
    <div className="app-container">
      <SideNav />

      <div className="main-container">
        <Header />

        <div className="game-info-container">
          <GameInfo />

          {/* 🎮 GAME MODES */}
          <div className="game-modes">
            <h3>Choose Game Type</h3>

            <button
              className="game-mode-btn"
              onClick={() => handleGameMode("STANDARD")}
            >
              Standard
            </button>

            <button
              className="game-mode-btn"
              onClick={() => handleGameMode("RAPID")}
            >
              Rapid
            </button>

            <button
              className="game-mode-btn"
              onClick={() => handleGameMode("BLITZ")}
            >
              Blitz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
