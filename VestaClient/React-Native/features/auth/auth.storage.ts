import * as SecureStore from "expo-secure-store";
import type { AuthSession } from "./auth.types";

const AUTH_SESSION_KEY = "auth.session";
const USER_ALLERGIES_KEY = "user.allergies";

export async function saveAuthSession(session: AuthSession) {
  const available = await SecureStore.isAvailableAsync();
  if (!available) {
    console.warn(
      "[auth] SecureStore not available (are you running on web?). Session not persisted."
    );
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));

  if (session.user.allergies && session.user.allergies.length > 0) {
    await SecureStore.setItemAsync(
      USER_ALLERGIES_KEY,
      JSON.stringify(session.user.allergies)
    );
  }
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  const available = await SecureStore.isAvailableAsync();
  if (!available) {
    console.warn("[auth] SecureStore not available. Returning null session.");
    return null;
  }

  const raw = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    return session;
  } catch {
    return null;
  }
}

export async function clearAuthSession() {
  const available = await SecureStore.isAvailableAsync();
  if (!available) return;

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
  await SecureStore.deleteItemAsync(USER_ALLERGIES_KEY);
}
