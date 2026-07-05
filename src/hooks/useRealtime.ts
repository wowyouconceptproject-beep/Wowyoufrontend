"use client";

import { useEffect } from "react";

import { useRealtimeContext } from "@/context/RealtimeContext";

interface UseRealtimeOptions {
  eventId: string;

  onAttendance?: (payload: any) => void;

  onActivity?: (payload: any) => void;

  onStaffOnline?: (payload: any) => void;

  onStaffOffline?: (payload: any) => void;
}

export function useRealtime({
  eventId,
  onAttendance,
  onActivity,
  onStaffOnline,
  onStaffOffline,
}: UseRealtimeOptions) {
  const { socket } =
    useRealtimeContext();

  useEffect(() => {
    if (!socket || !eventId) {
      return;
    }

    socket.emit(
      "event.join",
      eventId
    );

    if (onAttendance) {
      socket.on(
        "attendance.updated",
        onAttendance
      );
    }

    if (onActivity) {
      socket.on(
        "activity.created",
        onActivity
      );
    }

    if (onStaffOnline) {
      socket.on(
        "staff.online",
        onStaffOnline
      );
    }

    if (onStaffOffline) {
      socket.on(
        "staff.offline",
        onStaffOffline
      );
    }

    return () => {
      socket.emit(
        "event.leave",
        eventId
      );

      if (onAttendance) {
        socket.off(
          "attendance.updated",
          onAttendance
        );
      }

      if (onActivity) {
        socket.off(
          "activity.created",
          onActivity
        );
      }

      if (onStaffOnline) {
        socket.off(
          "staff.online",
          onStaffOnline
        );
      }

      if (onStaffOffline) {
        socket.off(
          "staff.offline",
          onStaffOffline
        );
      }
    };
  }, [
    socket,
    eventId,
    onAttendance,
    onActivity,
    onStaffOnline,
    onStaffOffline,
  ]);
}