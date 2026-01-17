import * as SecureStore from "expo-secure-store";
const KEYS = {
  accessToken: "auth.accessToken",
  refreshToken: "auth.refreshToken",
  userId: "auth.userId",
  user: "auth.user", 
} as const;

async function setItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

async function getItem(key: string) {
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  return SecureStore.deleteItemAsync(key);
}

export async function saveSession(opts: {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  user?: unknown; 
}) {
  await setItem(KEYS.accessToken, opts.accessToken);
  await setItem(KEYS.userId, String(opts.userId));
  if (opts.refreshToken) await setItem(KEYS.refreshToken, opts.refreshToken);
  if (opts.user) await setItem(KEYS.user, JSON.stringify(opts.user));
}

export async function loadSession() {
  const [accessToken, refreshToken, userId, userJson] = await Promise.all([
    getItem(KEYS.accessToken),
    getItem(KEYS.refreshToken),
    getItem(KEYS.userId),
    getItem(KEYS.user),
  ]);

  return {
    accessToken,
    refreshToken,
    userId,
    user: userJson ? safeJsonParse(userJson) : null,
  };
}

export async function clearSession() {
  await Promise.all([
    deleteItem(KEYS.accessToken),
    deleteItem(KEYS.refreshToken),
    deleteItem(KEYS.userId),
    deleteItem(KEYS.user),
  ]);
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
