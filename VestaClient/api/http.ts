const API_BASE_URL = {
  base: "http://127.0.0.1:8000/api/v1",
  auth: "http://127.0.0.1:8000/api",
};
// const API_BASE_URL = {
//   base: "http://52.47.107.193:80/api/v1",
//   auth: "http://52.47.107.193:80/api",
// };

type HttpMethod = "GET" | "POST";

type FetchJsonOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

let AUTH_TOKEN: string | null = null;

export function setAuthToken(token: string | null) {
  AUTH_TOKEN = token;
}

export function clearAuthToken() {
  AUTH_TOKEN = null;
}

export function getAuthToken() {
  return AUTH_TOKEN;
}

export async function fetchJson<T>(
  path: string,
  opts: FetchJsonOptions = {},
  login?: string,
): Promise<T> {
  const { method = "GET", body, token, signal, headers } = opts;

  const effectiveToken = token ?? AUTH_TOKEN ?? undefined;

  const res = await fetch(
    `${!login ? API_BASE_URL.base : API_BASE_URL.auth}${path}`,
    {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(effectiveToken
          ? { Authorization: `Bearer ${effectiveToken}` }
          : {}),
        ...(headers ?? {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    },
  );
  console.log(body);

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const msg =
      parsed &&
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed
        ? String((parsed as any).message)
        : `Request failed (${res.status})`;

    throw new Error(msg);
  }

  return (parsed ?? {}) as T;
}

function safeJsonParse(input: string): unknown | null {
  try {
    console.log(input);
    return JSON.parse(input);
  } catch {
    return null;
  }
}
