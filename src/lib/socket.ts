import {
  io,
  Socket,
} from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) {
    return socket;
  }

  socket = io(
    process.env.NEXT_PUBLIC_API_URL!,
    {
      autoConnect: false,

      transports: [
        "websocket",
      ],

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: 1000,

      reconnectionDelayMax: 5000,

      timeout: 20000,
    }
  );

  socket.on(
    "connect_error",
    (error) => {
      console.error(
        "[Socket] Connection Error:",
        error.message
      );
    }
  );

  socket.on(
    "reconnect",
    (attempt) => {
      console.log(
        `[Socket] Reconnected after ${attempt} attempt(s).`
      );
    }
  );

  socket.on(
    "disconnect",
    (reason) => {
      console.log(
        "[Socket] Disconnected:",
        reason
      );
    }
  );

  return socket;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = null;
}