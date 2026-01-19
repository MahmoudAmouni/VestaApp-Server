from django.urls import path
from rag.controllers.rag_controller import AnswerAPIView, SearchAPIView
from rag.controllers.health_controller import HealthAPIView

urlpatterns = [
    path("health", HealthAPIView.as_view(), name="health"),
    path("api/v1/rag/search", SearchAPIView.as_view(), name="rag-search"),
    path("api/v1/rag/answer", AnswerAPIView.as_view(), name="rag-answer"),
]
