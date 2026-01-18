import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const createStompClient = (matchId, onMessage) => {
  const client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket connected");

      client.subscribe(`/topic/game/${matchId}`, (msg) => {
        const data = JSON.parse(msg.body);
        onMessage(data);
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error", frame);
    },
  });

  return client;
};
