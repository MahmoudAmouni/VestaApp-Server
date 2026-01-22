from __future__ import annotations

import threading
from dataclasses import dataclass
from typing import Any, Optional

from django.conf import settings

@dataclass(frozen=True)
class ChromaConfig:
    mode: str
    persist_dir: str
    host: str
    port: int
    ssl: bool
    collection_name: str
    distance: str
    embedding_provider: str
    sentence_transformer_model: str

class ChromaService:

    _lock = threading.Lock()
    _instance: Optional["ChromaService"] = None

    def __init__(self, cfg: ChromaConfig):
        self._cfg = cfg
        self._client = None
        self._collection = None

    @classmethod
    def instance(cls) -> "ChromaService":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cfg = ChromaConfig(
                        mode=settings.CHROMA_MODE,
                        persist_dir=settings.CHROMA_PERSIST_DIR,
                        host=settings.CHROMA_HOST,
                        port=settings.CHROMA_PORT,
                        ssl=settings.CHROMA_SSL,
                        collection_name=settings.CHROMA_COLLECTION_NAME,
                        distance=settings.CHROMA_DISTANCE,
                        embedding_provider=settings.CHROMA_EMBEDDING_PROVIDER,
                        sentence_transformer_model=settings.SENTENCE_TRANSFORMER_MODEL,
                    )
                    cls._instance = cls(cfg)
        return cls._instance

    def get_collection(self):
        if self._collection is None:
            with self._lock:
                if self._collection is None:
                    self._collection = self._init_collection()
        return self._collection

    def _init_client(self):
        if self._client is not None:
            return self._client

        import chromadb 

        if self._cfg.mode == "server":
            self._client = chromadb.HttpClient(
                host=self._cfg.host,
                port=self._cfg.port,
                ssl=self._cfg.ssl,
            )
        else:
            self._client = chromadb.PersistentClient(path=self._cfg.persist_dir)

        return self._client

    def _embedding_function(self):
        if self._cfg.embedding_provider == "default":
            return None

        if self._cfg.embedding_provider == "sentence_transformer":
            from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction  
            return SentenceTransformerEmbeddingFunction(model_name=self._cfg.sentence_transformer_model)

        raise ValueError(f"Unsupported CHROMA_EMBEDDING_PROVIDER={self._cfg.embedding_provider}")

    def _init_collection(self):
        client = self._init_client()
        embedding_function = self._embedding_function()

        metadata = {"hnsw:space": self._cfg.distance}

        return client.get_or_create_collection(
            name=self._cfg.collection_name,
            embedding_function=embedding_function,
            metadata=metadata,
        )
