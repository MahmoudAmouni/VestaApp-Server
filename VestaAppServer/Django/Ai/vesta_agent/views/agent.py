from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from openai import OpenAI

from ..serializers import ShoppingListChatRequestSerializer
from ..services.agents.vesta_agent import VestaAgentService
from ..exceptions import AuthError
from .base import BaseAgentView
from ..validators import validate_input_content


class AgentChatView(BaseAgentView):
    """HTTP controller for the combined Vesta Agent (Shopping List + Pantry)."""

    def post(self, request):
        serializer = ShoppingListChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        message = data.get("message")
        audio_file = data.get("audio")

        if audio_file:
            try:
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                transcription = client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=(audio_file.name, audio_file.read(), audio_file.content_type)
                )
                message = transcription.text
                data["message"] = message
            except Exception as e:
                print(f"DEBUG: Audio Transcription Error: {e}")
                import traceback
                traceback.print_exc()
                return Response(
                    {"message": f"Audio Transcription Failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        if not message:
             return Response(
                {"message": "No message content found (text or audio)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            validate_input_content(message)
        except ValidationError as e:
            return Response(
                {"message": f"Security Restriction: {e.detail[0]}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        laravel_token = data.get("laravel_token") or self.extract_bearer_token(request)

        service = VestaAgentService(laravel_token=laravel_token)
        result = service.run(data=data)
        return Response(result, status=status.HTTP_200_OK)
