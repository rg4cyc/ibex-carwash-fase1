import { createRequire } from "node:module";

const require = createRequire(new URL("../../frontend/package.json", import.meta.url));
const { io } = require("socket.io-client");

const socketUrl = process.env.SOCKET_URL || "http://localhost:4000";
const apiUrl = process.env.API_URL || "http://localhost:4000/api";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postEvent() {
  const response = await fetch(`${apiUrl}/t4/notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "t4.socketio.real",
      title: "Evento realtime T4",
      message: "Evento recibido por Socket.IO real desde prueba técnica",
      entity: {
        test: "socketio-realtime"
      }
    })
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function main() {
  console.log(`SOCKET_URL=${socketUrl}`);
  console.log(`API_URL=${apiUrl}`);

  const socket = io(socketUrl, {
    transports: ["polling", "websocket"],
    reconnectionAttempts: 2,
    timeout: 5000
  });

  let connected = false;
  let eventReceived = false;

  socket.on("connect", () => {
    connected = true;
    console.log(`SOCKET_CONNECTED id=${socket.id}`);
  });

  socket.on("connect_error", (error) => {
    console.log(`SOCKET_CONNECT_ERROR ${error.message}`);
  });

  socket.on("ibex:event", (event) => {
    if (event.type === "t4.socketio.real") {
      eventReceived = true;
      console.log("SOCKET_IBEX_EVENT_RECEIVED");
      console.log(JSON.stringify(event));
    }
  });

  for (let i = 0; i < 10; i += 1) {
    if (connected) break;
    await wait(500);
  }

  if (!connected) {
    socket.close();
    throw new Error("Socket.IO did not connect");
  }

  const result = await postEvent();
  console.log(`POST_STATUS=${result.status}`);
  console.log(`POST_FORWARDED=${result.data.forwardedToNotificationsService}`);

  for (let i = 0; i < 10; i += 1) {
    if (eventReceived) break;
    await wait(500);
  }

  socket.close();

  if (!eventReceived) {
    throw new Error("Socket.IO event was not received");
  }

  console.log("SOCKETIO_REALTIME_TEST_OK");
}

main().catch((error) => {
  console.error("SOCKETIO_REALTIME_TEST_FAILED");
  console.error(error.message);
  process.exitCode = 1;
});
