from __future__ import annotations

from rest_framework.response import Response
from rest_framework.views import APIView

from rag.serializers.rag_serializers import AnswerRequestSerializer, SearchRequestSerializer
from rag.services.rag_service import RagService

class SearchAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = RagService().search(**serializer.validated_data)
        return Response(result)

class AnswerAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = AnswerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = RagService().answer(**serializer.validated_data)
        return Response(result)
