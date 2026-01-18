from rest_framework.views import APIView
from ..exceptions import AuthError

class BaseAgentView(APIView):
    """Base view containing shared logic for agent views."""

    def extract_bearer_token(self, request) -> str | None:
        """Extracts the Bearer token from the Authorization header."""
        auth = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
        if not auth:
            return None
        if not auth.lower().startswith("bearer "):
            return None
        return auth.split(" ", 1)[1].strip() or None
