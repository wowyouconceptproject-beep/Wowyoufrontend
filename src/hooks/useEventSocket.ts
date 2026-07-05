"use client";

import {
  useEffect,
} from "react";

import {
  getSocket,
} from "@/lib/socket";

export function useEventSocket(
  eventId: string
) {
  useEffect(() => {

    if (!eventId) {
      return;
    }

    const socket =
      getSocket();

    socket.connect();

    socket.emit(
      "join.event",
      eventId
    );

    return () => {

      socket.emit(
        "leave.event",
        eventId
      );

    };

  }, [eventId]);
}