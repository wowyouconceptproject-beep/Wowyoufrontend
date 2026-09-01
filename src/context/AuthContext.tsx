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
        throw new Error(
          "Unable to authenticate user.",
        );
      }

      setUser(
        userResult.user,
      );

      /*
      |--------------------------------------------------------------------------
      | Organization
      |--------------------------------------------------------------------------
      |
      | Organization is checked before billing.
      |
      | A newly registered organizer may not have an organization yet.
      | That is a valid onboarding state and must NOT trigger a billing
      | request.
      |
      */

      const orgResult =
        await getMyOrganization();

      if (
        orgResult.success &&
        orgResult.organization
      ) {
        setOrganization(
          orgResult.organization,
        );

        /*
        |--------------------------------------------------------------------------
        | organizer Subscription
        |--------------------------------------------------------------------------
        |
        | Billing only applies once an organization exists.
        |
        */

        try {
          const billingResult =
            await getBillingSubscription();

          if (
            billingResult.success &&
            billingResult.subscription
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
          | Billing failure must never destroy authentication or organization
          | state.
          |
          */

          setSubscription(null);
        }
      } else {
        /*
        |--------------------------------------------------------------------------
        | No Organization Yet
        |--------------------------------------------------------------------------
        |
        | This is the normal state immediately after registration.
        |
        | The dashboard will display the existing organization creation
        | interface.
        |
        | IMPORTANT:
        | Do NOT call billing here.
        |
        */

        setOrganization(null);
        setSubscription(null);
      }
    } catch (error) {
      /*
      |--------------------------------------------------------------------------
      | Authentication Failure
      |--------------------------------------------------------------------------
      */

      console.error(
        "AUTH CONTEXT REFRESH ERROR:",
        error,
      );

      localStorage.removeItem(
        "token",
      );

      window.location.href =
        "/login";
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Initial Authentication Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    refresh();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Valid Trial Period
  |--------------------------------------------------------------------------
  |
  | A TRIALING subscription is only considered active while its
  | currentPeriodEnd is in the future.
  |
  */

  const hasValidTrialPeriod =
    subscription?.status ===
      "TRIALING" &&
    typeof subscription.currentPeriodEnd ===
      "string" &&
    subscription.currentPeriodEnd.length > 0 &&
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
    typeof subscription?.currentPeriodEnd ===
      "string"
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
  | ACTIVE:
  | Paid subscription is active.
  |
  | TRIALING:
  | Trial is active only while currentPeriodEnd is in the future.
  |
  */

  const hasActiveSubscription =
    subscription !== null &&
    (
      subscription.status ===
        "ACTIVE" ||
      hasValidTrialPeriod
    );

  /*
  |--------------------------------------------------------------------------
  | Context
  |--------------------------------------------------------------------------
  */

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