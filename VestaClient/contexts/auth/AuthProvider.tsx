import React, { useMemo, useEffect } from "react";
import { setAuthToken } from "@/api/http";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { useAuthSessionQuery } from "./auth.query";
import { useAuthMutations } from "./mutations/useAuthMutations";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessionQuery = useAuthSessionQuery();
  const {
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    error,
    updateUser,
    isUpdatingUser,
    googleLogin,
    isGoogleLoggingIn,
  } = useAuthMutations();

  useEffect(() => {
    if (sessionQuery.data?.token) {
      setAuthToken(sessionQuery.data.token);
    } else if (!sessionQuery.isLoading) {
      // Only clear if we are sure we are not loading (though usually null data means no session)
      setAuthToken(null);
    }
  }, [sessionQuery.data?.token, sessionQuery.isLoading]);

  const value = useMemo<AuthContextValue>(() => {
    const session = sessionQuery.data ?? null;

    return {
      session,
      token: session?.token ?? null,
      user: session?.user ?? null,
      homeId: session?.homeId ?? null,

      isLoading: sessionQuery.isLoading,
      isFetching: sessionQuery.isFetching,
      error: (sessionQuery.error ?? error) as Error | null,

      isLoggingIn,
      isRegistering,
      isLoggingOut,
      isUpdatingUser,
      isGoogleLoggingIn,

      login,
      register,
      logout,
      updateUser,
      googleLogin,
    };
  }, [
    sessionQuery.data,
    sessionQuery.isLoading,
    sessionQuery.isFetching,
    sessionQuery.error,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    isUpdatingUser,
    isGoogleLoggingIn,
    login,
    register,
    logout,
    updateUser,
    googleLogin,
    error,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
