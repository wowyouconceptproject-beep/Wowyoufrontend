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
} from "@/services/billing";

import {
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
        }
      } catch {
        /*
        |--------------------------------------------------------------------------
        | Billing is deliberately isolated.
        |
        | An unavailable billing endpoint should not destroy the user's
        | authentication session.
        |--------------------------------------------------------------------------
        */
        setSubscription(null);
      }

    } catch {
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

  const hasActiveSubscription =
    subscription !== null &&
    (
      subscription.status ===
        "ACTIVE" ||
      subscription.status ===
        "TRIALING"
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