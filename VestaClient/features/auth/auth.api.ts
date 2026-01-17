import { fetchJson } from "@/api/http";
import type {
  ApiEnvelope,
  GoogleAuthData,
  GoogleAuthDto,
  LoginData,
  LoginDto,
  RegisterData,
  RegisterDto,
  UpdateUserDto,
  UpdateUserResponse,
} from "./auth.types";

export function apiRegister(args: { body: RegisterDto; signal?: AbortSignal }) {
  return fetchJson<ApiEnvelope<RegisterData>>("/register", {
    method: "POST",
    body: args.body,
    signal: args.signal,
  },"login");
}

export function apiLogin(args: { body: LoginDto; signal?: AbortSignal }) {
  return fetchJson<ApiEnvelope<LoginData>>(
    "/login",
    {
      method: "POST",
      body: args.body,
      signal: args.signal,
    },
    "login"
  );
}


export async function apiUpdateUser({ body }: { body: UpdateUserDto }) {

  return fetchJson<UpdateUserResponse>(
    "/users",
    { method:"POST",body},
  );
}


export function apiGoogleAuth(args: {
  body: GoogleAuthDto;
  signal?: AbortSignal;
}) {
  return fetchJson<ApiEnvelope<GoogleAuthData>>(
    "/auth/google",
    {
      method: "POST",
      body: args.body,
      signal: args.signal,
    },
    "login"
  );
}