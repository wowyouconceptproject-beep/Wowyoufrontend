"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import {
  getSocket,
} from "@/lib/socket";

import {
  useAuth,
} from "./AuthContext";

interface RealtimeContextType {
  socket: Socket | null;
  connected: boolean;
}

const RealtimeContext =
  createContext<RealtimeContextType>({
    socket: null,
    connected: false,
  });

export function RealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    organization,
    loading,
  } = useAuth();

  const [
    socket,
    setSocket,
  ] = useState<Socket | null>(null);

  const [
    connected,
    setConnected,
  ] = useState(false);

  useEffect(() => {
    if (
      loading ||
      !organization
    ) {
      return;
    }

    const io =
      getSocket();

    if (!io.connected) {
      io.connect();
    }

    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    io.on(
      "connect",
      handleConnect
    );

    io.on(
      "disconnect",
      handleDisconnect
    );

    setSocket(io);

    if (io.connected) {
      setConnected(true);
    }

    return () => {
      io.off(
        "connect",
        handleConnect
      );

      io.off(
        "disconnect",
        handleDisconnect
      );

      io.disconnect();
    };
  }, [
    organization,
    loading,
  ]);

  const value =
    useMemo(
      () => ({
        socket,
        connected,
      }),
      [
        socket,
        connected,
      ]
    );

  return (
    <RealtimeContext.Provider
      value={value}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext() {
  const context =
    useContext(
      RealtimeContext
    );

  if (!context) {
    throw new Error(
      "useRealtimeContext must be used inside RealtimeProvider."
    );
  }

  return context;
}