import { createContext, useContext } from "react";
import type {
  AuthSession,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
} from "../../features/auth/auth.types";

export type AuthContextValue = {
  session: AuthSession | null;

  token: string | null;
  user: AuthSession["user"] | null;
  homeId: number | null;

  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;

  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  isUpdatingUser: boolean;
  isGoogleLoggingIn: boolean;
  
  
  googleLogin: (idToken: string) => void;
  updateUser: (dto: UpdateUserDto) => void;
  login: (dto: LoginDto) => void;
  register: (dto: RegisterDto) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
