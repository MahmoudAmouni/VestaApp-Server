from django.urls import path
from rag.views.health_controller import HealthAPIView
from rag.views.rag import SearchAPIView

urlpatterns = [
    path("health", HealthAPIView.as_view(), name="health"),
    path("search", SearchAPIView.as_view(), name="rag-search"),
]
