"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "@/services/auth";

import {
  getMyOrganization,
} from "@/services/organization";

import {
  getBillingSubscription,
  OrganizationSubscription,
} from "@/services/billing";

interface AuthContextType {
  user: any;

  organization: any;

  subscription:
    | OrganizationSubscription
    | null;

  loading: boolean;

  refresh: () => Promise<void>;

  hasActiveSubscription: boolean;

  isTrialing: boolean;

  trialDaysRemaining: number;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<any>(null);

  const [
    organization,
    setOrganization,
  ] = useState<any>(null);

  const [
    subscription,
    setSubscription,
  ] =
    useState<OrganizationSubscription | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | Refresh Authentication State
  |--------------------------------------------------------------------------
  */

  async function refresh() {
    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Current User
      |--------------------------------------------------------------------------
      */

      const userResult =
        await getCurrentUser();

      if (!userResult.success) {
        throw new Error();
      }

      setUser(
        userResult.user,
      );

      /*
      |--------------------------------------------------------------------------
      | Organization
      |--------------------------------------------------------------------------
      */

      const orgResult =
        await getMyOrganization();

      if (
        orgResult.success
      ) {
        setOrganization(
          orgResult.organization,
        );
      } else {
        setOrganization(null);
      }

      /*
      |--------------------------------------------------------------------------
      | Organizer Subscription
      |--------------------------------------------------------------------------
      */

      try {
        const billingResult =
          await getBillingSubscription();

        if (
          billingResult.success
        ) {
          setSubscription(
            billingResult.subscription,
          );
        } else {
          setSubscription(null);
        }
      } catch {
        /*
        |--------------------------------------------------------------------------
        | Billing Isolation
        |--------------------------------------------------------------------------
        |
        | Billing failure must not destroy authentication.
        |
        */

        setSubscription(null);
      }
    } catch {
      /*
      |--------------------------------------------------------------------------
      | Authentication Failure
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem(
        "token",
      );

      window.location.href =
        "/login";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Valid Trial Period
  |--------------------------------------------------------------------------
  */

  const hasValidTrialPeriod =
    subscription?.status ===
      "TRIALING" &&
    !!subscription.currentPeriodEnd &&
    new Date(
      subscription.currentPeriodEnd,
    ).getTime() >
      Date.now();

  /*
  |--------------------------------------------------------------------------
  | Trial Status
  |--------------------------------------------------------------------------
  */

  const isTrialing =
    hasValidTrialPeriod;

  /*
  |--------------------------------------------------------------------------
  | Trial Days Remaining
  |--------------------------------------------------------------------------
  */

  const trialDaysRemaining =
    hasValidTrialPeriod &&
    subscription.currentPeriodEnd
      ? Math.max(
          0,
          Math.ceil(
            (
              new Date(
                subscription.currentPeriodEnd,
              ).getTime() -
              Date.now()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              ),
          ),
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Active Subscription
  |--------------------------------------------------------------------------
  |
  | ACTIVE = active paid subscription.
  |
  | TRIALING = active only when the trial end date is still in the future.
  |
  */

  const hasActiveSubscription =
    subscription !== null &&
    (
      subscription.status ===
        "ACTIVE" ||
      hasValidTrialPeriod
    );

  return (
    <AuthContext.Provider
      value={{
        user,

        organization,

        subscription,

        loading,

        refresh,

        hasActiveSubscription,

        isTrialing,

        trialDaysRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext,
  );
}