"use client";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
} from "react";

import {
  AuthProvider,
  useAuth,
} from "@/context/AuthContext";

import Breadcrumb from "@/components/dashboard/navigation/Breadcrumb";

function DashboardAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    loading,
    organization,
    hasActiveSubscription,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Billing Is Always Accessible
  |--------------------------------------------------------------------------
  |
  | An organization without an active subscription must be able to reach
  | the billing page to purchase a plan.
  |
  */

  const isBillingPage =
    pathname ===
      "/dashboard/billing" ||
    pathname.startsWith(
      "/dashboard/billing/",
    );

  /*
  |--------------------------------------------------------------------------
  | Dashboard Home
  |--------------------------------------------------------------------------
  |
  | The dashboard already contains the existing organization creation flow.
  |
  | Therefore, a user who has not created an organization yet must be
  | allowed to access /dashboard.
  |
  */

  const isDashboardHome =
    pathname === "/dashboard";

  /*
  |--------------------------------------------------------------------------
  | Access Control
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (loading) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | No Organization
    |--------------------------------------------------------------------------
    |
    | Do NOT send the user to billing.
    |
    | The existing dashboard handles organization creation.
    |
    */

    if (!organization) {
      if (!isDashboardHome) {
        router.replace(
          "/dashboard",
        );
      }

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Organization Exists
    |--------------------------------------------------------------------------
    |
    | Subscription enforcement only starts after an organization exists.
    |
    */

    if (
      !isBillingPage &&
      !hasActiveSubscription
    ) {
      router.replace(
        "/dashboard/billing",
      );
    }
  }, [
    loading,
    organization,
    hasActiveSubscription,
    isBillingPage,
    isDashboardHome,
    router,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-neutral-500">
          Loading your organization...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Organization
  |--------------------------------------------------------------------------
  |
  | Allow the existing dashboard organization creation UI to render.
  |
  */

  if (!organization) {
    return (
      <>
        {children}
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Subscription Inactive
  |--------------------------------------------------------------------------
  */

  if (
    !isBillingPage &&
    !hasActiveSubscription
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />

          <p className="text-sm text-neutral-500">
            Redirecting to billing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const items = pathname
    .split("/")
    .filter(Boolean)
    /*
    |--------------------------------------------------------------------------
    | Hide IDs
    |--------------------------------------------------------------------------
    */

    .filter(
      (segment) =>
        !/^\d+$/.test(segment) &&
        !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(
          segment,
        ),
    )
    .map(
      (
        segment,
        index,
        segments,
      ) => ({
        label:
          segment
            .charAt(0)
            .toUpperCase() +
          segment
            .slice(1)
            .replace(
              /-/g,
              " ",
            ),

        href:
          "/" +
          segments
            .slice(
              0,
              index + 1,
            )
            .join("/"),
      }),
    );

  return (
    <AuthProvider>
      <DashboardAccessGuard>
        <div className="px-6 pt-6 md:px-8">
          <Breadcrumb
            items={items}
          />
        </div>

        {children}
      </DashboardAccessGuard>
    </AuthProvider>
  );
}