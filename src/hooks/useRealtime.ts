"use client";

import { useEffect } from "react";

import { useRealtimeContext } from "@/context/RealtimeContext";

interface UseRealtimeOptions {
  eventId?: string;

  onAttendance?: (
    payload: any,
  ) => void;

  onActivity?: (
    payload: any,
  ) => void;

  onStaffOnline?: (
    payload: any,
  ) => void;

  onStaffOffline?: (
    payload: any,
  ) => void;

  onAnnouncementCreated?: (
    payload: any,
  ) => void;

  onAnnouncementUpdated?: (
    payload: any,
  ) => void;

  onAnnouncementDeleted?: (
    payload: any,
  ) => void;

  onVendorApplicationCreated?: (
    payload: any,
  ) => void;

  onVendorApplicationUpdated?: (
    payload: any,
  ) => void;
}

export function useRealtime({
  eventId,
  onAttendance,
  onActivity,
  onStaffOnline,
  onStaffOffline,
  onAnnouncementCreated,
  onAnnouncementUpdated,
  onAnnouncementDeleted,
  onVendorApplicationCreated,
  onVendorApplicationUpdated,
}: UseRealtimeOptions) {
  const { socket } =
    useRealtimeContext();

  useEffect(() => {
    if (!socket) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Join Event Room
    |--------------------------------------------------------------------------
    */

    if (eventId) {
      socket.emit(
        "join-event",
        eventId,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Attendance
    |--------------------------------------------------------------------------
    */

    if (onAttendance) {
      socket.on(
        "attendance.updated",
        onAttendance,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Activity
    |--------------------------------------------------------------------------
    */

    if (onActivity) {
      socket.on(
        "activity.created",
        onActivity,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Announcements
    |--------------------------------------------------------------------------
    */

    if (
      onAnnouncementCreated
    ) {
      socket.on(
        "announcement.created",
        onAnnouncementCreated,
      );
    }

    if (
      onAnnouncementUpdated
    ) {
      socket.on(
        "announcement.updated",
        onAnnouncementUpdated,
      );
    }

    if (
      onAnnouncementDeleted
    ) {
      socket.on(
        "announcement.deleted",
        onAnnouncementDeleted,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Vendor Applications
    |--------------------------------------------------------------------------
    */

    if (
      onVendorApplicationCreated
    ) {
      socket.on(
        "vendor.application.created",
        onVendorApplicationCreated,
      );
    }

    if (
      onVendorApplicationUpdated
    ) {
      socket.on(
        "vendor.application.updated",
        onVendorApplicationUpdated,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Staff Presence
    |--------------------------------------------------------------------------
    */

    if (onStaffOnline) {
      socket.on(
        "staff.online",
        onStaffOnline,
      );
    }

    if (onStaffOffline) {
      socket.on(
        "staff.offline",
        onStaffOffline,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      if (eventId) {
        socket.emit(
          "leave-event",
          eventId,
        );
      }

      if (onAttendance) {
        socket.off(
          "attendance.updated",
          onAttendance,
        );
      }

      if (onActivity) {
        socket.off(
          "activity.created",
          onActivity,
        );
      }

      if (
        onAnnouncementCreated
      ) {
        socket.off(
          "announcement.created",
          onAnnouncementCreated,
        );
      }

      if (
        onAnnouncementUpdated
      ) {
        socket.off(
          "announcement.updated",
          onAnnouncementUpdated,
        );
      }

      if (
        onAnnouncementDeleted
      ) {
        socket.off(
          "announcement.deleted",
          onAnnouncementDeleted,
        );
      }

      if (
        onVendorApplicationCreated
      ) {
        socket.off(
          "vendor.application.created",
          onVendorApplicationCreated,
        );
      }

      if (
        onVendorApplicationUpdated
      ) {
        socket.off(
          "vendor.application.updated",
          onVendorApplicationUpdated,
        );
      }

      if (onStaffOnline) {
        socket.off(
          "staff.online",
          onStaffOnline,
        );
      }

      if (onStaffOffline) {
        socket.off(
          "staff.offline",
          onStaffOffline,
        );
      }
    };
  }, [
    socket,
    eventId,
    onAttendance,
    onActivity,
    onAnnouncementCreated,
    onAnnouncementUpdated,
    onAnnouncementDeleted,
    onVendorApplicationCreated,
    onVendorApplicationUpdated,
    onStaffOnline,
    onStaffOffline,
  ]);
}