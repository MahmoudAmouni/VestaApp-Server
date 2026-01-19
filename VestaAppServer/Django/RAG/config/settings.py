from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def env_bool(name: str, default: bool = False) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return val.strip().lower() in {"1", "true", "yes", "y", "on"}

def env_list(name: str, default: list[str]) -> list[str]:
    val = os.getenv(name)
    if not val:
        return default
    return [v.strip() for v in val.split(",") if v.strip()]

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = env_bool("DJANGO_DEBUG", True)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", ["127.0.0.1", "localhost"])

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.contenttypes",
    "rest_framework",
    "rag",
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "UNAUTHENTICATED_USER": None,
}
ROOT_URLCONF = "config.urls"

TEMPLATES: list[dict] = []

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "recipes")
CHROMA_DISTANCE = os.getenv("CHROMA_DISTANCE", "cosine")  

CHROMA_MODE = os.getenv("CHROMA_MODE", "embedded") 
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / ".chroma"))

CHROMA_HOST = os.getenv("CHROMA_HOST", "127.0.0.1")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8000"))
CHROMA_SSL = env_bool("CHROMA_SSL", False)

CHROMA_EMBEDDING_PROVIDER = os.getenv("CHROMA_EMBEDDING_PROVIDER", "default")  # default | sentence_transformer
SENTENCE_TRANSFORMER_MODEL = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "").strip()
LLM_API_KEY = os.getenv("LLM_API_KEY", "").strip()
LLM_MODEL = os.getenv("LLM_MODEL", "").strip()
LLM_TIMEOUT_SECONDS = int(os.getenv("LLM_TIMEOUT_SECONDS", "30"))
