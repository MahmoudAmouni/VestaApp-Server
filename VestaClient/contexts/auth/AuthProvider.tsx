import React, { useMemo } from "react";
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
