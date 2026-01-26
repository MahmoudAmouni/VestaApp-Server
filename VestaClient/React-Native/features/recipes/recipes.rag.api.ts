import { fetchJson } from "@/api/http";
import type {
  RagSearchRequest,
  RagSearchResponse,
  RagSearchResponseRaw,
} from "./recipes.rag.types";

export const RAG_LIST_SEP = "$$";

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

  const raw = await fetchJson<RagSearchResponseRaw>("/rag/search", {
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

