from __future__ import annotations

import json
from typing import Any, Optional

from rag.services.chroma_service import ChromaService
from rag.services.text_builders import normalize_space


def _safe_json_list(raw: Any) -> list[str]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return [str(x) for x in raw if str(x).strip()]

    if not isinstance(raw, str):
        return []

    s = raw.strip()
    if not s:
        return []

    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [str(x) for x in parsed if str(x).strip()]
    except Exception:
        return []

    return []


def _normalize_tokens(tokens: Optional[list[str]]) -> list[str]:
    if not tokens:
        return []
    return [normalize_space(t).lower() for t in tokens if normalize_space(t)]


class RagService:
    def search(
    self,
    query: str,
    n_results: int = 10,
    seed: Optional[int] = None,
    cuisines: Optional[list[str]] = None,
    must_contain: Optional[list[str]] = None,
    must_not_contain: Optional[list[str]] = None,
) -> dict[str, Any]:
        
        collection = ChromaService.instance().get_collection()

        cuisines_norm = _normalize_tokens(cuisines)
        where = {"cuisine_primary": {"$in": cuisines_norm}} if cuisines_norm else None

        doc_filters: list[dict[str, str]] = []
        for t in _normalize_tokens(must_contain):
            doc_filters.append({"$contains": t})
        for t in _normalize_tokens(must_not_contain):
            doc_filters.append({"$not_contains": t})

        where_document = None
        if doc_filters:
            where_document = doc_filters[0] if len(doc_filters) == 1 else {"$and": doc_filters}

        fetch_count = n_results * 3 if seed is not None else n_results

        results = collection.query(
            query_texts=[query],
            n_results=fetch_count,
            where=where,
            where_document=where_document,
            include=["documents", "metadatas", "distances"],
        )

        ids = (results.get("ids") or [[]])[0]
        metas = (results.get("metadatas") or [[]])[0]
        dists = (results.get("distances") or [[]])[0]

        hits: list[dict[str, Any]] = []
        for rid, meta, dist in zip(ids, metas, dists):
            meta = meta or {}

            ingredients = _safe_json_list(meta.get("ingredients_json"))
            if not ingredients:
                ingredients = _safe_json_list(meta.get("ingredients"))

            directions = _safe_json_list(meta.get("directions_json"))
            if not directions:
                directions = _safe_json_list(meta.get("steps"))
            if not directions:
                directions = _safe_json_list(meta.get("directions"))

            cuisines_list: list[str] = []
            cuisines_val = meta.get("cuisines")

            if isinstance(cuisines_val, list):
                cuisines_list = [str(x).strip() for x in cuisines_val if str(x).strip()]
            elif isinstance(cuisines_val, str):
                cuisines_raw = cuisines_val.strip()
                cuisines_list = cuisines_raw.split("|") if cuisines_raw and cuisines_raw != "unknown" else []
            else:
                tags_val = meta.get("tags")
                if isinstance(tags_val, list):
                    cuisines_list = [str(x).strip() for x in tags_val if str(x).strip()]
                elif isinstance(tags_val, str):
                    tags_raw = tags_val.strip()
                    cuisines_list = tags_raw.split("|") if tags_raw and tags_raw != "unknown" else []

            cuisine_primary = (meta.get("cuisine_primary") or "").strip()
            if not cuisine_primary or cuisine_primary == "unknown":
                cuisine_primary = cuisines_list[0] if cuisines_list else "unknown"

            recipe_name = (meta.get("recipe_name") or meta.get("name") or "").strip()

            description = (meta.get("description") or "").strip()

            hits.append(
                {
                    "id": rid,
                    "recipe_name": recipe_name,
                    "cuisine_primary": cuisine_primary,
                    "cuisines": cuisines_list,
                    "ingredients": ingredients,
                    "directions": directions,
                    "distance": dist,
                    "description": description,
                }
            )

        if seed is not None and len(hits) > n_results:
            import random
            random.seed(seed)
            random.shuffle(hits)
            hits = hits[:n_results]

        return {"query": query, "count": len(hits), "results": hits}

    