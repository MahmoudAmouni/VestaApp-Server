import type {
  RagSearchRequest,
  RagSearchResponse,
  RagSearchResponseRaw,
} from "./recipes.rag.types";

const RAG_API_BASE_URL = "http://192.168.0.107:8001";

export const RAG_LIST_SEP = "$$";

type HttpMethod = "GET" | "POST";

type FetchJsonOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function fetchRagJson<T>(
  path: string,
  opts: FetchJsonOptions = {}
): Promise<T> {
  const { method = "GET", body, token, signal, headers } = opts;

  const res = await fetch(`${RAG_API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

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
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function encodeList(
  list: string[] | undefined | null,
  sep = RAG_LIST_SEP
): string {
  if (!Array.isArray(list) || list.length === 0) return "";

  return list
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean)
    .join(sep);
}

type RagSearchParams = {
  token?: string;
  signal?: AbortSignal;

  query: string;

  cuisines?: string[];
  mustContain?: string[];
  mustNotContain?: string[];
};

export async function apiRagSearchRecipes(
  params: RagSearchParams
): Promise<RagSearchResponse> {
  const { token, signal, query, cuisines, mustContain, mustNotContain } =
    params;

  const body: RagSearchRequest = {
    query,
    n_results: 2,
    seed: Math.floor(Math.random() * 1000000),
    ...(cuisines?.length ? { cuisines } : {}),
    ...(mustContain?.length ? { must_contain: mustContain } : {}),
    ...(mustNotContain?.length ? { must_not_contain: mustNotContain } : {}),
  };

  const raw = await fetchRagJson<RagSearchResponseRaw>(`/api/v1/rag/search`, {
    method: "POST",
    token,
    signal,
    body,
  });

  return {
    ...raw,
    results: (raw.results ?? []).map((r) => ({
      ...r,
      ingredients: encodeList(r.ingredients),
      directions: encodeList(r.directions),
    })),
  };
}
