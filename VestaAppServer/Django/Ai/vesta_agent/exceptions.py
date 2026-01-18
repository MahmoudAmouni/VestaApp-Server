class AgentError(Exception):
    """Base exception for agent service."""


class AuthError(AgentError):
    """Raised when auth token is missing/invalid."""


class UpstreamError(AgentError):
    """Raised when Laravel returns an error response."""


class ValidationError(AgentError):
    """Raised when inputs are invalid."""
