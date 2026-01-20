import { setAuthToken } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback } from "react";
import {
  apiGoogleAuth,
  apiLogin,
  apiRegister,
  apiUpdateUser,
} from "../../../features/auth/auth.api";
import {
  clearAuthSession,
  saveAuthSession,
} from "../../../features/auth/auth.storage";
import type {
  AuthSession,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
} from "../../../features/auth/auth.types";
import { authSessionKey } from "../auth.query";

export function useAuthMutations() {
  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (dto: LoginDto) => {
      const res = await apiLogin({ body: dto });

      const data = (res as any).data;
      if (!data)
        throw new Error(
          "Login response missing `data` (check backend JSON shape)."
        );

      const session: AuthSession = {
        token: data.access_token,
        tokenType: data.token_type,
        user: data.user,
        homeId: data.home_id,
      };

      return session;
    },
    onSuccess: async (session) => {
      qc.setQueryData(authSessionKey, session);
      await saveAuthSession(session);
      setAuthToken(session.token);

      router.replace("/");
    },
    onError: (err) => {
      console.error("[auth] login onError:", err);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const res = await apiRegister({ body: dto });

      const data = (res as any).data;
      if (!data)
        throw new Error(
          "Register response missing `data` (check backend JSON shape)."
        );

      const session: AuthSession = {
        token: data.access_token,
        tokenType: data.token_type,
        user: data.user,
        homeId: data.home.id,
        home: data.home,
      };

      return session;
    },
    onSuccess: async (session) => {
      qc.setQueryData(authSessionKey, session);
      await saveAuthSession(session);
      router.replace("/");
    },
    onError: (err) => console.error("[auth] register onError:", err),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await clearAuthSession();
      return null;
    },
    onSuccess: () => {
      qc.setQueryData(authSessionKey, null);
      console.log(authSessionKey);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (dto: UpdateUserDto) => {
      const res = await apiUpdateUser({ body: dto });

      const data = (res as any)?.data;
      if (!data) {
        throw new Error(
          "UpdateUser response missing `data` (check backend JSON shape)."
        );
      }

      const updatedUser = (data as any).user ?? data;
      if (!updatedUser) {
        throw new Error(
          "UpdateUser response missing user (check backend JSON shape)."
        );
      }

      return updatedUser;
    },

    onSuccess: async (updatedUser) => {
      const prev = qc.getQueryData<AuthSession | null>(authSessionKey);

      if (prev) {
        const next: AuthSession = {
          ...prev,
          user: { ...prev.user, ...updatedUser },
        };

        qc.setQueryData(authSessionKey, next);
        await saveAuthSession(next);
      }
    },

    onError: (err) => console.error("[auth] updateUser onError:", err),
  });

  const googleMutation = useMutation({
    mutationFn: async ({ token, isAccessToken }: { token: string; isAccessToken?: boolean }) => {
      const body = isAccessToken 
        ? { access_token: token } 
        : { id_token: token };
      
      const res = await apiGoogleAuth({ body });

      const data = (res as any).data;
      if (!data)
        throw new Error(
          "Google auth response missing `data` (check backend JSON shape)."
        );

      const session: AuthSession = {
        token: data.access_token,
        tokenType: data.token_type,
        user: data.user,
        homeId: data.home_id,
        home: data.home,
      };

      return { session, isNewUser: data.is_new_user };
    },

    onSuccess: async ({ session }) => {
      qc.setQueryData(authSessionKey, session);
      await saveAuthSession(session);
      setAuthToken(session.token);
      router.replace("/");
    },

    onError: (err) => console.error("[auth] google onError:", err),
  });

  // Use stable mutate references directly from React Query
  const login = loginMutation.mutate;
  const googleLogin = useCallback(
    (token: string, isAccessToken?: boolean) => googleMutation.mutate({ token, isAccessToken }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const register = registerMutation.mutate;
  const logout = logoutMutation.mutate;
  const updateUser = updateUserMutation.mutate;

  return {
    login,
    googleLogin,
    isGoogleLoggingIn: googleMutation.isPending,
    register,
    logout,
    updateUser,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    error:
      loginMutation.error ??
      registerMutation.error ??
      logoutMutation.error ??
      updateUserMutation.error ??
      null,
  };
}
