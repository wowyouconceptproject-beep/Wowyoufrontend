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

interface AuthContextType {
  user: any;
  organization: any;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
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

  const [loading, setLoading] =
    useState(true);

  async function refresh() {
    try {
      const userResult =
        await getCurrentUser();

      if (!userResult.success) {
        throw new Error();
      }

      setUser(
        userResult.user
      );

      const orgResult =
        await getMyOrganization();

      if (
        orgResult.success
      ) {
        setOrganization(
          orgResult.organization
        );
      }

    } catch {

      localStorage.removeItem(
        "token"
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

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        loading,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}