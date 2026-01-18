import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Game() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const checkedRef = useRef(false);
  const stompRef = useRef(null);

  // 🎮 Game mode (STANDARD | RAPID | BLITZ)
  const gameMode = location.state?.mode || "STANDARD";

  // ⏱️ Initial time based on mode
  const getInitialTime = () => {
    if (gameMode === "BLITZ") return 3 * 60;
    if (gameMode === "RAPID") return 10 * 60;
    return null; // STANDARD → no timer
  };

  const [whiteTime, setWhiteTime] = useState(getInitialTime());
  const [blackTime, setBlackTime] = useState(getInitialTime());
  const [activePlayer, setActivePlayer] = useState("WHITE");

  /* =====================================================
     🔐 AUTH CHECK (RUN ONCE)
  ===================================================== */
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    console.log("🔐 Checking auth in Game page");

    fetch("http://localhost:8080/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          console.log("🚫 Not authenticated → redirect to /");
          navigate("/", { replace: true });
        }
      })
      .catch(() => navigate("/", { replace: true }));
  }, [navigate]);

  /* =====================================================
     🔌 WEBSOCKET CONNECT
  ===================================================== */
  useEffect(() => {
    console.log("🔌 Connecting WebSocket...");

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket connected");

        // 📡 Subscribe to match topic
        client.subscribe(`/topic/game/${matchId}`, (msg) => {
          const move = JSON.parse(msg.body);
          console.log("♟️ Move received:", move);

          // switch turn on received move
          setActivePlayer((p) => (p === "WHITE" ? "BLACK" : "WHITE"));
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      },
    });

    stompRef.current = client;
    client.activate();

    return () => {
      console.log("🔌 Disconnect WebSocket");
      client.deactivate();
    };
  }, [matchId]);

  /* =====================================================
     ⏱️ TIMER LOGIC
  ===================================================== */
  useEffect(() => {
    if (whiteTime === null && blackTime === null) return;

    const interval = setInterval(() => {
      if (activePlayer === "WHITE") {
        setWhiteTime((t) => (t > 0 ? t - 1 : 0));
      } else {
        setBlackTime((t) => (t > 0 ? t - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePlayer]);

  const formatTime = (seconds) => {
    if (seconds === null) return "∞";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* =====================================================
     ♟️ SEND MOVE (TEST)
  ===================================================== */
  const makeMove = () => {
    if (!stompRef.current || !stompRef.current.connected) {
      console.log("❌ WebSocket not connected");
      return;
    }

    const move = {
      matchId,
      from: "e2",
      to: "e4",
    };

    console.log("📤 Sending move:", move);

    stompRef.current.publish({
      destination: "/app/game/move",
      body: JSON.stringify(move),
    });

    // switch turn locally
    setActivePlayer((p) => (p === "WHITE" ? "BLACK" : "WHITE"));
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div style={{ padding: "20px" }}>
      <h2>Chess Game</h2>

      <p><b>Match ID:</b> {matchId}</p>
      <p><b>Game Mode:</b> {gameMode}</p>

      {/* ⏱️ TIMERS */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
        <div>
          <h3>White</h3>
          <p>{formatTime(whiteTime)}</p>
        </div>

        <div>
          <h3>Black</h3>
          <p>{formatTime(blackTime)}</p>
        </div>
      </div>

      {/* ♟️ BOARD (PLACEHOLDER) */}
      <div
        style={{
          width: "320px",
          height: "320px",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          border: "2px solid black",
        }}
      >
        {[...Array(64)].map((_, i) => (
          <div
            key={i}
            style={{
              background:
                (Math.floor(i / 8) + (i % 8)) % 2 === 0
                  ? "#eee"
                  : "#666",
              width: "40px",
              height: "40px",
            }}
          />
        ))}
      </div>

      {/* TEST BUTTON */}
      <button onClick={makeMove} style={{ marginTop: "20px" }}>
        Make Move (send via WebSocket)
      </button>
    </div>
  );
}

export default Game;
