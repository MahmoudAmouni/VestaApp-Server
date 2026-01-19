from __future__ import annotations

import json
from typing import Any, Optional

from rag.services.chroma_service import ChromaService
from rag.services.llm_service import LLMService
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

        results = collection.query(
            query_texts=[query],
            n_results=n_results,
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

            # --- Ingredients: support old ("ingredients_json") and new ("ingredients") ---
            ingredients = _safe_json_list(meta.get("ingredients_json"))
            if not ingredients:
                ingredients = _safe_json_list(meta.get("ingredients"))

            # --- Directions/Steps: support old ("directions_json") and new ("steps") ---
            directions = _safe_json_list(meta.get("directions_json"))
            if not directions:
                directions = _safe_json_list(meta.get("steps"))
            if not directions:
                directions = _safe_json_list(meta.get("directions"))

            # --- Cuisines/tags: support old pipe-string and new list ---
            cuisines_list: list[str] = []
            cuisines_val = meta.get("cuisines")

            if isinstance(cuisines_val, list):
                cuisines_list = [str(x).strip() for x in cuisines_val if str(x).strip()]
            elif isinstance(cuisines_val, str):
                cuisines_raw = cuisines_val.strip()
                cuisines_list = cuisines_raw.split("|") if cuisines_raw and cuisines_raw != "unknown" else []
            else:
                # new dataset often stores tags as a list
                tags_val = meta.get("tags")
                if isinstance(tags_val, list):
                    cuisines_list = [str(x).strip() for x in tags_val if str(x).strip()]
                elif isinstance(tags_val, str):
                    tags_raw = tags_val.strip()
                    cuisines_list = tags_raw.split("|") if tags_raw and tags_raw != "unknown" else []

            cuisine_primary = (meta.get("cuisine_primary") or "").strip()
            if not cuisine_primary or cuisine_primary == "unknown":
                cuisine_primary = cuisines_list[0] if cuisines_list else "unknown"

        # --- Name: support old ("recipe_name") and new ("name") ---
            recipe_name = (meta.get("recipe_name") or meta.get("name") or "").strip()

        # --- Description: NEW (string) ---
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

        return {"query": query, "count": len(hits), "results": hits}

    def answer(
        self,
        question: str,
        query: str,
        n_results: int = 10,
        cuisines: Optional[list[str]] = None,
        must_contain: Optional[list[str]] = None,
        must_not_contain: Optional[list[str]] = None,
    ) -> dict[str, Any]:
        retrieval = self.search(
            query=query,
            n_results=n_results,
            cuisines=cuisines,
            must_contain=must_contain,
            must_not_contain=must_not_contain,
        )

        context_lines: list[str] = []
        for i, r in enumerate(retrieval["results"], start=1):
            steps = r.get("directions") or []
            steps_preview = " | ".join([normalize_space(x) for x in steps[:3]]) if steps else ""

            ner = r.get("ner") or []
            ner_preview = ", ".join([normalize_space(x) for x in ner[:12]]) if ner else ""

            cuisines_list = r.get("cuisines") or []
            cuisines_preview = ", ".join(cuisines_list) if cuisines_list else (r.get("cuisine_primary") or "unknown")

            link = r.get("link") or ""
            source = r.get("source") or ""

            context_lines.append(
                f"[{i}] name={r.get('recipe_name')} | cuisine={cuisines_preview}"
                + (f" | ner={ner_preview}" if ner_preview else "")
                + (f" | steps_preview={steps_preview}" if steps_preview else "")
                + (f" | source={source}" if source else "")
                + (f" | link={link}" if link else "")
            )

        system = (
            "You are a cooking assistant. "
            "Use ONLY the provided recipes. "
            "If the provided recipes do not contain enough information, say: "
            "'Not found in the provided dataset.' "
            "Do not invent recipe details."
        )
        # REMOVE THESE FROM HERE TO ANOTHER FILE
        user = (
            f"Question: {question}\n\n"
            f"Retrieved recipes:\n" + "\n".join(context_lines) + "\n\n"
            "Return:\n"
            "1) Best matching recipe name (or top 2)\n"
            "2) Why it matches (2-4 bullets)\n"
            "3) Steps (short, based on provided steps only)\n"
            "4) Optional substitutions (only if reasonable from ingredients/ner)\n"
            "5) Include the recipe link if available\n"
        )

        llm = LLMService()
        if not llm.is_configured():
            return {
                "answer": None,
                "note": "LLM not configured. Returning retrieval + prepared prompt.",
                "prompt": {"system": system, "user": user},
                "retrieval": retrieval,
            }

        answer_text = llm.chat(system=system, user=user)
        return {"answer": answer_text, "retrieval": retrieval}
