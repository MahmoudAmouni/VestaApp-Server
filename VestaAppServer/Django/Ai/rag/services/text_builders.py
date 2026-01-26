from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any

_WHITESPACE_RE = re.compile(r"\s+")

def normalize_space(s: str) -> str:
    return _WHITESPACE_RE.sub(" ", (s or "").strip())

def safe_list(val: Any) -> list[str]:
    if not val:
        return []
    if isinstance(val, list):
        return [str(x) for x in val if str(x).strip()]
    return [str(val)]

def safe_json_list(val: Any) -> list[str]:

    if not val:
        return []
    if isinstance(val, list):
        return [str(x) for x in val if str(x).strip()]
    if isinstance(val, str):
        s = val.strip()
        if not s:
            return []
        try:
            parsed = json.loads(s)
            if isinstance(parsed, list):
                return [str(x) for x in parsed if str(x).strip()]
        except Exception:
            pass
        return [s]
    return [str(val)]

@dataclass(frozen=True)
class RecipeRecord:
    recipe_name: str
    ingredients: list[str]
    directions: list[str]
    cuisines: list[str]
    ner: list[str]
    link: str
    source: str

    @property
    def cuisine_primary(self) -> str:
        return self.cuisines[0] if self.cuisines else "unknown"

    def to_document(self) -> str:
        name = normalize_space(self.recipe_name).lower()
        cuisines = ", ".join(self.cuisines) if self.cuisines else "unknown"
        ingredients = ", ".join([normalize_space(x).lower() for x in self.ingredients])

        ner = ", ".join([normalize_space(x).lower() for x in self.ner]) if self.ner else ""

        directions = " ".join([normalize_space(x) for x in self.directions])

        parts = [
            f"Recipe: {name}",
            f"Cuisine: {cuisines}",
            f"Ingredients: {ingredients}",
        ]
        if ner:
            parts.append(f"NER: {ner}")
        if directions:
            parts.append(f"Directions: {directions}")

        return "\n".join(parts)

    def to_metadata(self) -> dict[str, str]:
        return {
            "recipe_name": normalize_space(self.recipe_name),
            "cuisine_primary": self.cuisine_primary,
            "cuisines": "|".join(self.cuisines) if self.cuisines else "unknown",
            "ingredients_json": json.dumps(self.ingredients, ensure_ascii=False),
            "directions_json": json.dumps(self.directions, ensure_ascii=False),
            "ner_json": json.dumps(self.ner, ensure_ascii=False),
            "link": self.link or "",
            "source": self.source or "",
        }
