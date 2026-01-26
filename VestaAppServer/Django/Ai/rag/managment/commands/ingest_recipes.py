from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand, CommandError
from tqdm import tqdm

from rag.services.chroma_service import ChromaService
from rag.services.text_builders import RecipeRecord, normalize_space, safe_json_list


def stable_id(recipe_name: str, ingredients: list[str]) -> str:
    base = (
        normalize_space(recipe_name).lower()
        + "|"
        + "|".join(sorted([normalize_space(x).lower() for x in ingredients]))
    )
    return hashlib.sha1(base.encode("utf-8")).hexdigest()


class Command(BaseCommand):
    help = "Ingest NEW recipes JSONL into Chroma (one recipe per line)."

    def add_arguments(self, parser):
        parser.add_argument("--path", required=True, help="Path to recipes.jsonl")
        parser.add_argument("--batch-size", type=int, default=500, help="Batch size for upsert")
        parser.add_argument("--limit", type=int, default=0, help="Optional limit for debugging (0 = no limit)")

    def handle(self, *args, **options):
        path = Path(options["path"])
        if not path.exists():
            raise CommandError(f"File not found: {path}")

        batch_size = int(options["batch_size"])
        limit = int(options["limit"])

        collection = ChromaService.instance().get_collection()

        ids: list[str] = []
        docs: list[str] = []
        metas: list[dict[str, Any]] = []

        seen = 0

        with path.open("r", encoding="utf-8") as f:
            for line_no, line in enumerate(tqdm(f, desc="Reading JSONL"), start=1):
                line = line.strip()
                if not line:
                    continue

                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue

                recipe_name = normalize_space(str(obj.get("name", "")))
                ingredients = [
                    normalize_space(x)
                    for x in safe_json_list(obj.get("ingredients"))
                    if normalize_space(x)
                ]
                directions = [
                    normalize_space(x)
                    for x in safe_json_list(obj.get("steps"))
                    if normalize_space(x)
                ]
                description = normalize_space(str(obj.get("description", "")))

                cuisines = [
                    normalize_space(x).lower()
                    for x in safe_json_list(obj.get("tags"))
                    if normalize_space(x)
                ]

                if not recipe_name or not ingredients:
                    continue

                record = RecipeRecord(
                    recipe_name=recipe_name,
                    ingredients=ingredients,
                    directions=directions,
                    cuisines=cuisines,
                    ner=[],
                    link="",
                    source="",
                )

               
                rid = obj.get("id")
                rid = str(int(rid)) if rid is not None and str(rid).strip() else stable_id(recipe_name, ingredients)

                doc = record.to_document()
                if description:
                    doc += f"\n\nDescription:\n{description}"

                meta = record.to_metadata()
                meta["source_line"] = line_no

                
                meta["description"] = description
                meta["minutes"] = obj.get("minutes")
                meta["contributor_id"] = obj.get("contributor_id")
                meta["submitted"] = obj.get("submitted")
                meta["n_steps"] = obj.get("n_steps")
                meta["n_ingredients"] = obj.get("n_ingredients")

                ids.append(rid)
                docs.append(doc)
                metas.append(meta)

                seen += 1
                if limit and seen >= limit:
                    break

                if len(ids) >= batch_size:
                    collection.upsert(ids=ids, documents=docs, metadatas=metas)
                    ids, docs, metas = [], [], []

        if ids:
            collection.upsert(ids=ids, documents=docs, metadatas=metas)

        self.stdout.write(self.style.SUCCESS(
            f"Ingest complete. Processed={seen}. Collection count={collection.count()}"
        ))
