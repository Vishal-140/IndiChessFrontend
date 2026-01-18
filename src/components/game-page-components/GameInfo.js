import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFire,
  FaRegHandshake,
  FaRobot,
  FaChessPawn,
  FaTimes,
} from "react-icons/fa";
import "../component-styles/GameInfo.css";

const GameInfo = ({ streak = 0, gameMode = "STANDARD" }) => {
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const pollingIntervalRef = useRef(null);
  const searchTimerRef = useRef(null);

  // 🧹 CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // ❌ CANCEL SEARCH
  const cancelSearch = async () => {
    console.log("❌ Cancelling search");

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    try {
      await fetch("http://localhost:8080/game/cancel-waiting", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cancelling search:", error);
    }

    setIsSearching(false);
    setSearchTime(0);
  };

  // 🔁 POLL FOR MATCH
  const pollForMatch = () => {
    let seconds = 0;
    const maxSeconds = 90;

    pollingIntervalRef.current = setInterval(async () => {
      seconds++;
      setSearchTime(seconds);

      if (seconds >= maxSeconds) {
        cancelSearch();
        alert("No opponent found in 90 seconds.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/game/check-match",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const result = await response.json();
        console.log("🔁 Poll result:", result);

        if (result.matchId > 0) {
          cancelSearch();
          navigate(`/game/${result.matchId}`, {
            state: { mode: gameMode },
          });
        }

        if (result.matchId === -2) {
          cancelSearch();
          alert("Error while matching. Try again.");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 1000);
  };

  // 🎮 CREATE NEW GAME
  const createNewGame = async () => {
    if (isSearching) {
      cancelSearch();
      return;
    }

    console.log("🎮 Creating new game:", gameMode);

    setIsSearching(true);
    setSearchTime(0);

    try {
      const response = await fetch("http://localhost:8080/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          mode: gameMode, // ✅ SEND MODE TO BACKEND
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create game");
      }

      const result = await response.json();
      console.log("🎯 Create game result:", result);

      if (result.matchId === -1) {
        // Waiting player
        pollForMatch();

        searchTimerRef.current = setTimeout(() => {
          cancelSearch();
          alert("No opponent found. Try again.");
        }, 90000);
      }

      if (result.matchId > 0) {
        setIsSearching(false);
        navigate(`/game/${result.matchId}`, {
          state: { mode: gameMode },
        });
      }
    } catch (error) {
      console.error("Create game error:", error);
      setIsSearching(false);
      alert("Could not create game.");
    }
  };

  return (
    <div className="game-info">
      {/* 🔥 STREAK */}
      <div className="streak">
        <FaFire size={30} />
        <div>
          <p>Streak</p>
          <h3>{streak} Days</h3>
        </div>
      </div>

      {/* 🎮 BUTTONS */}
      <div className="buttons">
        <button className="button">
          <FaChessPawn size={20} />
          Play 1 | 1
        </button>

        <button
          className={`button ${isSearching ? "searching" : ""}`}
          onClick={createNewGame}
        >
          {isSearching ? (
            <>
              <FaTimes size={20} />
              Cancel ({searchTime}s)
            </>
          ) : (
            <>
              <FaChessPawn size={20} />
              New Game ({gameMode})
            </>
          )}
        </button>

        <button className="button">
          <FaRobot size={20} />
          Play Bots
        </button>

        <button className="button">
          <FaRegHandshake size={20} />
          Play a Friend
        </button>
      </div>

      {/* 🔍 SEARCHING UI */}
      {isSearching && (
        <div className="searching-indicator">
          <div className="spinner"></div>
          <p>Searching for opponent... {searchTime}s</p>
          <p className="searching-hint">
            (Wait for another player to click "New Game")
          </p>
        </div>
      )}
    </div>
  );
};

export default GameInfo;
