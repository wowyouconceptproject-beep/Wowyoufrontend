"use client";

import { usePathname } from "next/navigation";

import { AuthProvider } from "@/context/AuthContext";
import Breadcrumb from "@/components/dashboard/navigation/Breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const items = pathname
    .split("/")
    .filter(Boolean)
    // Hide IDs (numbers or UUIDs)
    .filter(
      (segment) =>
        !/^\d+$/.test(segment) &&
        !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(segment)
    )
    .map((segment, index, segments) => ({
      label:
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, index + 1).join("/"),
    }));

  return (
    <AuthProvider>
      <div className="px-6 pt-6 md:px-8">
        <Breadcrumb items={items} />
      </div>

      {children}
    </AuthProvider>
  );
}